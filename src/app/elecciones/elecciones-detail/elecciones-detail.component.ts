import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { NotificacionService, TipoMessage } from '../../shared/notification.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Definición de interfaces para la estructura de datos
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
  Perfil: Perfil;
  Partido: string;
  TotalVotos?: number;
}

interface EleccionDetail {
  Activa?: boolean;
  _id: string; // El ID que se obtiene de la URL
  Nombre: string;
  Sede: Sede;
  Perfil: Perfil;
  FechaInicio: string; // Se mantendrá como string para el objeto Date
  FechaFin: string; // Se mantendrá como string para el objeto Date
  Candidatos: Candidato[];
}

interface VotosResultado {
  totalVotos: number;
  candidato: {
    nombre: string;
    partido: string;
  };
}

interface EleccionVotos {
  mensaje: string;
  resultados: VotosResultado[];
}

@Component({
  selector: 'app-elecciones-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './elecciones-detail.component.html',
  styleUrl: './elecciones-detail.component.scss',
})
export class EleccionesDetailComponent {
  isVisible = false;

  idEleccion: string | null = null;
  eleccion: EleccionDetail | undefined;
  votos: VotosResultado[] | undefined;
  
  votosResultados: VotosResultado[] | undefined;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gService: GenericService,
    private noti: NotificacionService
  ) {}

  openModal(id: any) {
    this.isVisible = true;
    this.loadEleccionDetail(id);
    this.loadEleccionVotos(id);
  }

  loadEleccionVotos(id: any) {
    this.gService
      .get('votos/PorEleccion', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: EleccionVotos) => {
          this.votos = data.resultados;
          this.mergeCandidatosVotos();
        },
        error: (error: any) => {
          console.error('Error al cargar datos de la elección:', error);
          this.noti.mensaje(
            'Error de carga',
            'No se pudo obtener la información de la elección.',
            TipoMessage.error
          );
        },
      });
  }

  // Carga los datos de la elección usando el ID obtenido
  loadEleccionDetail(id: any) {
    this.gService
      .get('elecciones/ObtenerEleccion', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.eleccion = data as EleccionDetail;
          this.mergeCandidatosVotos();
        },
        error: (error: any) => {
          console.error('Error al cargar datos de la elección:', error);
          this.noti.mensaje(
            'Error de carga',
            'No se pudo obtener la información de la elección.',
            TipoMessage.error
          );
        },
      });
  }

  mergeCandidatosVotos() {
    // Solo procedemos si ambos conjuntos de datos están cargados
    if (!this.eleccion || !this.eleccion.Candidatos || !this.votos) {
      return;
    }

    // 1. Crear un mapa para buscar los votos rápidamente (optimización de O(1))
    const mapaVotos = new Map<string, number>();
    this.votos.forEach((voto) => {
      // Creamos una clave única: "Nombre|Partido"
      const clave = `${voto.candidato.nombre}|${voto.candidato.partido}`;
      mapaVotos.set(clave, voto.totalVotos);
    });

    this.eleccion.Candidatos = this.eleccion.Candidatos.map((candidato) => {
      // Creamos la misma clave para buscar en la elección: "Nombre|Partido"
      const clave = `${candidato.Nombre}|${candidato.Partido}`;

      // 3. Asignar el valor de totalVotos, o 0 si no se encuentra en el mapa
      const totalVotos = mapaVotos.get(clave) || 0;

      return {
        ...candidato,
        TotalVotos: totalVotos,
      };
    });
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

  get estadoDinamico(): 'Activa' | 'Inactiva' {
    if (!this.eleccion || !this.eleccion.FechaFin) {
      // Manejo de caso si el objeto aún no está cargado o le falta la fecha
      return 'Inactiva';
    }

    // 1. Obtener la fecha de cierre de la elección.
    // El constructor de Date() es lo suficientemente flexible para muchos formatos ISO 8601.
    const fechaFin = new Date(this.eleccion.FechaFin);

    // 2. Obtener la fecha y hora actuales.
    const fechaActual = new Date();

    // 3. Comparar las fechas. Si la fecha de fin (en milisegundos) es menor
    // a la fecha actual, significa que ya pasó.
    if (fechaFin.getTime() < fechaActual.getTime()) {
      return 'Inactiva';
    } else {
      return 'Activa';
    }
  }

  // Manejo de la destrucción del componente
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  closeModal() {
    this.isVisible = false;
  }
}
