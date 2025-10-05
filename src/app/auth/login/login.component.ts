import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PersonasService } from '../../services/personas.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NotificacionService, TipoMessage } from '../../shared/notification.service';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class LoginComponent {
  identificacion: string = '';
  contrasenna: string = '';
  passwordFieldType: string = 'password';

  // FORM -->
  submitted = false;
  makeSubmit: boolean = false;
  userForm!: FormGroup;
  userData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  // <-- FORM

  constructor(

    private personasService: PersonasService,
    private router: Router,
    private noti: NotificacionService,
    public fb: FormBuilder,
    private gService: GenericService
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.userForm = this.fb.group({
      identificacion: ['', [Validators.required]],
      contrasenna: ['', Validators.compose([Validators.required])],
    });
  }


  iniciarSesion() {
    this.identificacion = this.userForm.value.identificacion;
    this.contrasenna = this.userForm.value.contrasenna;

    if (this.userForm.invalid) {
      this.noti.mensaje(
        'Datos Requeridos',
        `Su identificación y contraseña son requeridos para iniciar sesión. `,
        TipoMessage.error
      );
      return;
    }

    if (this.userForm.value) {
      this.personasService
        .login(this.identificacion, this.contrasenna)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {

            this.noti.mensaje(
              'Bienvenido a Voto Seguro',
              `Se ha logrado iniciar sesión con éxito.`,
              TipoMessage.success
            );

            if (res.rol === 'Administrador') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/dashboard/dashboardVotante']);
            }
          },
          (error) => {
            this.noti.mensaje(
              'Error en el Inicio de Sesión',
              `Sus credenciales no son correctos. Verifiquelos e intente iniciar sesión otra vez.`,
              TipoMessage.error
            );
            setTimeout(() => {
              window.location.reload();
            }, 2500);
          }
        );
    }
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  // Control de Errores
  public errorHandling = (controlName: string, error: string) => {
    const control = this.userForm.get(controlName);

    if (control) {
      return control.hasError(error) && control.invalid && (this.submitted || control.touched);
    }
    return false;
  };
}
