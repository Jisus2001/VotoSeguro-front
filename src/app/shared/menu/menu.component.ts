import { Component } from '@angular/core';
import { navItems } from './menu-data';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  navItems = navItems; // Asigna los elementos del menú a una propiedad
  user: any;


  constructor(public router: Router) {
  }

  // Método para manejar la navegación cuando se selecciona un elemento
  onItemSelected(item: any) {
    this.router.navigate([item.route], {state: {user: this.user}});
  }
}
