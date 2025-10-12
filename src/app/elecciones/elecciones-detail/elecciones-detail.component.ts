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
  // Nombre: string; // Nombre de la persona
  // Partido: string;
  // PerfilId: number;
  NombreCandidato: string; 
}

interface EleccionDetail {
  _id: string; // El ID que se obtiene de la URL
  Nombre: string;
  Sede: Sede;
  Perfil: Perfil;
  FechaInicio: string; // Se mantendrá como string para el objeto Date
  FechaFin: string; // Se mantendrá como string para el objeto Date
  Candidatos: Candidato[];
}

@Component({
  selector: 'app-elecciones-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './elecciones-detail.component.html',
  styleUrl: './elecciones-detail.component.scss',
})
export class EleccionesDetailComponent {
  isVisible = false;

  idEleccion: string | null = null;
  eleccion: EleccionDetail | undefined;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gService: GenericService,
    private noti: NotificacionService
  ) {}


  openModal(id: any){
    this.isVisible = true;
      this.loadEleccionDetail(id);
      console.log(id)
  }

  // Carga los datos de la elección usando el ID obtenido
  loadEleccionDetail(id: any) {
    this.gService
      .get('elecciones/ObtenerEleccion', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.eleccion = data as EleccionDetail;
          console.log('Detalle de Elección cargado:', this.eleccion);
        },
        error: (error: any) => {
          console.error('Error al cargar datos de la elección:', error);
          this.noti.mensaje(
            'Error de carga',
            'No se pudo obtener la información de la elección.',
            TipoMessage.error
          );
          // Opcionalmente, puedes redirigir aquí si el recurso no existe (ej. 404)
          // this.router.navigate(['/elecciones/lista']); 
        }
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
        minute: '2-digit'
    });
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
