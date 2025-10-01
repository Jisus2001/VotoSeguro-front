import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonasService } from '../../services/personas.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class LoginComponent {
  identificacion: string = '';
  contrasenna: string = '';
  mensaje: string = '';

  constructor(private personasService: PersonasService, private router: Router) {}

  iniciarSesion() {
    this.mensaje = 'Mensaje de prueba';
  }
}
