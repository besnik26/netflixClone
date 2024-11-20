import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const router = inject(Router);

  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};