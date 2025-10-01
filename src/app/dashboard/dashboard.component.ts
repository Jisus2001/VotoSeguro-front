import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [RouterModule],

  
})
export class DashboardComponent {
  
  constructor(private router: Router) {}

  cerrarSesion() {
    // Aquí puedes limpiar datos de sesión o tokens
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario');

    // Redirige al login
    this.router.navigate(['/login']);
}}
