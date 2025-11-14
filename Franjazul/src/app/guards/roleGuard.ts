import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/authService';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] as string[];
  const userCargo = authService.getCargo();

  if (userCargo && allowedRoles.includes(userCargo.toUpperCase())) {
    return true;
  }

  router.navigate(['/']);
  return false;
};