import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { LoginRequest } from '../models/login-request';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://localhost:7196/api/Auth';

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      request
    );
  }
}
