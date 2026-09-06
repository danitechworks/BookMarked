import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quote } from '../models/quote';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Quotes`;

  getAll(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiUrl);
  }

  getById(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}/${id}`);
  }

  create(quote: Omit<Quote, 'id'>): Observable<Quote> {
    return this.http.post<Quote>(this.apiUrl, quote);
  }

  update(id: number, quote: Omit<Quote, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, quote);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
