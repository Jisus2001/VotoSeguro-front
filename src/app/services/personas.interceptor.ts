
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonasService } from '../services/personas.service'; // Usar PersonasService (Auth)

@Injectable()
export class PersonasInterceptor implements HttpInterceptor {

  // Inyectar el servicio de autenticación
  constructor(private personasService: PersonasService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // Obtener el token.
    const token = this.personasService.getToken();

    // Solo añadir el token si está disponible
    if (token) {
      // Clonar la solicitud y agregar el encabezado Authorization
      const cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Pasar la solicitud clonada al siguiente manejador
      return next.handle(cloned);
    }

    // Si no hay token, pasar la solicitud original
    return next.handle(request);
  }
}