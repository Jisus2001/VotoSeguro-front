import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PersonasService } from '../../services/personas.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  user: any = null;
  nombre: string = '';
  rol: string = '';

  constructor(
    public personasService: PersonasService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.nombre = window.localStorage.getItem('Nombre') || 'Usuario';
      this.rol = window.localStorage.getItem('Rol') || 'Rol';
    }
  }
}
