import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService } from '../../shared/notification.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-votantes-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
],
  templateUrl: './votantes-detail.component.html',
  styleUrl: './votantes-detail.component.scss',
})
export class VotantesDetailComponent {
  isVisible = false;
  Identificacion: any; // Usado como Cédula/ID
  Nombre: any; // Nombre de la persona
  Contrasenna: any;
  Telefono: any;
  Correo: any;
  Perfil: any;
  Bloqueado: any;

  makeSubmit: boolean = false;
  numRegex = '^[0-9]*$';
  activeRouter: any;
  submitted = false;

  respCreate: any;
  genericService: any;

  userForm!: FormGroup;
  userData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  // Flags de creación/actualización
  isCreate: boolean = true;
  titleForm: string = 'Creación';
  user: any;

  selectedRole: string = '';

  roles = [
    { id: 1, nombre: 'Votantes' },
    { id: 2, nombre: 'Administradores' },
  ];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.userForm = this.fb.group({
      Identificacion: ['', ''],
      Nombre: ['', ''],
      Contrasenna: ['', ''],
      Telefono: ['', ''],
      Correo: ['', ''],
      Perfil: ['', ''],
      Bloqueado: ['', ''],
    });
  }

  onChange(event: any) {
    const value = event.target.value;
    if (value !== null) {
      if (value === '1') {
        this.Perfil = 'Administrador';
      } else {
        this.Perfil = 'Votante';
      }
    }
  }

  onUpdate(value: any) {
    if (value === 'Administrador') {
      this.Perfil = 'Administrador';
    } else {
      this.Perfil = 'Votante';
    }
  }

  openModal(id?: any) {
    this.isVisible = true;
    if (id !== undefined && !isNaN(Number(id))) {
      this.loadData(id);
    }
  }

  loadData(id: any): void {
    this.isCreate = false;
    this.titleForm = 'Detalle del votante';
    this.Identificacion = id;

    this.gService
      .get('personas/ObtenerPersona', this.Identificacion)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.user = data;
        this.userData = data;

        this.Bloqueado = this.userData.BloqueadoHasta; 

        this.userForm.patchValue({
          Identificacion: this.userData.Identificacion,
          Nombre: this.userData.Nombre,
          Contrasenna: this.userData.Contrasenna,
          Telefono: this.userData.Telefono,
          Correo: this.userData.Correo,
          Perfil: this.userData.Perfil,
          Bloqueado: this.userData.BloqueadoHasta,
        });

        console.log(this.userForm.value); 
        console.log(this.Bloqueado); 

      });

    const identificationControl = this.userForm.get('Identificacion');

    if (this.isCreate === false) {
      identificationControl?.disable();
    }
  }

   get estadoDinamico(): 'Activo' | 'Bloqueado' {

    if (this.Bloqueado === null || this.Bloqueado === undefined) {
      return 'Activo';
    }
    else {
      return 'Bloqueado';
    }
  }

  closeModal() {
    this.submitted = false;
    this.userForm.reset();
    this.isVisible = false;
  }

  onReset() {
    this.userForm.reset();
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
