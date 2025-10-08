import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardVotanteComponent } from './dashboard/dashboardVotante/dashboardvotante.component';
import { OlvidarPassComponent } from './auth/olvidar-pass/olvidar-pass.component';
import { LogoutComponent } from './shared/logout/logout.component';
import { VotantesIndexComponent } from './votantes/votantes-index/votantes-index.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  // Página inicial: login
  { path: '', component: LoginComponent },
  { 
    path: 'olvidar', component: OlvidarPassComponent 
  },

  // Dashboard con rutas hijas
  {
    path: 'dashboard',
    component: DashboardComponent,
  },

  {
    path: 'dashboardvotante', component: DashboardVotanteComponent,
  },

  //Votantes
  { 
    path: 'votantes', component: VotantesIndexComponent,
    
  },


  // Ruta directa al registro (opcional, si quieres permitir acceso fuera del dashboard)
  // { path: 'registro', component: RegistroComponent },

  // Redirección por defecto (opcional si usas guards)
  { 
    path: 'logout', component: LogoutComponent 
  },
  { 
    path: '**', redirectTo: '', pathMatch: 'full'
   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
