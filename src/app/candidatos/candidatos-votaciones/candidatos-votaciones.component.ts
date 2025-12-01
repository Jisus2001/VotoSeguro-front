import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notification.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-candidatos-votaciones',
  standalone: true,
  imports: 
  [
    MatProgressSpinner,
  ],
  templateUrl: './candidatos-votaciones.component.html',
  styleUrl: './candidatos-votaciones.component.scss',
})
export class CandidatosVotacionesComponent {
  showSuccessMessage: boolean = false;
  isVoting: boolean = false;

  isVisible = false;
  idUser: string | null = null;
  idEleccion: string | null = null;
  idCandidato: string | null = null;
  Partido: string | null = null;

  userData: any;
  respuesta: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  userForm!: FormGroup;

  @Output() votacionesDetail: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    // Inicializar el formulario aquí en el constructor
    this.userForm = this.fb.group({
      idUser: [''],
      idEleccion: [''],
      idCandidato: [''],
      Partido: [''],
    });
  }

  openModal(idE: string, idC: string, part: string) {
    this.isVisible = true;

    if (idE !== null) {
      this.idUser = window.localStorage.getItem('ID') || 'ID';
      this.idEleccion = idE;
      this.idCandidato = idC;
      this.Partido = part;
    }
  }

  closeModal() {
    this.isVisible = false;

    this.idCandidato = null;
    this.idEleccion = null;
    this.idUser = null;
    this.Partido = null;
  }

  onReset() {
    this.userForm.reset();
  }

  confirmVote() {
    // 1. Validar que no se haya iniciado la votación y que los datos estén completos
    if (this.isVoting || !this.idUser || !this.idEleccion || !this.idCandidato) {
      // Si el ID del usuario es 'ID', es un fallback y debería mostrar un error real.
      this.noti.mensaje(
        'Error de Votación',
        'Datos incompletos para registrar el voto.',
        TipoMessage.error
      );
      return;
    }

    this.isVoting = true;

    const votoPayload = {
      Identificacion: this.idUser,
      EleccionId: this.idEleccion,
      CandidatoId: this.idCandidato,
    };

    this.gService
      .create('votos/Registrar', votoPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.respuesta = res;
          this.noti.mensaje(
            'Votación',
            'El voto se ha registrado exitosamente.',
            TipoMessage.success
          );

          // 4. Mostrar la pantalla de éxito
          this.isVisible = false; // Cierra el modal de confirmación
          this.showSuccessMessage = true; // Muestra la pantalla de éxito
          this.isVoting = false;

          // 5. Ocultar la pantalla después de 3 segundos y navegar (como se solicitó)
          setTimeout(() => {
            this.showSuccessMessage = false;
            // Se asume que /elecciones es la ruta principal. Ajustar si es necesario.
            this.router.navigate(['/dashboard']);
          }, 4000); // Duración: 3 segundos
        },
        error: (err) => {
          this.isVoting = false;
          this.noti.mensaje(
            'Votación',
            'Error al registrar el voto. Intente de nuevo.',
            TipoMessage.error
          );
          console.error('Error registrando voto:', err);
        },
      });
  }
}
