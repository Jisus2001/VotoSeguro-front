import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { navItems } from './menu-data';
import { Router } from '@angular/router';
import { PersonasService } from '../../services/personas.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit{
  navItems = navItems; // Asigna los elementos del menú a una propiedad
  user: any;
  nombre: string = ''; 
  rol: string = ''; 
  
  constructor(
    public router: Router,
    public personasService: PersonasService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.nombre = window.localStorage.getItem('Nombre') || 'Usuario';
      this.rol = window.localStorage.getItem('Rol') || 'Rol';
    }
  }
  
  // Método para manejar la navegación cuando se selecciona un elemento
  onItemSelected(item: any) {
    this.router.navigate([item.route], { state: { user: this.user } });
  }
}
