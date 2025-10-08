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
  selector: 'app-votantes-desactivar',
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
  templateUrl: './votantes-desactivar.component.html',
  styleUrl: './votantes-desactivar.component.scss',
})
export class VotantesDesactivarComponent {
  isVisible = false;
  idUser: number = 0;
  Identificacion: any; // Usado como Cédula/ID
  userData: any;
  respuesta: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  userForm: FormGroup;

  @Output() votanteDesactivado: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    // Inicializar el formulario aquí en el constructor
    this.userForm = this.fb.group({
      Identificacion: ['', Validators.required],
    });
  }

  // Método para abrir el modal
  openModal(id?: any) {
    this.isVisible = true;
    if (id !== undefined && !isNaN(Number(id))) {
      this.loadUser(id);
    }
  }

  // Método para cerrar el modal
  closeModal() {
    this.isVisible = false;
  }
  onReset(){
    this.userForm.reset(); 
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    console.log(this.Identificacion); 
    if (this.userForm.value) {
      this.gService
        .remove(`personas/Eliminar`, this.Identificacion)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: any) => {
            this.respuesta = data;
            this.noti.mensaje(
              'Votantes • Eliminación',
              `El votante sido eliminado exitosamente.`,
              TipoMessage.success
            );
            /* this.usuarioModificado.emit(); */
            this.votanteDesactivado.emit(this.Identificacion);
          },
          (error) => {
            console.error('Error en la petición:', error);
          }
        );
    }
    this.closeModal();
  }

  loadUser(id: any): void {

    this.Identificacion = id; 

    this.gService
      .get('personas/ObtenerPersona', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.userData = data;
        this.userForm.setValue({
          Identificacion: this.userData.Identificacion,
        });
      });
    console.log(this.Identificacion);
  }
}
