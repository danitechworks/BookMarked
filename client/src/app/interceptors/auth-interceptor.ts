import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn =
  (request, next) => {
    const auth = inject(Auth);
    const token = auth.getToken();

    const isApiRequest = request.url.startsWith(
      'https://localhost:7196/api/'
    );

    if (!token || !isApiRequest) {
      return next(request);
    }

    const authenticatedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authenticatedRequest);
  };
