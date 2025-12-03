import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../shared/generic.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuComponent } from '../../shared/menu/menu.component';
import { SedesCreateComponent } from '../sedes-create/sedes-create.component';
import { SedesDeleteComponent } from '../sedes-delete/sedes-delete.component';

export interface Sedes {
  IdSede: number; // Usado como Cédula/ID
  Nombre: string; // Nombre de la persona
}

@Component({
  selector: 'app-sedes-index',
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

    SedesCreateComponent,
    SedesDeleteComponent,
  ],
  templateUrl: './sedes-index.component.html',
  styleUrl: './sedes-index.component.scss',
})
export class SedesIndexComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('sedeFormModal') sedeFormModal!: SedesCreateComponent;
  @ViewChild('deleteSedeModal') deleteSedeModal!: SedesDeleteComponent;

  dataSource = new MatTableDataSource<Sedes>();
  datos: Sedes[] = [];

  displayedColumns = ['IdSede', 'Nombre', 'accion'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchSedes();
  }

  ngAfterViewInit(): void {
    this.sedeFormModal.sedeCreada.subscribe(() => {
      this.fetchSedes();
    });
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    this.deleteSedeModal.sedeDelete.subscribe((newStatus: number) => {
      this.fetchSedes();
    });
  }

  fetchSedes() {
    this.gService
      .list('sedes/Listar')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.datos = data as Sedes[];
          this.updateTable(this.datos);
        },
        error: (error: any) => {
          console.error('Error fetching votantes', error);
        },
      });
  }

  updateTable(data: Sedes[]) {
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
    this.sedeFormModal.openModal();
  }

  delete(id: any) {
    this.deleteSedeModal.openModal(id);
  }

  update(id: any) {
    this.sedeFormModal.openModal(id);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
