import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard az admin route-ra.
// Ha nem admin a user, atiranyitunk loginra es jelezzuk, hogy admin oldalrol jott.
export const adminGuard: CanActivateFn = async (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForAuthReady();

  if (authService.isCurrentUserAdmin()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: {
      redirectTo: state.url,
      adminOnly: '1'
    }
  });
};
