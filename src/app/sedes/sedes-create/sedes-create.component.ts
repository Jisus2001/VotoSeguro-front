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
  selector: 'app-sedes-create',
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
  templateUrl: './sedes-create.component.html',
  styleUrl: './sedes-create.component.scss',
})
export class SedesCreateComponent {
  isVisible = false;
  IdSede: any; // Usado como Cédula/ID
  Nombre: any; // Nombre de la persona

  @Output() sedeCreada: EventEmitter<void> = new EventEmitter<void>();

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
      IdSede: ['', ''],
      Nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$')]],
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
      .get('sedes/ObtenerSede', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.user = data;
        this.userForm.patchValue({
          IdSede: this.user.IdSede,
          Nombre: this.user.Nombre,
        });
      });
  }

  closeModal() {
    this.submitted = false;
    this.userForm.reset();
    this.isVisible = false;
    this.isCreate = true;
    this.titleForm = 'Creación';
    this.sedeCreada.emit();
  }

  onSubmit() {
    this.submitted = true;
    const formData = { ...this.userForm.value };

    formData.IdSede = Number(formData.IdSede);
    formData.Nombre = String(formData.Nombre);

    if (this.userForm.invalid) {
      return;
    }

    if (this.isCreate) {
      this.gService
        .create('sedes/Agregar', formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.userData = data;
          this.noti.mensaje(
            'Sede creada',
            `La sede ha sido creada con éxito.`,
            TipoMessage.success
          );
          this.sedeCreada.emit();
          this.closeModal();
        });
    } else {
      this.gService
        .update(`sedes/Actualizar/${formData.IdSede}`, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respuesta = data;
          this.noti.mensaje(
            'Sede actualizada',
            `La sede ha sido actualizada con éxito.`,
            TipoMessage.success
          );
          this.sedeCreada.emit();
          this.closeModal();
          this.router.navigate(['/sedes']);
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
