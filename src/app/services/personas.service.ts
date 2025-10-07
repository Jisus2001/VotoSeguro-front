import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonasService {
  private apiUrl = 'http://localhost:80'; // Cambia esto si usas otro puerto
  private authenticated = new BehaviorSubject<boolean>(false);
  private isLogin = false;

  constructor(private http: HttpClient) {}

  login(identificacion: string, contrasenna: string) {
    this.isLogin = true;

    return this.http.post(`${this.apiUrl}/personas/ValidarSesion`, {
      Identificacion: identificacion,
      Contrasenna: contrasenna,
    });
  }

  public get getToken(): any {
    if (localStorage.getItem('Nombre') != null && localStorage.getItem('Rol') != null) {
      return localStorage.getItem('Nombre');
    }
  }

  get isAuthenticated() {
    this.isLogin = true;

    if (this.getToken != null) {
      this.authenticated.next(true);
    } else {
      this.authenticated.next(false);
    }
    return this.authenticated.asObservable();
  }

  logout() {
    this.isLogin = false;
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      localStorage.removeItem('Nombre');
      localStorage.removeItem('Rol')
      return true;
    }
    return false;
  }

  agregarPersona(persona: any) {
    return this.http.post(`${this.apiUrl}/personas/Agregar`, persona);
  }
}
