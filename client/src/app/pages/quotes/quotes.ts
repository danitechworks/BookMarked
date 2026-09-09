import { Component, inject, OnInit } from '@angular/core';
import { Quote } from '../../models/quote';
import { QuotesService } from '../../services/quotes';
import { RouterLink } from '@angular/router';
import { ConfirmDelete } from '../../components/confirm-delete/confirm-delete';

@Component({
  selector: 'app-quotes',
  imports: [RouterLink, ConfirmDelete],
  templateUrl: './quotes.html',
  styleUrl: './quotes.scss'
})
export class Quotes implements OnInit {
  private readonly quotesService = inject(QuotesService);

  protected quotes: Quote[] = [];
  protected isLoading = true;
  protected errorMessage = '';

  protected deletingQuoteId: number | null = null;
  protected quoteToDelete: Quote | null = null;

  ngOnInit(): void {
    this.quotesService.getAll().subscribe({
      next: quotes => {
        this.quotes = quotes;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage =
            'Your session has expired. Please log in again.';
        } else {
          this.errorMessage = 'Could not load your quotes.';
        }
      }
    });
  }
  protected requestDeleteQuote(quote: Quote): void {
    this.quoteToDelete = quote;
  }

  protected cancelDeleteQuote(): void {
    this.quoteToDelete = null;
  }

  protected confirmDeleteQuote(): void {
    const quote = this.quoteToDelete;

    if (quote === null) {
      return;
    }

    this.quoteToDelete = null;
    this.deletingQuoteId = quote.id;
    this.errorMessage = '';

    this.quotesService.delete(quote.id).subscribe({
      next: () => {
        this.quotes = this.quotes.filter(
          existingQuote => existingQuote.id !== quote.id
        );

        this.deletingQuoteId = null;
      },
      error: error => {
        this.deletingQuoteId = null;

        if (error.status === 401) {
          this.errorMessage =
            'Your session has expired. Please log in again.';
        } else {
          this.errorMessage = 'Could not delete the quote.';
        }
      }
    });
  }
}
