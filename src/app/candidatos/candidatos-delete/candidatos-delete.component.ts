import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notification.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidatos-delete',
  standalone: true,
  imports: [],
  templateUrl: './candidatos-delete.component.html',
  styleUrl: './candidatos-delete.component.scss'
})
export class CandidatosDeleteComponent {
isVisible = false;
  idUser: number = 0;
  Nombre: string | null = null; 
  userData: any;
  respuesta: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  userForm!: FormGroup;

  @Output() candidatoDelete: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    // Inicializar el formulario aquí en el constructor
    this.userForm = this.fb.group({
      Nombre: ['', Validators.required],
    });
  }

  openModal(nombre?: any) {
    this.Nombre = nombre; 
    this.isVisible = true;
    if (nombre !== null) {
      this.loadCandidatos(nombre);
    }
  }

  // Método para cerrar el modal
  closeModal() {
    this.isVisible = false;
    this.Nombre = null; 
  }
  onReset() {
    this.userForm.reset();
  }

  // Método para manejar el envío del formulario
  onSubmit() {

    this.gService
      .remove(`candidatos/Eliminar`, this.Nombre)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.respuesta = data;
          this.noti.mensaje(
            'Candidato • Eliminación',
            `El candidato sido eliminado exitosamente.`,
            TipoMessage.success
          );
          /* this.usuarioModificado.emit(); */
          this.candidatoDelete.emit();
          this.closeModal(); 
        },
        (error) => {
          console.error('Error en la petición:', error);
        }
      );

    this.closeModal();
  }

  loadCandidatos(nombre: any): void {

    this.gService
      .get('candidatos/ObtenerCandidato', nombre)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.userData = data;
        this.userForm.setValue({
          Nombre: this.userData.Nombre,
        });
        console.log(this.userForm.value); 
      });
  }

}
