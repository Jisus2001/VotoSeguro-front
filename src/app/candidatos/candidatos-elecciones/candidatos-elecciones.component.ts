import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
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

    CandidatosVotacionesComponent
  ],
  templateUrl: './candidatos-elecciones.component.html',
  styleUrl: './candidatos-elecciones.component.scss',
})
export class CandidatosEleccionesComponent implements OnInit {
  @ViewChild('votacionesCandidatoModal') votacionesCandidatoModal!: CandidatosVotacionesComponent;

  private sanitizer = inject(DomSanitizer);
  destroy$: Subject<boolean> = new Subject<boolean>();

  // --- Estado del Componente (Signals) ---
  eleccion = signal<EleccionVigente | null>(null);
  isLoading = signal(true);
  selectedCandidato = signal<Candidato | null>(null);

  personIcon: SafeHtml | undefined;

  constructor(private gService: GenericService) {
    // Definición del SVG para el icono de persona
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.023 18.023 0 0 1 12 21.75c-2.422 0-4.764-.234-7.001-.649a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
      </svg>
    `;
    this.personIcon = this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  ngOnInit(): void {
    this.loadEleccionesVigente();
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

          if (this.eleccion()) {
            console.log('Elección vigente cargada:', this.eleccion());
          } else {
            console.log('No hay elecciones vigentes.');
          }
        },
        error: (err) => {
          console.error('Error al cargar elecciones:', err);
          this.isLoading.set(false);
          this.eleccion.set(null); // Asegura que se muestre el mensaje de "No Vigente"
          // NOTA: Aquí podrías usar tu NotificationService para mostrar un error.
        },
      });
  }

  redirectVerificacion(idEleccion: string, idCandidato: string, part: string) {
    
    this.votacionesCandidatoModal.openModal(idEleccion, idCandidato, part); 
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
