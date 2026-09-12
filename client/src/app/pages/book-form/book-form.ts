import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BooksService } from '../../services/books';

function validIsoDate(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value;

  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value ? { invalidDate: true } : null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  const isRealDate = date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isRealDate) {
    return { invalidDate: true };
  }

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return date.getTime() <= todayUtc
    ? null
    : { futureDate: true };
}

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.scss'
})
export class BookForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly booksService = inject(BooksService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private bookId: number | null = null;

  protected isEditMode = false;
  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';

  protected readonly bookForm =
    this.formBuilder.nonNullable.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      publicationDate: ['', [Validators.required, validIsoDate]]
    });

  ngOnInit(): void {
    const idValue = this.route.snapshot.paramMap.get('id');

    if (idValue === null) {
      return;
    }

    const id = Number(idValue);

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid book ID.';
      return;
    }

    this.bookId = id;
    this.isEditMode = true;
    this.loadBook(id);
  }

  private loadBook(id: number): void {
    this.isLoading = true;

    this.booksService.getById(id).subscribe({
      next: book => {
        this.bookForm.patchValue({
          title: book.title,
          author: book.author,
          publicationDate: book.publicationDate
        });

        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;

        this.errorMessage = error.status === 404
          ? 'Book not found.'
          : 'Could not load the book.';
      }
    });
  }

  protected onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const request = this.bookForm.getRawValue();

    const operation: Observable<unknown> =
      this.bookId === null
        ? this.booksService.create(request)
        : this.booksService.update(this.bookId, request);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = this.isEditMode
          ? 'Could not update the book.'
          : 'Could not create the book.';
      }
    });
  }

  protected cancel(): void {
    this.router.navigate(['/']);
  }
}
