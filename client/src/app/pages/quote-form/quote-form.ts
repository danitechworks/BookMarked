import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QuotesService } from '../../services/quotes';

@Component({
  selector: 'app-quote-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.scss'
})
export class QuoteForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly quotesService = inject(QuotesService);

  private readonly router = inject(Router);

  protected isSubmitting = false;
  protected errorMessage = '';

  protected quoteForm = this.formBuilder.nonNullable.group({
    text: ['', Validators.required],
    author: ['', Validators.required]
  });

  protected onSubmit(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const request = this.quoteForm.getRawValue();

    this.quotesService.create(request).subscribe({
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
          this.errorMessage = 'Could not create the quote.';
        }
      }
    });
  }
}
