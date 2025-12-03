import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { NotificacionService, TipoMessage } from '../shared/notification.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PersonasService } from './personas.service';

// Guard que verifica si el usuario está logueado y tiene el rol necesario
export class PersonasRoleGuard {
  authService: PersonasService = inject(PersonasService);
  router: Router = inject(Router);
  noti: NotificacionService = inject(NotificacionService);

  auth: boolean = false;
  user: any;

  constructor() {
    this.authService.decodeToken.subscribe((user: any) => {
      this.user = user;
    });

    this.authService.isAuthenticated.subscribe((auth) => {
      this.auth = auth;
    });
  }

    canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.checkUserLogin(route);
  }

    public checkUserLogin(route: ActivatedRouteSnapshot): boolean {
    if (this.auth) {
      const userRole = this.user ? this.user.rol : null;

      if (
        route.data['rol'] &&
        route.data['rol'].length &&
        !route.data['rol'].includes(userRole)
      ) {
        this.noti.mensaje(
          'Usuario',
          `Usuario sin permisos para acceder`,
          TipoMessage.warning,
        );
        this.router.navigate(['**']);
        return false;
      }
      return true;
    } else {
      if(!this.authService.isLogin){
        this.router.navigate(['**']);
      }
      return false;
    }
  }
}

export const AuthGuard: CanActivateFn = (route, state) => {
  let userGuard = new PersonasRoleGuard();
  return userGuard.checkUserLogin(route);
}