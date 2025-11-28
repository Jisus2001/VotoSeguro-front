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

interface Perfil {
  IdPerfil: number;
  Descripcion: string;
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
  perfilList: Perfil[] = [];
  isVisible: any;
  idEleccion: number | null = null;
  Nombre: any;
  SedeId: any;
  PerfilId: any;
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
  selectedPerfil: string = '';

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.reactiveForm();
  }

  // Helper para combinar fecha y hora en un objeto Date
  private static combineDateTime(dateStr: string | null, timeStr: string | null): Date | null {
    if (!dateStr || !timeStr) {
      return null;
    }
    // Combina YYYY-MM-DD y HH:mm:ss (los segundos se asumen 00)
    // El formato 'YYYY-MM-DDTHH:mm:00' crea la fecha en la zona horaria local.
    const localDateTimeStr = `${dateStr}T${timeStr}:00`;

    // Crear el objeto Date local. Es importante NO usar 'Z' aquí.
    const date = new Date(localDateTimeStr);

    // Si quieres que el backend lo interprete como hora UTC/Z, el backend debería manejar la conversión.
    // Sin embargo, para la comparación local, usamos la fecha local.

    // Comprobación simple de validez
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  }

  static dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startDateStr = control.get('FechaInicio')?.value;
    const startTimeStr = control.get('FechaInicioTime')?.value;
    const endDateStr = control.get('FechaFin')?.value;
    const endTimeStr = control.get('FechaFinTime')?.value;

    const start = EleccionesCreateComponent.combineDateTime(startDateStr, startTimeStr);
    const end = EleccionesCreateComponent.combineDateTime(endDateStr, endTimeStr);

    if (!start || !end) {
      return null;
    }

    // Rechaza si FechaFin + HoraFin es menor a FechaInicio + HoraInicio
    if (end < start) {
      return { dateRangeInvalid: true };
    }

    return null;
  };
  reactiveForm() {
    this.userForm = this.fb.group(
      {
        idEleccion: [''],
        Nombre: [null, Validators.required],
        SedeId: [null, Validators.required],
        PerfilId: [null, Validators.required],
        FechaInicio: [null, Validators.required],
        FechaInicioTime: [null, Validators.required],
        FechaFin: [null, Validators.required],
        FechaFinTime: [null, Validators.required],
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
    this.loadPerfiles();
  }

  openModal(id?: any) {
    this.isVisible = true;
    console.log(id);

    if (id !== undefined) {
      // Modo Actualización
      this.isCreate = false;
      this.titleForm = 'Actualización';
      this.idEleccion = id;
      this.loadData(id);
    } else {
      // Modo Creación
      this.userForm.reset();
      this.isCreate = true;
      this.titleForm = 'Creación';
      this.idEleccion = null;
    }
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

  loadPerfiles() {
    this.gService
      .list('perfiles/Listar')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.perfilList = data as Perfil[];
        },
        error: (error: any) => {
          console.error('Error al cargar los perfiles', error);
          this.noti.mensaje(
            'Error de datos',
            'No se pudo cargar la lista de los perfiles.',
            TipoMessage.error
          );
        },
      });
  }

  closeModal() {
    this.userForm.reset();
    this.submitted = false;
    this.isVisible = false;
    this.idEleccion = null;
  }

  // Función para extraer la fecha (YYYY-MM-DD) y hora (HH:mm) desde un ISO String
  private extractDateTime(isoString: string | null): { date: string | null; time: string | null } {
    if (!isoString) {
      return { date: null, time: null };
    }

    // Crea un objeto Date. Esto asume que el backend devuelve la fecha/hora en UTC
    // y Date la convierte a la hora local del navegador.
    const date = new Date(isoString);

    // Formato de la fecha (YYYY-MM-DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const datePart = `${year}-${month}-${day}`;

    // Formato de la hora (HH:mm)
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timePart = `${hours}:${minutes}`;

    return { date: datePart, time: timePart };
  }

  // private formatISOToInputDate(isoString: string | null): string | null {
  //   if (!isoString) {
  //     return null;
  //   }
  //   Convertimos la cadena ISO a un objeto Date
  //   const date = new Date(isoString);

  //   Obtenemos los componentes de la fecha
  //   const year = date.getFullYear();
  //   getMonth() es base 0, por eso sumamos 1
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');

  //   Juntamos en el formato 'YYYY-MM-DD'
  //   return `${year}-${month}-${day}`;
  // }

  loadData(id: any) {
    this.isCreate = false;
    this.titleForm = 'Actualización';
    this.idEleccion = id;

    this.gService
      .get('elecciones/ObtenerEleccion', this.idEleccion)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.user = data;

          // const fechaInicioInput = this.formatISOToInputDate(this.user.FechaInicio);
          // const fechaFinInput = this.formatISOToInputDate(this.user.FechaFin);

          const { date: fechaInicioInput, time: horaInicioInput } = this.extractDateTime(
            this.user.FechaInicio
          );
          const { date: fechaFinInput, time: horaFinInput } = this.extractDateTime(
            this.user.FechaFin
          );

          this.userForm.patchValue({
            Nombre: this.user.Nombre,
            SedeId: this.user.Sede.IdSede,
            PerfilId: this.user.Perfil.IdPerfil,
            // FechaInicio: fechaInicioInput, // Asignamos el objeto Date
            // FechaFin: fechaFinInput,
            FechaInicio: fechaInicioInput,
            FechaInicioTime: horaInicioInput,
            FechaFin: fechaFinInput,
            FechaFinTime: horaFinInput,
          });
          console.log(this.userForm.value);
        },
        (error: any) => {
          console.error('Error al cargar datos de la elección:', error);
          this.noti.mensaje(
            'Error de carga',
            'No se pudo obtener la información de la elección.',
            TipoMessage.error
          );
        }
      );
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
        'La Fecha de cierre no puede ser anterior a la Fecha de inicio.',
        TipoMessage.warning
      );
      return;
    }

    const fechaInicioLocal = EleccionesCreateComponent.combineDateTime(
      this.userForm.value.FechaInicio,
      this.userForm.value.FechaInicioTime
    );
    const fechaFinLocal = EleccionesCreateComponent.combineDateTime(
      this.userForm.value.FechaFin,
      this.userForm.value.FechaFinTime
    );

    // Formato de fechas al estándar ISO 8601 que el backend espera
    const formData = {
      ...this.userForm.value,
      SedeId: Number(this.userForm.value.SedeId),
      PerfilId: Number(this.userForm.value.PerfilId),
      // FechaInicio: new Date(this.userForm.value.FechaInicio).toISOString(),
      // FechaFin: new Date(this.userForm.value.FechaFin).toISOString(),

      FechaInicio: fechaInicioLocal ? fechaInicioLocal.toISOString() : null,
      FechaFin: fechaFinLocal ? fechaFinLocal.toISOString() : null,
    };

    console.log(formData);

    if (this.isCreate) {
      if (this.userForm.value) {
        // 3. Creación/Persistencia (HU 3 Persistencia)
        this.gService
          .create('elecciones/Agregar', formData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.noti.mensaje(
                'Elección Creada',
                `La elección: ${formData.Nombre} ha sido creado con éxito.`,
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
        .update(`elecciones/Actualizar/${this.idEleccion}`, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respuesta = data;
          this.noti.mensaje(
            'Elección Actualizada',
            `La elección ha sido actualizada con éxito.`,
            TipoMessage.success
          );
          this.eleccionCreada.emit();
          this.closeModal();
        });
    }

    // Emitir evento para refrescar la página padre
    this.eleccionCreada.emit();

    // Cerrar el modal después de la creación
    this.closeModal();

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
