import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-registro',
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
  imports: [CommonModule, FormsModule],
})
export class RegistroComponent {
  nombre = '';
  identificacion = '';
  correo = '';
  contrasena = '';
  confirmacion = '';
  mensaje = '';

  registrarUsuario() {
    // lógica de registro
  }
}
