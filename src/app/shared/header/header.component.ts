import { Component, OnInit } from '@angular/core';
import { PersonasService } from '../../services/personas.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  user: any = null;

  constructor(public personasService: PersonasService) {}
  nombre: string = '';
  rol: string = '';

  ngOnInit() {
    this.nombre = window.localStorage.getItem('Nombre') || 'Usuario';
    this.rol = window.localStorage.getItem('Rol') || 'Rol';
  }
}
