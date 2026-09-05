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
}
