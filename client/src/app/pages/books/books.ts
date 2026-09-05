import { Component, inject, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { BooksService } from '../../services/books';

@Component({
  selector: 'app-books',
  imports: [],
  templateUrl: './books.html',
  styleUrl: './books.scss'
})
export class Books implements OnInit {
  private readonly booksService = inject(BooksService);

  protected books: Book[] = [];
  protected isLoading = true;
  protected errorMessage = '';

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
}
