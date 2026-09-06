import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { RegisterResponse } from '../models/register-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/Auth`;

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        request
      )
      .pipe(
        tap(response => {
          localStorage.setItem(
            'bookmark_token',
            response.token
          );

          localStorage.setItem(
            'bookmark_username',
            response.username
          );
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('bookmark_token');
  }

  getUsername(): string | null {
    return localStorage.getItem('bookmark_username');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('bookmark_token');
    localStorage.removeItem('bookmark_username');
  }

  register(
    request: RegisterRequest
  ): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      request
    );
  }
}
