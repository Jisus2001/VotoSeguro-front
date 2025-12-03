import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuComponent } from '../../shared/menu/menu.component';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { PerfilesCreateComponent } from '../perfiles-create/perfiles-create.component';
import { PerfilesDeleteComponent } from '../perfiles-delete/perfiles-delete.component';

export interface Perfiles {
  IdPerfil: number; // Usado como Cédula/ID
  Descripcion: string; // Nombre de la persona
}

@Component({
  selector: 'app-perfiles-index',
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
    PerfilesCreateComponent,
    PerfilesDeleteComponent,
  ],
  templateUrl: './perfiles-index.component.html',
  styleUrl: './perfiles-index.component.scss',
})
export class PerfilesIndexComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('perfilFormModal') perfilFormModal!: PerfilesCreateComponent;
  @ViewChild('deletePerfilModal') deletePerfilModal!: PerfilesDeleteComponent;

  dataSource = new MatTableDataSource<Perfiles>();
  datos: Perfiles[] = [];

  displayedColumns = ['IdPerfil', 'Descripcion', 'accion'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchPerfiles();
  }

  ngAfterViewInit(): void {
    this.perfilFormModal.perfilCredo.subscribe(() => {
      this.fetchPerfiles();
    });
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    this.deletePerfilModal.perfilDelete.subscribe((newStatus: number) => {
      this.fetchPerfiles();
    });
  }

  fetchPerfiles() {
    this.gService
      .list('perfiles/Listar')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.datos = data as Perfiles[];
          this.updateTable(this.datos);
        },
        error: (error: any) => {
          console.error('Error fetching votantes', error);
        },
      });
  }

  updateTable(data: Perfiles[]) {
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
    this.perfilFormModal.openModal();
  }

  delete(id: any) {
    this.deletePerfilModal.openModal(id);
  }

  update(id: any) {
    this.perfilFormModal.openModal(id);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
