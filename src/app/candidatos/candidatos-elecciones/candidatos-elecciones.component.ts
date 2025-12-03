import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuComponent } from '../../shared/menu/menu.component';
import { CandidatosVotacionesComponent } from '../candidatos-votaciones/candidatos-votaciones.component';
import { NotificacionService, TipoMessage } from '../../shared/notification.service';

interface Sede {
  IdSede: number;
  Nombre: string;
}

interface Perfil {
  IdPerfil: number;
  Descripcion: string;
}

interface Candidato {
  _id: string;
  Nombre: string;
  Descripcion: string;
  Perfil: Perfil;
  Partido: string;
}

interface EleccionVigente {
  _id: string;
  Nombre: string;
  Sede: Sede;
  Perfil: Perfil;
  FechaInicio: string;
  FechaFin: string;
  Candidatos: Candidato[];
}

type EleccionReferencia = string | { _id: string; Nombre: string };

interface VotoRealizado {
  _id: string;
  Identificacion: string;
  EleccionId: {
    _id: string;
    Nombre: string;
  };
  CandidatoId: {
    _id: string;
    Nombre: string;
  };
  Fecha: Date;
}

@Component({
  selector: 'app-candidatos-elecciones',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MenuComponent,
    HeaderComponent,

    CandidatosVotacionesComponent,
  ],
  templateUrl: './candidatos-elecciones.component.html',
  styleUrl: './candidatos-elecciones.component.scss',
})
export class CandidatosEleccionesComponent implements OnInit, AfterViewInit {
  @ViewChild('votacionesCandidatoModal') votacionesCandidatoModal!: CandidatosVotacionesComponent;

  destroy$: Subject<boolean> = new Subject<boolean>();
  idEleccionVal: string | null = null;
  // --- Estado del Componente (Signals) ---
  eleccion = signal<EleccionVigente | null>(null);
  isLoading = signal(true);
  selectedCandidato = signal<Candidato | null>(null);

  // Lista de IDs de elección por los que el usuario ya votó
  votosRealizados = signal<string[]>([]);
  showVotoRealizadoOverlay = signal(false);
  showSuccessMessage: boolean = false;

  userIdentificacion: string | null = null;

  constructor(private gService: GenericService, private noti: NotificacionService) {}

  ngOnInit(): void {
    this.loadEleccionesVigente();
  }

  ngAfterViewInit(): void {
    this.votacionesCandidatoModal.votacionesDetail.subscribe(() => {
      this.loadEleccionesVigente();
    });
  }

  loadEleccionesVigente() {
    this.isLoading.set(true);

    this.gService
      .list('elecciones/Vigentes')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: EleccionVigente[]) => {
          const primeraEleccion = data.length > 0 ? data[0] : null;
          this.eleccion.set(primeraEleccion);

          this.isLoading.set(false);
          this.loadVotosRealizados();
        },
        error: (err) => {
          console.error('Error al cargar elecciones:', err);
          this.isLoading.set(false);
          this.eleccion.set(null); // Asegura que se muestre el mensaje de "No Vigente"
          // NOTA: Aquí podrías usar tu NotificationService para mostrar un error.
        },
      });
  }

  loadVotosRealizados() {

    this.gService
      .list(`votos/PorPersona/${this.userIdentificacion}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (votos: VotoRealizado[]) => {
          // Mapeo seguro: Maneja si EleccionId es un objeto o un string (ID sin poblar)
          const idsEleccionesVotadas = votos
            .map((voto) => {
              if (typeof voto.EleccionId === 'object' && voto.EleccionId !== null) {
                // Es un objeto poblado, extraemos el _id
                this.idEleccionVal = voto.EleccionId._id;

                return voto.EleccionId._id;
              } else if (typeof voto.EleccionId === 'string') {
                // Es un string (ID sin poblar)
                return voto.EleccionId;
              }
              return null; // Caso no esperado o EleccionId faltante
            })
            // Filtramos cualquier valor null o undefined
            .filter((id): id is string => !!id);

          this.votosRealizados.set(idsEleccionesVotadas);
          this.isLoading.set(false);

          // FIX: Llamar la Signal como función para obtener su valor y evitar el log "signalGetFn"
        },
        error: (err) => {
          console.error('Error al cargar votos realizados:', err);
          this.noti.mensaje(
            'Advertencia',
            'No se pudieron cargar sus votos previos.',
            TipoMessage.warning
          );
          this.votosRealizados.set([]);
          this.isLoading.set(false);
        },
      });
  }

  showVotoRealizadoOverlayHandler() {
    this.showVotoRealizadoOverlay.set(true);
  }

  /**
   * Cierra el overlay informativo.
   */
  closeVotoRealizadoOverlay() {
    this.showVotoRealizadoOverlay.set(false);
  }

  // Lógica de verificación y redirección
  redirectVerificacion(idEleccion: string, idCandidato: string, part: string) {
    this.votacionesCandidatoModal.openModal(idEleccion, idCandidato, part);
  }

  showModal() {
    if (this.votosRealizados().includes(this.eleccion()!._id)) {
      // // El usuario ya votó en esta elección
      // const nombreEleccion = this.eleccion()?.Nombre || 'la presente elección';
      // this.noti.mensaje(
      //   'Voto ya registrado',
      //   `Estimado usuario. Le usted ya realizó la votación para ${nombreEleccion}.`,
      //   TipoMessage.warning
      // );
      this.showVotoRealizadoOverlay();
      this.showSuccessMessage = true;
    }
  }

  // Función de utilidad para formatear la fecha
  formatDate(isoDate: string): string {
    if (!isoDate) return 'N/A';
    // Crea un objeto Date y lo formatea al locale (por ejemplo, 'es-ES')
    const date = new Date(isoDate);
    // Formato corto, ajusta según necesidad:
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
