import { Component, inject, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { BooksService } from '../../services/books';
import { RouterLink } from '@angular/router';
import { ConfirmDelete } from '../../components/confirm-delete/confirm-delete';

@Component({
  selector: 'app-books',
  imports: [RouterLink, ConfirmDelete],
  templateUrl: './books.html',
  styleUrl: './books.scss'
})
export class Books implements OnInit {
  private readonly booksService = inject(BooksService);

  protected books: Book[] = [];
  protected isLoading = true;
  protected errorMessage = '';
  protected deletingBookId: number | null = null;
  protected bookToDelete: Book | null = null;

  ngOnInit(): void {
    this.booksService.getAll().subscribe({
      next: books => {
        this.books = books;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = 'Your session is not authorized.';
        } else {
          this.errorMessage = 'Could not load books.';
        }
      }
    });
  }
  protected requestDeleteBook(book: Book): void {
    this.bookToDelete = book;
  }

  protected cancelDeleteBook(): void {
    this.bookToDelete = null;
  }

  protected confirmDeleteBook(): void {
    const book = this.bookToDelete;

    if (book === null) {
      return;
    }

    this.bookToDelete = null;
    this.deletingBookId = book.id;
    this.errorMessage = '';

    this.booksService.delete(book.id).subscribe({
      next: () => {
        this.books = this.books.filter(
          existingBook => existingBook.id !== book.id
        );

        this.deletingBookId = null;
      },
      error: error => {
        this.deletingBookId = null;

        if (error.status === 401) {
          this.errorMessage =
            'Your session has expired. Please log in again.';
        } else {
          this.errorMessage = 'Could not delete the book.';
        }
      }
    });
  }
}
