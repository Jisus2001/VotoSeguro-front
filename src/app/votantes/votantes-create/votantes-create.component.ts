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
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-votantes-create',
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
  templateUrl: './votantes-create.component.html',
  styleUrl: './votantes-create.component.scss',
})
export class VotantesCreateComponent {
  isVisible = false;
  Identificacion: any; // Usado como Cédula/ID
  Nombre: any; // Nombre de la persona
  Contrasenna: any;
  Telefono: any;
  Correo: any;
  Perfil: any;
  TypePerfil: any;

  @Output() votanteCreado: EventEmitter<void> = new EventEmitter<void>();

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
      Identificacion: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(12),
          Validators.pattern(this.numRegex),
        ]),
      ],
      Nombre: ['', Validators.required],
      Contrasenna: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
      Telefono: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numRegex),
          Validators.minLength(8),
          Validators.maxLength(8),
        ]),
      ],
      Correo: [null, [Validators.required, Validators.email]],
      Perfil: [null, Validators.required],
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
      .get('personas/ObtenerPersona', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.user = data;

        this.userForm.patchValue({
          Identificacion: this.user.Identificacion,
          Nombre: this.user.Nombre,
          Contrasenna: this.user.Contrasenna,
          Telefono: this.user.Telefono,
          Correo: this.user.Correo,
          Perfil: this.user.Perfil,
        });
        this.TypePerfil = this.userForm.value.Perfil;
      });
  }

  closeModal() {
    this.submitted = false;
    this.userForm.reset();
    this.isVisible = false;
    this.isCreate = true;
    this.titleForm = 'Creación';
    this.votanteCreado.emit();
  }

  // Nuevo método para verificar si el usuario existe (de forma asíncrona)
  private checkIfUserExists(identificacion: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.gService
        .get('personas/ObtenerPersona', identificacion)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            // Si la respuesta tiene datos válidos, el usuario existe.
            resolve(!!data && data.Identificacion);
          },
          error: (err) => {
            // Si hay un error (ej: 404 Not Found), asumimos que el usuario no existe para la creación.
            // Es importante que el servicio maneje adecuadamente los errores 404 para no romper la app.
            // Si el error es diferente a 'No encontrado', podrías resolver 'true' para bloquear.
            resolve(false);
          },
        });
    });
  }

  async onSubmit() {
    this.submitted = true;

    const formData = { ...this.userForm.value };

    formData.Identificacion = String(formData.Identificacion);
    formData.Nombre = String(formData.Nombre);
    formData.Contrasenna = String(formData.Contrasenna);
    formData.Telefono = String(formData.Telefono);
    formData.Correo = String(formData.Correo);

    if (this.isCreate) {
      formData.Perfil = String(this.Perfil);
    } else {
      formData.Perfil = String(this.TypePerfil);
    }

    if (!formData.Identificacion) {
      this.noti.mensaje(
        'Error',
        'Debe completar todos los campos requeridos y válidos.',
        TipoMessage.error
      );

      return;
    }

    if (this.isCreate) {
      try {
        const userExists = await this.checkIfUserExists(formData.Identificacion);

        if (userExists) {
          this.noti.mensaje(
            'Advertencia',
            'Ya existe un votante con la misma identificación.',
            TipoMessage.warning
          );
          // Opcional: limpiar solo el campo de identificación o dejarlo para que el usuario lo edite
          // this.userForm.get('Identificacion')?.setValue('');
          // this.userForm.get('Perfil')?.setValue('');
          // this.userForm.get('Nombre')?.setValue('');
          // this.userForm.get('Correo')?.setValue('');
          // this.userForm.get('Contrasenna')?.setValue('');
          // this.userForm.get('Telefono')?.setValue('');
          this.closeModal();
          return;
        }

        this.gService
          .create('personas/Agregar', formData)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.respCreate = data;
            this.noti.mensaje(
              'Votante creado',
              `El votante ha sido creado con éxito.`,
              TipoMessage.success
            );
            this.votanteCreado.emit();
            this.closeModal();
            this.router.navigate(['/votantes']);
          });
      } catch (error) {
        console.error('Error durante la validación de existencia:', error);
        this.noti.mensaje(
          'Error',
          'Ocurrió un error al verificar la identificación.',
          TipoMessage.error
        );
      }
    } else {
      this.gService
        .update('personas/Actualizar', formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respuesta = data;
          this.noti.mensaje(
            'Votante actualizado',
            `El votante ha sido actualizado con éxito.`,
            TipoMessage.success
          );
          this.votanteCreado.emit();
          this.closeModal();
          this.router.navigate(['/votantes']);
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
