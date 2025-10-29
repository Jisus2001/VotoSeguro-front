import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OlvidarPassComponent } from './auth/olvidar-pass/olvidar-pass.component';
import { LogoutComponent } from './shared/logout/logout.component';
import { VotantesIndexComponent } from './votantes/votantes-index/votantes-index.component';
import { NgModule } from '@angular/core';
import { EleccionesIndexComponent } from './elecciones/elecciones-index/elecciones-index.component';
import { SedesIndexComponent } from './sedes/sedes-index/sedes-index.component';
import { CandidatosIndexComponent } from './candidatos/candidatos-index/candidatos-index.component';
import { PerfilesIndexComponent } from './perfiles/perfiles-index/perfiles-index.component';
import { CandidatosEleccionesComponent } from './candidatos/candidatos-elecciones/candidatos-elecciones.component';

export const routes: Routes = [
  // Página inicial: login
  { path: '', component: LoginComponent },
  {
    path: 'olvidar',
    component: OlvidarPassComponent,
  },

  // Dashboard con rutas hijas
  {
    path: 'dashboard',
    component: DashboardComponent,
  },

  //Votantes
  {
    path: 'votantes',
    component: VotantesIndexComponent,
  },

  {
    path: 'elecciones',
    component: EleccionesIndexComponent,
  },

  {
    path: 'sedes',
    component: SedesIndexComponent,
  },
  {
    path: 'candidatos',
    component: CandidatosIndexComponent,
  },
  {
    path: 'perfiles',
    component: PerfilesIndexComponent,
  },
  {
    path: 'vigentes',
    component: CandidatosEleccionesComponent,
  },
  // Ruta directa al registro (opcional, si quieres permitir acceso fuera del dashboard)
  // { path: 'registro', component: RegistroComponent },

  // Redirección por defecto (opcional si usas guards)
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
