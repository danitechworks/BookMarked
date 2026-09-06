import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn =
  (request, next) => {
    const auth = inject(Auth);
    const token = auth.getToken();

    const isApiRequest = request.url.startsWith(`${environment.apiUrl}/`);

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
