import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notification.service';
import { MatButtonModule } from '@angular/material/button';

interface Sede {
  IdSede: number;
  Nombre: string;
}

@Component({
  selector: 'app-elecciones-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './elecciones-create.component.html',
  styleUrl: './elecciones-create.component.scss',
})
export class EleccionesCreateComponent implements OnInit {
  sedeList: Sede[] = [];
  isVisible: any;
  idEleccion: any;
  Nombre: any;
  SedeId: any;
  FechaInicio: any;
  FechaFin: any;

  @Output() eleccionCreada: EventEmitter<void> = new EventEmitter<void>();

  makeSubmit: boolean = false;
  numRegex = '^[0-9]*$';
  activeRouter: any;
  submitted = false;

  respCreate: any;

  userForm!: FormGroup;
  userData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  // Flags de creación/actualización
  isCreate: boolean = true;
  titleForm: string = 'Creación';
  user: any;
  isAdministrador = true;

  selectedSede: string = '';

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  static dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('FechaInicio')?.value;
    const endDate = control.get('FechaFin')?.value;

    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Compara solo las fechas, ignorando la hora
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Rechaza si FechaFin es menor o igual a FechaInicio
    if (end <= start) {
      return { dateRangeInvalid: true };
    }

    return null;
  };

  reactiveForm() {
    this.userForm = this.fb.group(
      {
        Nombre: ['', Validators.required],
        SedeId: [null, Validators.required],
        FechaInicio: [null, Validators.required],
        FechaFin: [null, Validators.required],
      },
      {
        validator: EleccionesCreateComponent.dateRangeValidator,
      }
    );
  }

  ngOnInit(): void {
    // HU 3 Acceso: Verificar que solo el rol Administrador puede acceder a la funcionalidad
    // Nota: La restricción real de acceso debe ser controlada por rutas y en el backend.
    // Aquí solo se hace una verificación de UI.
    // this.isAdministrator = this.authService.getCurrentUserRole() === 'Administrador';

    if (!this.isAdministrador) {
      this.noti.mensaje(
        'Acceso denegado',
        'Solo los Administradores pueden crear elecciones.',
        TipoMessage.warning
      );
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadSedes();
  }

  loadSedes() {
    this.gService
      .list('sedes/Listar')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.sedeList = data as Sede[];
        },
        error: (error: any) => {
          console.error('Error al cargar sedes', error);
          this.noti.mensaje(
            'Error de datos',
            'No se pudo cargar la lista de sedes.',
            TipoMessage.error
          );
        },
      });
  }

  openModal(id?: any) {
    this.userForm.reset();
    this.isCreate = true;
    this.titleForm = 'Creación';
    this.isVisible = true;

    if (id !== undefined && !isNaN(Number(id))) {
      this.loadData(id);
    }
  }

  closeModal() {
    this.userForm.reset();
    this.submitted = false;
    this.isVisible = false;
  }

  loadData(id: any): void {
    this.isCreate = false;
    this.titleForm = 'Actualización';
    this.idEleccion = id;

    this.gService
      .get('elecciones/ObtenerEleccion', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.user = data;

        this.userForm.patchValue({
          Nombre: this.user.Nombre,
          SedeId: this.user.SedeId,
          FechaInicio: this.user.FechaInicio,
          FechaFin: this.user.FechaFin,
        });
      });
  }

  onSubmit() {
    this.submitted = true;

    // 1. Verificación de campos obligatorios (controlado por Angular Validators)
    if (this.userForm.invalid) {
      this.noti.mensaje(
        'Validación',
        'Debe completar todos los campos obligatorios.',
        TipoMessage.warning
      );
      return;
    }

    // 2. Verificación de rango de fechas (controlado por custom validator)
    if (this.userForm.errors?.['dateRangeInvalid']) {
      this.noti.mensaje(
        'Validación de Fechas',
        'La Fecha de Fin no puede ser igual o anterior a la Fecha de Inicio.',
        TipoMessage.warning
      );
      return;
    }

    // Formato de fechas al estándar ISO 8601 que el backend espera
    const formData = {
      ...this.userForm.value,
      FechaInicio: new Date(this.userForm.value.FechaInicio).toISOString(),
      FechaFin: new Date(this.userForm.value.FechaFin).toISOString(),
    };

    if (this.isCreate) {
      if (this.userForm.value) {
        // 3. Creación/Persistencia (HU 3 Persistencia)
        this.gService
          .create('elecciones/Agregar', formData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.noti.mensaje(
                'Partido Electoral Creada',
                `El partido ${formData.Nombre} ha sido creado con éxito.`,
                TipoMessage.success
              );

              // Emitir evento para refrescar la página padre
              this.eleccionCreada.emit();

              // Cerrar el modal después de la creación
              this.closeModal();
            },
            error: (error: any) => {
              console.error('Error al crear la elección:', error);
              this.noti.mensaje(
                'Error al guardar',
                'Ocurrió un error al intentar crear la elección.',
                TipoMessage.error
              );
              this.submitted = false; // Habilitar el botón de nuevo
            },
          });
      }
    } else {
      this.gService
        .update('elecciones/Actualizar', formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respuesta = data;
          this.noti.mensaje(
            'Partido Electoral Actualizado',
            `El partido ha sido actualizado con éxito.`,
            TipoMessage.success
          );
          this.eleccionCreada.emit();
          this.router.navigate(['/elecciones']);
        });
    }

    // Nota sobre HU 3 Restricción: La restricción de candidatos registrados
    // es una funcionalidad de backend (asociación de candidatos) que generalmente
    // se maneja en una pantalla de edición/detalle después de crear la elección.
  }

  // Control de Errores
  public errorHandling = (controlName: string, error: string): boolean => {
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
