import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notification.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-perfiles-delete',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './perfiles-delete.component.html',
  styleUrl: './perfiles-delete.component.scss'
})
export class PerfilesDeleteComponent {
 isVisible = false;
  IdPerfil: any;
  userData: any;
  respuesta: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  userForm!: FormGroup;

  @Output() perfilDelete: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.userForm = this.fb.group({
      IdPerfil: ['', Validators.required],
    });
  }

  // Método para abrir el modal
  openModal(id?: any) {
    this.isVisible = true;
    if (id !== undefined && !isNaN(Number(id))) {
      this.loadPerfil(id);
    }
    this.IdPerfil = id;
  }

  closeModal() {
    this.isVisible = false;
  }

  onReset() {
    this.userForm.reset();
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.userForm !== null) {
      this.gService
        .remove(`perfiles/Eliminar`, this.IdPerfil)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: any) => {
            this.respuesta = data;
            this.noti.mensaje(
              'Perfiles • Eliminación',
              `El perfil ha sido eliminado exitosamente.`,
              TipoMessage.success
            );
            /* this.usuarioModificado.emit(); */
            this.perfilDelete.emit(this.IdPerfil);
          },
          (error) => {
            console.error('Error en la petición:', error);
          }
        );
    }
    this.closeModal();
  }

  loadPerfil(id: any): void {

    this.gService
      .get('perfiles/ObtenerPerfil', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.userData = data;
      });
  }

}
