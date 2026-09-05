import { Component, inject, OnInit } from '@angular/core';
import { Quote } from '../../models/quote';
import { QuotesService } from '../../services/quotes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quotes',
  imports: [RouterLink],
  templateUrl: './quotes.html',
  styleUrl: './quotes.scss'
})
export class Quotes implements OnInit {
  private readonly quotesService = inject(QuotesService);

  protected quotes: Quote[] = [];
  protected isLoading = true;
  protected errorMessage = '';

  protected deletingQuoteId: number | null = null;

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
  protected deleteQuote(quote: Quote): void {
    const confirmed = window.confirm(
      `Delete this quote by ${quote.author}?`
    );

    if (!confirmed) {
      return;
    }

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
