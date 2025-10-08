import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  // URL del API, definida en enviroments->enviroment.ts
  urlAPI: string = 'http://localhost:80/';
  //Información usuario actual
  currentUser: any;

  //Inyectar cliente HTTP para las solicitudes al API
  constructor(private http: HttpClient) {}

  // Listar
  //http://localhost:3000/videojuego
  list(endopoint: string): Observable<any> {
    return this.http.get<any>(this.urlAPI + endopoint);
  }
  // Obtener
  get(endopoint: string, filtro: any): Observable<any | any[]> {
    return this.http.get<any | any[]>(this.urlAPI + endopoint + `/${filtro}`);
  }
  // crear
  create(endopoint: string, objCreate: any | any): Observable<any | any[]> {
    return this.http.post<any | any[]>(this.urlAPI + endopoint, objCreate);
  }
  // actualizar
  update(endopoint: string, objUpdate: any | any[]): Observable<any | any[]> {
    return this.http.put<any | any[]>(this.urlAPI + endopoint, objUpdate);
  }
  /*   update(endopoint: string, objUpdate: any | any): Observable<any | any[]> {
    return this.http.put<any | any[]>(this.urlAPI + endopoint, objUpdate);
  } */

      // Este se mapea al endpoint de Node: router.delete("/Eliminar/:Identificacion")
  remove(endopoint: string, filtro: any): Observable<any | any[]> {
    // Genera la URL como: /personas/Eliminar/123456
    return this.http.delete<any | any[]>(this.urlAPI + endopoint + `/${filtro}`);
  }
}
