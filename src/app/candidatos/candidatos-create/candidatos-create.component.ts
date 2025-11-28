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

// Interfaces necesarias
interface EleccionVigente {
  _id: string;
  Nombre: string;
  FechaInicio: string;
  FechaFin: string;
  Perfil: {
    IdPerfil: number;
    Descripcion: string;
  };
}

interface Perfil {
  IdPerfil: number;
  Descripcion: string;
}

interface CandidatoForm {
  Nombre: string;
  Partido: string;
  PerfilId: number | null;
}

@Component({
  selector: 'app-candidatos-create',
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
  templateUrl: './candidatos-create.component.html',
  styleUrl: './candidatos-create.component.scss',
})
export class CandidatosCreateComponent implements OnInit {
  perfilList: Perfil[] = [];
  eleccionList: EleccionVigente[] = [];
  isVisible: any;
  idCandidato: any;
  Nombre: any;
  Partido: any;
  PerfilId: any;
  EleccionId: any;

  // Mensaje de error del servidor (para Nombre duplicado u otros)
  serverError: string | null = null;

  @Output() candidatoCreado: EventEmitter<void> = new EventEmitter<void>();
  submitted = false;

  userForm!: FormGroup;
  userData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  // Flags de creación/actualización
  isCreate: boolean = true;
  titleForm: string = 'Creación';
  user: any;
  isAdministrador = true;

  selectedPerfil: string = '';
  selectedEleccion: string = '';

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
      idCandidato: ['', ''],
Nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$')]],
      Partido: [null, Validators.required],
      PerfilId: [null, Validators.required],
      EleccionId: [null, Validators.required],
    });

    // Escuchar cambios en EleccionId y PerfilId (Solo para limpiar errores)
    this.userForm
      .get('EleccionId')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onElectionChange();
      });
    this.userForm
      .get('PerfilId')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onProfileChange();
      });
  }

  // --- Manejo de Cambios en Dropdowns ---

  

  onElectionChange(): void {
    this.serverError = null; // Limpiar errores del servidor
  }

  onProfileChange(): void {
    this.serverError = null; // Limpiar errores del servidor
  }

  ngOnInit(): void {
    this.loadElecciones();
    this.loadPerfiles();
  }

  openModal(nombre?: any) {
    this.isVisible = true;
    this.submitted = false;
    this.serverError = null;

    this.userForm.get('EleccionId')?.enable();
    this.userForm.get('EleccionId')?.setValidators(Validators.required);
    this.userForm.get('EleccionId')?.updateValueAndValidity(); // Aplicar/quitar validadores

    if (nombre) {
      // Usamos la existencia de 'nombre'
      // Modo Actualización
      this.isCreate = false;
      this.titleForm = 'Actualización';
      this.loadCandidato(nombre);
      this.userForm.get('EleccionId')?.disable();
      this.userForm.get('EleccionId')?.clearValidators(); // No se requiere validador
      this.userForm.get('EleccionId')?.updateValueAndValidity();

    } else {
      // Modo Creación
      this.userForm.reset();
      this.idCandidato = null;
      this.isCreate = true;
      this.titleForm = 'Creación';
    }
  }

  closeModal() {
    this.userForm.get('EleccionId')?.enable();

    this.userForm.reset();
    this.submitted = false;
    this.isVisible = false;
    this.idCandidato = null; // Limpiar ID al cerrar
    this.serverError = null;
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

  loadElecciones() {
    this.gService
      .list('elecciones/Vigentes')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.eleccionList = data as EleccionVigente[];
        },
        error: (error: any) => {
          console.error('Error al cargar las elecciones', error);
          this.noti.mensaje(
            'Error de datos',
            'No se pudo cargar la lista de las elecciones.',
            TipoMessage.error
          );
        },
      });
  }

  loadCandidato(nombre: any): void {
    this.isCreate = false;

    this.gService
      .get('candidatos/ObtenerCandidato', nombre)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.user = data;
        this.userData = data;
        this.userForm.patchValue({
          idCandidato: this.userData._id,
          Nombre: this.userData.Nombre,
          Partido: this.userData.Partido,
          PerfilId: this.userData.Perfil.IdPerfil,
        });
      });
  }

  async onSubmit() {
    this.submitted = true;
    this.serverError = null;

    if (this.userForm.invalid) {
      this.noti.mensaje(
        'Advertencia',
        'Por favor, corrija los errores del formulario.',
        TipoMessage.warning
      );
      return;
    }

    const { Nombre, Partido, PerfilId, EleccionId } = this.userForm.value;
    const candidatoData: CandidatoForm = { Nombre, Partido, PerfilId };
    const electionId = EleccionId as string;

    if (this.isCreate) {
      try {
        // 1. Crear el Candidato (Aquí el backend valida unicidad de Nombre)
        await this.createCandidate(candidatoData);

        // 2. Relacionar el Candidato con la Elección
        await this.associateCandidate(electionId, Nombre);

        this.noti.mensaje(
          'Cadidato ° Creación',
          `El candidato '${Nombre}' fue registrado y relacionado correctamente.`,
          TipoMessage.success
        );
        this.candidatoCreado.emit();
        this.closeModal();
      } catch (error: any) {
        this.handleApiError(error);
      }
    } else
      try {
        await this.updateCandidate(Nombre, candidatoData);

        this.noti.mensaje(
          'Candidato ° Actualización',
          `El candidato ${Nombre} fue actualizado correctamente.`,
          TipoMessage.success
        );
        this.candidatoCreado.emit();
        this.closeModal();
      } catch (error: any) {
        this.handleApiError(error);
      }
  }

  private handleApiError(error: any): void {
    const apiError = error.error?.error;
    const nombreControl = this.userForm.get('Nombre');

    if (apiError) {
      this.serverError = apiError;
      this.noti.mensaje('Error en la operación', `${apiError}`, TipoMessage.error);

      // Si el error es de unicidad de nombre, marcar el campo
      if (apiError.includes('Ya existe un candidato con ese nombre')) {
        nombreControl?.setErrors({ uniqueName: true, serverError: apiError });
        nombreControl?.markAsTouched();
      }
    } else {
      this.serverError = 'Error desconocido al intentar procesar el candidato.';
      this.noti.mensaje('Error Desconocido', this.serverError, TipoMessage.error);
      console.error('Submission error:', error);
    }
  }

  private createCandidate(candidato: CandidatoForm): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gService
        .create('candidatos/Agregar', candidato)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => resolve(res),
          error: (err) => reject(err),
        });
    });
  }

  private associateCandidate(electionId: string, candidateName: string): Promise<any> {
    const data = { NombreCandidato: candidateName };
    return new Promise((resolve, reject) => {
      this.gService
        .create(`elecciones/AgregarCandidato/${electionId}`, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => resolve(res),
          error: (err) => reject(err),
        });
    });
  }

  private updateCandidate(nombre: string, candidato: CandidatoForm): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gService
        .update(`candidatos/Actualizar/${nombre}`, candidato)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => resolve(res),
          error: (err) => reject(err),
        });
    });
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
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
