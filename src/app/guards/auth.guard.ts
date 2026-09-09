import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasRole('ADMIN')) {
    return true;
  }

  const redirect = authService.currentUser?.role === 'TEACHER' ? '/teacher/dashboard' : '/login';
  router.navigate([redirect]);
  return false;
};

export const teacherGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasRole('TEACHER')) {
    return true;
  }

  const redirect = authService.currentUser?.role === 'ADMIN' ? '/admin/dashboard' : '/login';
  router.navigate([redirect]);
  return false;
};
