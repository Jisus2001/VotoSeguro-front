import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class PersonasService {
  private apiUrl = 'http://localhost:80'; // Cambia esto si usas otro puerto

  private usuario = new BehaviorSubject<any>(null);
  private tokenUserSubject = new BehaviorSubject<any>(null);
  private authenticated = new BehaviorSubject<boolean>(false);
  public isLogin = false;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    let cs: string | null = null;
    
    if(typeof window !== 'undefined') {
      cs = window.localStorage.getItem('token');
    }

    if (cs && cs !== 'undefined') {
      this.tokenUserSubject = new BehaviorSubject<any>(JSON.parse(cs));
    }
    this.currentUser = this.tokenUserSubject.asObservable();
  }

  private hasToken(): boolean {
    let token = null;

    if (typeof window !== 'undefined') {
      token = window.localStorage.getItem('token');
    }

    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      // Verifica si el token ha expirado
      const expirationDate = decoded.exp * 1000;
      return expirationDate > Date.now();
    } catch (error) {
      return false;
    }
  }

  // Intento de login en el backend
  login(identificacion: string, contrasenna: string): Observable<any> {
    this.isLogin = true;

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .post(
        `${this.apiUrl}/personas/ValidarSesion`,
        {
          Identificacion: identificacion,
          Contrasenna: contrasenna,
        },
        { headers }
      )
      .pipe(
        map((res: any) => {
          localStorage.setItem('token', JSON.stringify(res.token));
          this.authenticated.next(true);
          this.tokenUserSubject.next(res.token);
          let userData = this.decodeToken;

          return userData;
        }),
        catchError(this.handleError)
      );
  }

  setToken(token: string) {
    this.isLogin = false;
    localStorage.setItem('token', token);
  }

  public getToken(): string | null {
    this.isLogin = false;
    return this.tokenUserSubject.value;
  }

  public get decodeToken(): any {
    this.isLogin = false;
    this.usuario.next(null);
    const token = this.getToken();

    if(token){
      const decoded: any = jwtDecode(token);
      const expirationDate = decoded.exp * 1000;

      if (expirationDate > Date.now()) {
        this.usuario.next(decoded);
      }
    }

    return this.usuario.asObservable();
  }

  public get isAuthenticated() {
    this.isLogin = false;

    if (this.getToken !== null ) {
      this.authenticated.next(true);
    } else {
      this.authenticated.next(false);
    }
    return this.authenticated.asObservable();
  }

  logout() {
    this.isLogin = false;
    let usuario = this.tokenUserSubject.value;
    if (usuario) {
      localStorage.removeItem('token');
      this.authenticated.next(false);
      this.tokenUserSubject.next(null);
      return true; 
    }
    return false;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.error.Message || error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
