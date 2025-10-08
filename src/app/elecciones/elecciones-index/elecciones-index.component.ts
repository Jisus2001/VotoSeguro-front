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
  ],
  templateUrl: './elecciones-index.component.html',
  styleUrl: './elecciones-index.component.scss',
})
export class EleccionesIndexComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('eleccionFormModal') eleccionFormModal!: EleccionesCreateComponent;
  @ViewChild('deleteEleccionModal') deleteEleccionModal!: EleccionesDeleteComponent;

  dataSource = new MatTableDataSource<Elecciones>();
  datos: Elecciones[] = []; // Datos de ejemplo
  datosSede: Sedes[] = [];

  displayedColumns = ['Nombre', 'FechaInicio', 'FechaFin', 'Sede', 'accion'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  //Filtros;
  selectedSede: string = 'Todos'; // Inicia por defecto en 'Todos'
  searchNombre: string = '';

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute
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
    })
  }

  fetchElecciones() {
    this.gService
      .list('elecciones/Listar')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.datos = data as Elecciones[];
          console.log(this.datos);

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
          console.log(this.datosSede);
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

      currentData = currentData.filter(
        (data: Elecciones) =>
          // Filtramos comparando el IdSede de la elección (data.Sede.IdSede) con el ID seleccionado
          // Usamos el optional chaining operator (?.) en caso de que Sede sea null o undefined
          data.Sede?.IdSede === selectedSedeId
      );
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

  redirectDetalle(_id: any) {}

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
