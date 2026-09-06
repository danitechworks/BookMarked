import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book';
import { BookRequest } from '../models/book-request';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/Books`;

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(
      `${this.apiUrl}/${id}`
    );
  }

  create(request: BookRequest): Observable<Book> {
    return this.http.post<Book>(
      this.apiUrl,
      request
    );
  }

  update(
    id: number,
    request: BookRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}


