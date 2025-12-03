import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../shared/menu/menu.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../shared/generic.service';
import { Subject, takeUntil } from 'rxjs';
import Chart from 'chart.js/auto';
import { NotificacionService, TipoMessage } from '../../shared/notification.service';
import { Form, FormBuilder, FormGroup } from '@angular/forms';

interface ParticipacionData {
  mensaje: string;
  totalVotantes: number;
  totalParticipantes: number;
  totalNoParticipantes: number;
  porcentajeParticipantes: string; // Incluye el '%'
  porcentajeNoParticipantes: string; // Incluye el '%'
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
  selector: 'app-elecciones-participacion',
  standalone: true,
  imports: [],
  templateUrl: './elecciones-participacion.component.html',
  styleUrl: './elecciones-participacion.component.scss',
})
export class EleccionesParticipacionComponent {
  isVisible = false;
  idEleccion: string | null = null;
  NombreEleccion: string | null = null;

  participacionData: ParticipacionData | undefined;
  votosResultados: VotosResultado[] | undefined;

  chart: Chart | undefined;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private noti: NotificacionService
  ) {}

  openModal(id: any, Nombre: any) {
    
    this.votosResultados = undefined; 

    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    const votosChart = Chart.getChart('votosChart');
    if (votosChart) {
      votosChart.destroy();
    }
    this.isVisible = true;
    this.loadParticipacion(id);
    this.loadCandidatos(id);
    this.NombreEleccion = Nombre;
  }

  loadParticipacion(id: any) {
    // La respuesta del backend coincide directamente con la interfaz ParticipacionData
    this.gService
      .get('votos/ParticipantesPorEleccion', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ParticipacionData) => {
          this.participacionData = data;
        },
        error: (err) => {
          console.error('Error al cargar la participación:', err);
          this.noti.mensaje(
            'Error de carga',
            'No se pudo obtener la información de participación.',
            TipoMessage.error
          );
        },
      });
  }

  loadCandidatos(id: any): void {
    // La respuesta del backend (EleccionVotos) contiene el array de resultados (VotosResultado[])
    this.gService
      .get('votos/PorEleccion', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: EleccionVotos) => {
          this.votosResultados = data.resultados;
          this.createVotosChart(); // Llamada para generar el gráfico de votos
        },
        error: (error: any) => {
          console.error('Error al cargar datos de los candidatos:', error);
          this.noti.mensaje(
            'Error de carga',
            'No se pudo obtener la información de los candidatos.',
            TipoMessage.error
          );
        },
      });
  }

  //Chart de Votos Obtenidos por Candidato
  createVotosChart(): void {
    // Destruye el gráfico anterior si existe (si se reutiliza un canvas)
    const existingChart = Chart.getChart('votosChart');
    if (existingChart) {
      existingChart.destroy();
    }

    if (!this.votosResultados || this.votosResultados.length === 0) {
      return;
    }

    const ctx = document.getElementById('votosChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('No se encontró el elemento canvas con id "votosChart"');
      return;
    }

    const labels = this.votosResultados.map(
      (r) => `${r.candidato.nombre} (${r.candidato.partido})`
    );
    const data = this.votosResultados.map((r) => r.totalVotos);

    new Chart(ctx, {
      type: 'bar', // Gráfico de barras para votos
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total de votos',
            data: data,
            backgroundColor: 'rgb(5, 44, 101)', // Un azul bonito
            borderColor: 'rgb(5, 44, 101)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Resultados de votos por candidato',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Votos',
            },
            // Asegura que los votos sean números enteros
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            title: {
              display: true,
              text: 'Candidato',
            },
          },
        },
      },
    });
  }

  closeModal() {
    this.isVisible = false;
    // Opcional: Destruir los gráficos al cerrar el modal para liberar memoria
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    const votosChart = Chart.getChart('votosChart');
    if (votosChart) {
      votosChart.destroy();
    }
  }

  // Manejo de la destrucción del componente
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    const votosChart = Chart.getChart('votosChart');
    if (votosChart) {
      votosChart.destroy();
    }
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
