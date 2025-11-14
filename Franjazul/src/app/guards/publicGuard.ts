import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/authService';

export const publicGuard: CanActivateFn = (route, state) => {
const authService = inject(AuthService);
const router = inject(Router);

if (!authService.isAuthenticated()) {
return true;
}

const cargo = authService.getCargo();
if (cargo?.toUpperCase() === 'CLIENTE') {
router.navigate(['/']);
} else {
router.navigate(['/dashboard']);
}
return false;
};