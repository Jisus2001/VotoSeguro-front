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
import { HttpErrorResponse } from '@angular/common/http';

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
    this.submitted = true;

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
        .login(this.userForm.value.identificacion, this.userForm.value.contrasenna)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {

            this.respuesta = res;
            
            this.noti.mensaje(
              'Bienvenido a Voto Seguro',
              `Se ha logrado iniciar sesión con éxito.`,
              TipoMessage.success
            );

           this.router.navigate(['/dashboard']);
          },
          (error: HttpErrorResponse) => {
            let titulo = 'Error al Iniciar Sesión';
            let mensaje = 'Ha ocurrido un error inesperado al intentar iniciar sesión. Inténtelo de nuevo más tarde.';
            let tipoMensaje = TipoMessage.error;

            const errorBody = error.error;
            switch (error.status) {
              case 442: 
              titulo = 'Usuario Bloqueado';
              mensaje = errorBody.message || 'Cuenta bloqueada debido a intentos fallidos de inicio de sesión. Contacte a soporte para más información.';
              break;
            case 441: 
              titulo = 'Credenciales Inválidas';
              mensaje = errorBody.message || 'La identificación o la contraseña son incorrectas. Verifique sus datos e intente nuevamente.';
              break;
            case 500: 
              titulo = 'Error del Servidor';
              mensaje = errorBody.message || 'Ha ocurrido un error en el servidor. Por favor, inténtelo de nuevo más tarde.';
              break;
            default:
              mensaje = error.message || errorBody.message || "Error desconocido. Por favor, inténtelo de nuevo.";
              break;  
            }

            this.noti.mensaje(titulo, mensaje, tipoMensaje);

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
