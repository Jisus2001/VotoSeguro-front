import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PersonasService {
  private apiUrl = 'http://localhost:80'; // Cambia esto si usas otro puerto

  constructor(private http: HttpClient) {}

  login(identificacion: string, contrasenna: string) {
    return this.http.post(`${this.apiUrl}/personas/ValidarSesion`, {
      Identificacion: identificacion,
      Contrasenna: contrasenna,
    });
  }
}
