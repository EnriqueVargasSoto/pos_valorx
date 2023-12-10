import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServicesService } from '../utils/services.service';

export const guardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const serviceService = inject(ServicesService);
  if (serviceService.isLoggedIn()) {
    return true
  } else {
    router.navigate(['/login']);
    return false;
  }


};
