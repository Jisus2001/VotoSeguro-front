import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notification.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-elecciones-delete',
  standalone: true,
  imports: [],
  templateUrl: './elecciones-delete.component.html',
  styleUrl: './elecciones-delete.component.scss',
})
export class EleccionesDeleteComponent {
  isVisible = false;
  idUser: number = 0;
  idEleccion: string | null = null; 
  userData: any;
  respuesta: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  userForm!: FormGroup;

  @Output() eleccionDelete: EventEmitter<number> = new EventEmitter<number>();

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

  openModal(id?: any) {
    this.idEleccion = id; 
    this.isVisible = true;
    if (id !== undefined && !isNaN(Number(id))) {
      this.loadEleccion(id);
    }
  }

  // Método para cerrar el modal
  closeModal() {
    this.isVisible = false;
    this.idEleccion = null; 
  }
  onReset() {
    this.userForm.reset();
  }

  // Método para manejar el envío del formulario
  onSubmit() {

    this.gService
      .remove(`elecciones/Eliminar`, this.idEleccion)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.respuesta = data;
          this.noti.mensaje(
            'Partido Electoral • Eliminación',
            `El partido ha sido eliminado exitosamente.`,
            TipoMessage.success
          );
          /* this.usuarioModificado.emit(); */
          this.eleccionDelete.emit();
          this.closeModal(); 
        },
        (error) => {
          console.error('Error en la petición:', error);
        }
      );

    this.closeModal();
  }

  loadEleccion(id: any): void {

    this.gService
      .get('elecciones/ObtenerEleccion', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.userData = data;
        this.userForm.setValue({
          idEleccion: this.userData._id,
        });
      });
  }
}
