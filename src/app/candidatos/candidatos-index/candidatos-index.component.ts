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
import { CandidatosDeleteComponent } from '../candidatos-delete/candidatos-delete.component';
import { CandidatosCreateComponent } from '../candidatos-create/candidatos-create.component';
import { CandidatosDetailComponent } from '../candidatos-detail/candidatos-detail.component';

export interface Candidatos {
  _id: number;
  Nombre: string;
  Partido: string;
  Perfil: {
    IdPerfil: number;
    Descripcion: string;
  };
}

export interface Perfil {
  IdPerfil: number;
  Descripcion: string;
}

@Component({
  selector: 'app-candidatos-index',
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

    CandidatosCreateComponent,
    CandidatosDetailComponent,
    CandidatosDeleteComponent,
  ],
  templateUrl: './candidatos-index.component.html',
  styleUrl: './candidatos-index.component.scss',
})
export class CandidatosIndexComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('candidatoFormModal') candidatoFormModal!: CandidatosCreateComponent;
  @ViewChild('detailCandidatoModal') detailCandidatoModal!: CandidatosDetailComponent;
  @ViewChild('deleteCandidatoModal') deleteCandidatoModal!: CandidatosDeleteComponent;

  dataSource = new MatTableDataSource<Candidatos>();
  datos: Candidatos[] = []; // Datos de ejemplo
  datosPerfil: Perfil[] = [];

  displayedColumns = ['Nombre', 'Partido', 'Perfil', 'accion'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  //Filtros;
  selectedPerfil: string = 'Todos'; // Inicia por defecto en 'Todos'
  searchNombre: string = '';
  searchPartido: string = '';

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchCandidatos();
    this.fetchPerfiles();
  }

  ngAfterViewInit(): void {
    this.candidatoFormModal.candidatoCreado.subscribe(() => {
      this.fetchCandidatos();
    });
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    this.deleteCandidatoModal.candidatoDelete.subscribe((newStatus: number) => {
      this.fetchCandidatos();
    });
  }

  fetchCandidatos() {
    this.gService
      .list('candidatos/Listar')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.datos = data as Candidatos[];

          this.updateTable(this.datos);
        },
        error: (error: any) => {
          console.error('Error fetching votantes', error);
        },
      });
  }

  fetchPerfiles() {
    this.gService
      .list('perfiles/Listar')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.datosPerfil = data as Perfil[];
        },
        error: (error: any) => {
          console.error('Error fetching votantes', error);
        },
      });
  }

  updateTable(data: Candidatos[]) {
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
    if (this.selectedPerfil && this.selectedPerfil !== 'Todos') {
      // Convertimos el valor seleccionado (que es numérico, pero viene del ngModel como string/number) a number
      const selectedPerfilId = Number(this.selectedPerfil);

      currentData = currentData.filter(
        (data: Candidatos) =>
          // Filtramos comparando el IdSede de la elección (data.Sede.IdSede) con el ID seleccionado
          // Usamos el optional chaining operator (?.) en caso de que Sede sea null o undefined
          data.Perfil?.IdPerfil === selectedPerfilId
      );
    }

    if (this.searchNombre && this.searchNombre.trim()) {
      const searchText = String(this.searchNombre).trim().toLowerCase();

      // Filtra sobre los datos ya filtrados por rol
      currentData = currentData.filter((data: Candidatos) =>
        // Convierte la Identificación a string para usar includes()
        String(data.Nombre).toLowerCase().includes(searchText)
      );
    }

    if (this.searchPartido && this.searchPartido.trim()) {
      const searchText1 = String(this.searchPartido).trim().toLowerCase();

      // Filtra sobre los datos ya filtrados por rol
      currentData = currentData.filter((data: Candidatos) =>
        // Convierte la Identificación a string para usar includes()
        String(data.Partido).toLowerCase().includes(searchText1)
      );
    }

    // 3. Actualizar la tabla con los datos finales filtrados
    this.updateTable(currentData);
  }

  crear() {
    this.candidatoFormModal.openModal();
  }

  update(nombre: any) {
    this.candidatoFormModal.openModal(nombre);
  }

  redirectDetalle(nombre: any) {
    this.detailCandidatoModal.openModal(nombre);
  }

  delete(nombre: any) {
    this.deleteCandidatoModal.openModal(nombre);
  }

  redirectPerfiles() {
    this.router.navigate(['/perfiles']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
