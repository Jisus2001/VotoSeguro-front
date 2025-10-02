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
    if (!this.identificacion && !this.contrasenna) {
      this.mensaje = 'Por favor ingresa tus credenciales';
      return;
    }

    if (!this.identificacion) {
      this.mensaje = 'Por favor ingresa tu identificación';
      return;
    }

    if (!this.contrasenna) {
      this.mensaje = 'Por favor ingresa tu contraseña';
      return;
    }

    this.personasService.login(this.identificacion, this.contrasenna).subscribe(
      (res: any) => {
        if (res && !res.error) {
          localStorage.setItem('nombre', res.nombre);
          localStorage.setItem('rol', res.rol);
          this.mensaje = 'Inicio de sesión exitoso';
          setTimeout(() => {
            if (res.rol === 'Administrador') {
              this.router.navigate(['/dashboard']);
            } else if (res.rol === 'Votante') {
              this.router.navigate(['/dashboard/dashboardVotante']);
            } else {
              this.mensaje = 'Rol desconocido. Contacte al administrador.';
            }
          }, 1000);
        } else {
          this.mensaje = res.mensaje || 'Credenciales incorrectas';
        }
      },
      (error: any) => {
        this.mensaje =
          error.error?.mensaje || error.message || 'Credenciales incorrectas o error de conexión';
      }
    );
  }
}
