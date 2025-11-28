import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonasService } from '../../services/personas.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  user: any = null;

  constructor(private router: Router, public personasService: PersonasService) {}
  nombre: string = '';
  rol: string = '';

  ngOnInit() {
    this.nombre = window.localStorage.getItem('Nombre') || 'Usuario';
    this.rol = window.localStorage.getItem('Rol') || 'Rol';
  }
  
  volver(): void {
    if (this.nombre !== null) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
