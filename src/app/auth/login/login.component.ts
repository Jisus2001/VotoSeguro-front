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
    if (!this.identificacion || !this.contrasenna) {
      this.mensaje = 'Por favor ingresa tus credenciales';
      return;
    }

    this.personasService.login(this.identificacion, this.contrasenna).subscribe(
      (res: any) => {
        console.log(res);
        this.mensaje = res.mensaje || res.error || 'Inicio de sesión exitoso';

        // Si el login fue exitoso, redirige al dashboard
        if (res && !res.error) {
          this.router.navigate(['/dashboard']);
        }
      },
      (error: any) => {
        this.mensaje = error.message || 'Error al iniciar sesión';
        console.error(error);
      }
    );
  }
}
