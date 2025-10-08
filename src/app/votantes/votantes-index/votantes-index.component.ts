import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MenuComponent } from '../../shared/menu/menu.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { VotantesCreateComponent } from '../votantes-create/votantes-create.component';
import { VotantesDetailComponent } from '../votantes-detail/votantes-detail.component';
import { VotantesDesactivarComponent } from '../votantes-desactivar/votantes-desactivar.component';

export interface Persona {
  Identificacion: number; // Usado como Cédula/ID
  Nombre: string; // Nombre de la persona
  Contrasenna: string;
  Telefono: string;
  Correo: string;
  Perfil: 'Votante' | 'Administrador'; // Rol/Perfil
}
@Component({
  templateUrl: './votantes-index.component.html',
  styleUrl: './votantes-index.component.scss',
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
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,

    //Modals
    VotantesCreateComponent,
    VotantesDetailComponent,
    VotantesDesactivarComponent, 
  ],
})
export class VotantesIndexComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('votanteFormModal') votanteFormModal!: VotantesCreateComponent;
  @ViewChild('votanteDetalleModal') votanteDetalleModal!: VotantesDetailComponent;
  @ViewChild('deleteVotanteModal') deleteVotanteModal!: VotantesDesactivarComponent;

  dataSource = new MatTableDataSource<Persona>();
  datos: Persona[] = []; // Datos de ejemplo

  displayedColumns = ['Identificacion', 'Nombre', 'Correo', 'Perfil', 'accion'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  //Filtros;
  selectedRole: string = 'Todos'; // Inicia por defecto en 'Todos'
  searchCedula: string = ''; // Filtro por cédula

  roles = [
    { name: 'Todos', label: 'Todos los roles' },
    { name: 'Administrador', label: 'Administradores' },
    { name: 'Votante', label: 'Votantes' },
  ];

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchVotantes();
  }

  ngAfterViewInit(): void {
    this.votanteFormModal.votanteCreado.subscribe(() => {
      this.fetchVotantes();
    });
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    this.deleteVotanteModal.votanteDesactivado.subscribe((newStatus: number) => {
      this.fetchVotantes()
    }); 
  }


  fetchVotantes() {
    this.gService
      .list('personas/Listar')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.datos = data as Persona[];

          this.updateTable(this.datos);
        },
        error: (error: any) => {
          console.error('Error fetching votantes', error);
        },
      });
  }

  onFilterChange(): void {
    let currentData = [...this.datos]; // Siempre empezamos con el array original completo

    // 1. Filtrar por Rol/Perfil (Case-Insensitive)
    // Solo aplica el filtro si el rol seleccionado NO es 'Todos'
    if (this.selectedRole && this.selectedRole !== 'Todos') {
      const selectedRoleLower = this.selectedRole.toLowerCase();
      currentData = currentData.filter(
        (data: Persona) =>
          // Compara el perfil del dato con el rol seleccionado, ambos en minúsculas
          (data.Perfil || '').toLowerCase() === selectedRoleLower
      );
    }

    // 2. Filtrar por Cédula/Identificación
    if (this.searchCedula) {
      const searchText = String(this.searchCedula).trim();

      // Filtra sobre los datos ya filtrados por rol
      currentData = currentData.filter((data: Persona) =>
        // Convierte la Identificación a string para usar includes()
        String(data.Identificacion).includes(searchText)
      );
    }

    // 3. Actualizar la tabla con los datos finales filtrados
    this.updateTable(currentData);
  }

  updateTable(data: Persona[]) {
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

  crear() {
    this.votanteFormModal.openModal();
  }

  update(Identificacion: any) {
    this.votanteFormModal.openModal(Identificacion);
  }

  redirectDetalle(Identificacion: any) {
    this.votanteDetalleModal.openModal(Identificacion);
  }

  delete(Identificacion: any) {
    this.deleteVotanteModal.openModal(Identificacion); 
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
