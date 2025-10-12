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
import { NotificacionService, TipoMessage } from '../../shared/notification.service';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-perfiles-create',
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
  templateUrl: './perfiles-create.component.html',
  styleUrl: './perfiles-create.component.scss',
})
export class PerfilesCreateComponent {
  isVisible = false;
  IdPerfil: any; // Usado como Cédula/ID
  Descripcion: any; // Nombre de la persona

  @Output() perfilCredo: EventEmitter<void> = new EventEmitter<void>();

  submitted = false;

  userForm!: FormGroup;
  userData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  isCreate: boolean = true;
  titleForm: string = 'Creación';
  user: any;

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
      IdPerfil: ['', ''],
      Descripcion: ['', Validators.required],
    });
  }

  openModal(id?: any) {
    this.userForm.reset();
    this.isVisible = true;

    if (id !== undefined && !isNaN(Number(id))) {
      // Modo Actualización
      this.isCreate = false;
      this.titleForm = 'Actualización';
      this.loadData(id);
    } else {
      // Modo Creación
      this.userForm.reset();
      this.isCreate = true;
      this.titleForm = 'Creación';
    }
  }

  loadData(id: any): void {
    // this.isCreate = false;
    // this.titleForm = 'Actualización';
    // this.Identificacion = id;

    this.gService
      .get('perfiles/ObtenerPerfil', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.user = data;
        this.userForm.patchValue({
          IdPerfil: this.user.IdPerfil,
          Descripcion: this.user.Descripcion,
        });
      });
  }

  closeModal() {
    this.submitted = false;
    this.userForm.reset();
    this.isVisible = false;
    this.isCreate = true;
    this.titleForm = 'Creación';
    this.perfilCredo.emit();
  }

  onSubmit() {
    this.submitted = true;
    const formData = { ...this.userForm.value };

    formData.IdPerfil = Number(formData.IdPerfil);
    formData.Descripcion = String(formData.Descripcion);

    if (this.userForm.invalid) {
      return;
    }

    if (this.isCreate) {
      this.gService
        .create('perfiles/Agregar', formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.userData = data;
          this.noti.mensaje(
            'Prefil Creado',
            `El perfil ha sido creado con éxito.`,
            TipoMessage.success
          );
          this.perfilCredo.emit();
          this.closeModal();
        });
    } else {
      this.gService
        .update(`perfiles/Actualizar/${formData.IdPerfil}`, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respuesta = data;
          this.noti.mensaje(
            'Perfil Actualizado',
            `El perfil ha sido actualizado con éxito.`,
            TipoMessage.success
          );
          this.perfilCredo.emit();
          this.closeModal();
        });
    }
  }

  onReset() {
    this.submitted = false;
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
