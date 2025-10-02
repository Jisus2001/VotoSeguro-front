import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonasService } from '../../services/personas.service';

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
  perfil = '';

  constructor(private personasService: PersonasService) {}

  registrarUsuario() {
    if (
      !this.nombre.trim() ||
      !this.identificacion.trim() ||
      !this.correo.trim() ||
      !this.contrasena.trim() ||
      !this.confirmacion.trim() ||
      !this.perfil.trim()
    ) {
      this.mensaje = 'Por favor completa todos los campos del formulario';
      return;
    }

    if (this.contrasena !== this.confirmacion) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }

    const datos = {
      Identificacion: this.identificacion,
      Nombre: this.nombre,
      Contrasenna: this.contrasena,
      Correo: this.correo,
      Perfil: this.perfil,
    };

    this.personasService.agregarPersona(datos).subscribe(
      (res: any) => {
        this.mensaje = res.mensaje || 'Registro exitoso';
      },
      (error: any) => {
        this.mensaje = error.error?.mensaje || 'Error al registrar';
      }
    );
  }
}
