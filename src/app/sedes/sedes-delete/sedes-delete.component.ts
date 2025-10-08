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
  selector: 'app-sedes-delete',
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
  templateUrl: './sedes-delete.component.html',
  styleUrl: './sedes-delete.component.scss',
})
export class SedesDeleteComponent {
  isVisible = false;
  IdSede: any;
  userData: any;
  respuesta: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  userForm!: FormGroup;

  @Output() sedeDelete: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.userForm = this.fb.group({
      IdSede: ['', Validators.required],
    });
  }

  // Método para abrir el modal
  openModal(id?: any) {
    this.isVisible = true;
    if (id !== undefined && !isNaN(Number(id))) {
      this.loadSede(id);
    }
    this.IdSede = id;
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
        .remove(`sedes/Eliminar`, this.IdSede)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: any) => {
            this.respuesta = data;
            this.noti.mensaje(
              'Sede • Eliminación',
              `La sede ha sido eliminado exitosamente.`,
              TipoMessage.success
            );
            /* this.usuarioModificado.emit(); */
            this.sedeDelete.emit(this.IdSede);
          },
          (error) => {
            console.error('Error en la petición:', error);
          }
        );
    }
    this.closeModal();
  }

  loadSede(id: any): void {
    console.log(this.IdSede);
    console.log(id);

    this.gService
      .get('sedes/ObtenerSede', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.userData = data;
      });
  }
}
