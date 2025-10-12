import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuComponent } from '../../shared/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NotificacionService, TipoMessage } from '../../shared/notification.service';

@Component({
  selector: 'app-candidatos-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './candidatos-detail.component.html',
  styleUrl: './candidatos-detail.component.scss',
})
export class CandidatosDetailComponent implements OnInit{
  isVisible = false;
  idCandidato: any; 
  Nombre: any; // Nombre de la persona
  Partido: any;
  PerfilId: any;

  userForm!: FormGroup;
  userData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  respuesta: any;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
  }

ngOnInit(): void {
  this.reactiveForm();
}

  reactiveForm() {
    this.userForm = this.fb.group({
      idCandidato: [''],
      Nombre: [''],
      Partido: [''],
      PerfilId: [''],
    });
  }

  openModal(nombre: any) {
    this.isVisible = true;
    this.userForm.reset();
    if (nombre) {
      this.loadData(nombre);
    } else {
      // Manejar caso donde se abre el modal sin nombre (aunque el index no lo permite)
      this.noti.mensaje('Error', 'Debe proporcionar un nombre de candidato para ver el detalle.', TipoMessage.error);
      this.closeModal();
    }
  }

  loadData(nombre: any): void {

    this.gService
      .get('candidatos/ObtenerCandidato', nombre)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.userData = data;
        this.userForm.patchValue({
          idCandidato: this.userData._id,
          Nombre: this.userData.Nombre,
          Partido: this.userData.Partido,
          PerfilId: this.userData.Perfil.Descripcion,
        });
      });
  }

  closeModal() {
    this.userForm.reset();
    this.isVisible = false;
  }

  onReset() {
    this.userForm.reset();
  }
}
