import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { QuotesService } from '../../services/quotes';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quote-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.scss'
})
export class QuoteForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly quotesService = inject(QuotesService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  protected quoteId: number | null = null;

  protected isSubmitting = false;
  protected isLoading = false;

  protected errorMessage = '';

  protected get isEditMode(): boolean {
    return this.quoteId !== null;
  }

  protected quoteForm = this.formBuilder.nonNullable.group({
    text: ['', Validators.required],
    author: ['', Validators.required]
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    this.quoteId = id;
    this.isLoading = true;

    this.quotesService.getById(id).subscribe({
      next: quote => {
        this.quoteForm.patchValue({
          text: quote.text,
          author: quote.author
        });

        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage =
            'Your session has expired. Please log in again.';
        } else if (error.status === 404) {
          this.errorMessage = 'Quote not found.';
        } else {
          this.errorMessage = 'Could not load the quote.';
        }
      }
    });
  }


  protected onSubmit(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const request = this.quoteForm.getRawValue();

    const saveRequest: Observable<unknown> =
      this.quoteId === null
        ? this.quotesService.create(request)
        : this.quotesService.update(this.quoteId, request);

    saveRequest.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/quotes']);
      },
      error: error => {
        this.isSubmitting = false;

        if (error.status === 401) {
          this.errorMessage =
            'Your session has expired. Please log in again.';
        } else {
          this.errorMessage =
            this.quoteId === null
              ? 'Could not create the quote.'
              : 'Could not update the quote.';
        }
      }
    });
  }
}

