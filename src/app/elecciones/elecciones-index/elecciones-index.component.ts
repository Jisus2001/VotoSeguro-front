import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuComponent } from '../../shared/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GenericService } from '../../shared/generic.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { EleccionesCreateComponent } from '../elecciones-create/elecciones-create.component';
import { EleccionesDeleteComponent } from '../elecciones-delete/elecciones-delete.component';
import { EleccionesDetailComponent } from '../elecciones-detail/elecciones-detail.component';
import { EleccionesParticipacionComponent } from '../elecciones-participacion/elecciones-participacion.component';
import { NotificacionService, TipoMessage } from '../../shared/notification.service';

export interface Elecciones {
  _id: number;
  Nombre: string;
  FechaInicio: string;
  FechaFin: string;
  PerfilId: 1;
  Sede: {
    IdSede: number;
    Nombre: string;
  };
}

export interface Sedes {
  IdSede: number;
  Nombre: string;
}

@Component({
  selector: 'app-elecciones-index',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MenuComponent,
    HeaderComponent,
    // Angular Material Modules
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    EleccionesCreateComponent,
    EleccionesDeleteComponent,
    EleccionesDetailComponent,
    EleccionesParticipacionComponent,
  ],
  templateUrl: './elecciones-index.component.html',
  styleUrl: './elecciones-index.component.scss',
})
export class EleccionesIndexComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('eleccionFormModal') eleccionFormModal!: EleccionesCreateComponent;
  @ViewChild('deleteEleccionModal') deleteEleccionModal!: EleccionesDeleteComponent;
  @ViewChild('eleccionDetalleModal') eleccionDetalleModal!: EleccionesDetailComponent;
  @ViewChild('eleccionParticipacionModal')
  eleccionParticipacionModal!: EleccionesParticipacionComponent;

  dataSource = new MatTableDataSource<Elecciones>();
  datos: Elecciones[] = []; // Datos de ejemplo
  datosSede: Sedes[] = [];

  displayedColumns = ['Nombre', 'FechaInicio', 'FechaFin', 'Sede', 'accion'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  //Filtros;
  selectedSede: string = 'Todos'; // Inicia por defecto en 'Todos'
  searchNombre: string = '';

  selectedEstado: string = 'Todos'; // Filtro por estado

  estados = [
    { name: 'Todos', label: 'Todos las elecciones' },
    { name: 'Activa', label: 'Activa' },
    { name: 'Inactiva', label: 'Inactiva' },
  ];

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private noti: NotificacionService
  ) {}

  ngOnInit(): void {
    this.fetchElecciones();
    this.fetchSedes();
  }

  ngAfterViewInit(): void {
    this.eleccionFormModal.eleccionCreada.subscribe(() => {
      this.fetchElecciones();
    });
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    this.deleteEleccionModal.eleccionDelete.subscribe((newStatus: number) => {
      this.fetchElecciones();
    });
  }

  fetchElecciones() {
    this.gService
      .list('elecciones/Listar')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.datos = data as Elecciones[];

          this.updateTable(this.datos);
        },
        error: (error: any) => {
          console.error('Error fetching votantes', error);
        },
      });
  }

  fetchSedes() {
    this.gService
      .list('sedes/Listar')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.datosSede = data as Sedes[];
        },
        error: (error: any) => {
          console.error('Error fetching votantes', error);
        },
      });
  }

  updateTable(data: Elecciones[]) {
    this.dataSource.data = data;

    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }, 0);
  }

  onFilterChange(): void {
    let currentData = [...this.datos];

    // Verificamos que se haya seleccionado algo y que no sea la opción 'Todos'
    if (this.selectedSede && this.selectedSede !== 'Todos') {
      // Convertimos el valor seleccionado (que es numérico, pero viene del ngModel como string/number) a number
      const selectedSedeId = Number(this.selectedSede);

      currentData = currentData.filter((data: Elecciones) => data.Sede?.IdSede === selectedSedeId);
    }

        if (this.selectedEstado && this.selectedEstado !== 'Todos') {
      if (this.selectedEstado === 'Inactiva') {
        currentData = currentData.filter(
          (data: any) => data.FechaFin < new Date().toISOString()
        );
      } else if (this.selectedEstado === 'Activa') {
        currentData = currentData.filter(
          (data: any) => data.FechaFin > new Date().toISOString()
        );
      }
    }

    if (this.searchNombre) {
      const searchText = String(this.searchNombre).trim();

      // Filtra sobre los datos ya filtrados por rol
      currentData = currentData.filter((data: Elecciones) =>
        // Convierte la Identificación a string para usar includes()
        String(data.Nombre).includes(searchText)
      );
    }

    // 3. Actualizar la tabla con los datos finales filtrados
    this.updateTable(currentData);
  }

  redirectDetalle(id: any) {
    this.eleccionDetalleModal.openModal(id);
  }

  isElectionOpen(fechaFin: string): boolean {
    const today = new Date();
    // Normalizar la fecha de hoy a medianoche (00:00:00) para comparar solo la fecha
    today.setHours(0, 0, 0, 0);

    // Asumimos que FechaFin viene en formato ISO (YYYY-MM-DD...) que Date() puede parsear
    const cierreDate = new Date(fechaFin);
    cierreDate.setHours(0, 0, 0, 0);

    // Si la fecha de cierre es HOY o en el futuro, la elección sigue abierta (no se puede reportar).
    return cierreDate >= today;
  }

  redirectReport(row: Elecciones) {
    if (this.isElectionOpen(row.FechaFin)) {
      // Muestra la notificación si la elección aún no ha cerrado
      const fechaCierre = new Date(row.FechaFin).toLocaleDateString('es-ES'); // Formateo simple
      this.noti.mensaje(
        'Reporte no disponible',
        `La elección "${row.Nombre}" aún no ha cerrado. Fecha de cierre: ${fechaCierre}.`,
        TipoMessage.warning
      );
      return; // Detener la ejecución
    } else {
      // Si la elección ya cerró, procede a abrir el modal
      this.eleccionParticipacionModal.openModal(row._id, row.Nombre);
    }
  }

  crear() {
    this.eleccionFormModal.openModal();
  }

  update(id: any) {
    this.eleccionFormModal.openModal(id);
  }

  delete(_id: any) {
    this.deleteEleccionModal.openModal(_id);
  }

  redirectSedes() {
    this.router.navigate(['/sedes']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
