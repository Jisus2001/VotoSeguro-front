import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoutComponent } from './shared/logout/logout.component';
import { VotantesIndexComponent } from './votantes/votantes-index/votantes-index.component';
import { NgModule } from '@angular/core';
import { EleccionesIndexComponent } from './elecciones/elecciones-index/elecciones-index.component';
import { SedesIndexComponent } from './sedes/sedes-index/sedes-index.component';
import { CandidatosIndexComponent } from './candidatos/candidatos-index/candidatos-index.component';
import { PerfilesIndexComponent } from './perfiles/perfiles-index/perfiles-index.component';
import { CandidatosEleccionesComponent } from './candidatos/candidatos-elecciones/candidatos-elecciones.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { EleccionesParticipacionComponent } from './elecciones/elecciones-participacion/elecciones-participacion.component';
import { AyudaComponent } from './ayuda/ayuda/ayuda.component';
import { AuthGuard, PersonasRoleGuard } from './services/personas.guard';

const ROL_ADMIN = 'Administrador';
const ROL_VOTANTE = 'Votante';

export const routes: Routes = [
  // Página inicial: login
  { path: '', component: LoginComponent},

  // Dashboard con rutas hijas
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { rol: [ROL_ADMIN, ROL_VOTANTE] },
  },

  //Votantes
  {
    path: 'votantes',
    component: VotantesIndexComponent,
    canActivate: [AuthGuard],
    data: { rol: [ROL_ADMIN] },
  },

  {
    path: 'elecciones',
    component: EleccionesIndexComponent,
    canActivate: [AuthGuard],
    data: { rol: [ROL_ADMIN] },
  },

  {
    path: 'sedes',
    component: SedesIndexComponent,
    canActivate: [AuthGuard],
    data: { rol: [ROL_ADMIN] },
  },
  {
    path: 'candidatos',
    component: CandidatosIndexComponent,
    canActivate: [AuthGuard],
    data: { rol: [ROL_ADMIN] },
  },
  {
    path: 'perfiles',
    component: PerfilesIndexComponent,
    canActivate: [AuthGuard],
    data: { rol: [ROL_ADMIN] },
  },
  {
    path: 'vigentes',
    component: CandidatosEleccionesComponent,
    canActivate: [AuthGuard],
    data: { rol: [ROL_VOTANTE] },
  },
  {
    path: 'reporte',
    component: EleccionesParticipacionComponent,
    canActivate: [AuthGuard],
    data: { rol: [ROL_ADMIN] },
  },
  {
    path: 'ayuda',
    component: AyudaComponent,
    canActivate: [AuthGuard],
    data: { rol: [ROL_ADMIN, ROL_VOTANTE] },
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
