import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-candidatos-votaciones',
  standalone: true,
  imports: [],
  templateUrl: './candidatos-votaciones.component.html',
  styleUrl: './candidatos-votaciones.component.scss',
})
export class CandidatosVotacionesComponent {
  isVisible = false;
  idUser: string | null = null;
  idEleccion: string | null = null;
  idCandidato: string | null = null;
  Partido:  string | null = null;

  userData: any;
  respuesta: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  userForm!: FormGroup;

  @Output() candidatoVotanciones: EventEmitter<number> = new EventEmitter<number>();

  openModal(idE: string, idC: string, part: string) {
    this.idUser = window.localStorage.getItem('ID') || 'ID';
    this.idEleccion = idE;
    this.idCandidato = idC;
    this.Partido = part; 

    this.isVisible = true;

    console.log('user', this.idUser);
    console.log('eleccion', this.idEleccion);
    console.log('candid', this.idCandidato);
    console.log('partido', this.Partido)
  }

    // Método para cerrar el modal
  closeModal() {
    this.isVisible = false;
    this.idCandidato = null;
    this.idEleccion = null; 
    this.idUser = null;  
    this.Partido = null; 
  }

  confirmVote(){

  }
}
