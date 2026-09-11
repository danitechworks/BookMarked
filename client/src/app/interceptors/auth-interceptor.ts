import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  throwError
} from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn =
  (request, next) => {
    const auth = inject(Auth);
    const router = inject(Router);
    const token = auth.getToken();

    const isApiRequest =
      request.url.startsWith(`${environment.apiUrl}/`);

    if (!token || !isApiRequest) {
      return next(request);
    }

    const authenticatedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authenticatedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          auth.logout();

          router.navigate(
            ['/login'],
            {
              queryParams: {
                sessionExpired: true
              }
            }
          );
        }

        return throwError(() => error);
      })
    );
  };
