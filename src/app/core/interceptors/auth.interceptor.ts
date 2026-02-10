import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.getUser();

  if (user?.token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
