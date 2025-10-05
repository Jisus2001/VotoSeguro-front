import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './votantes/registro/registro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardVotanteComponent } from './dashboard/dashboardVotante/dashboardvotante.component';
import { OlvidarPassComponent } from './auth/olvidar-pass/olvidar-pass.component';

export const routes: Routes = [
  // Página inicial: login
  { path: '', component: LoginComponent },
  { path: 'olvidar', component: OlvidarPassComponent},
  // Dashboard con rutas hijas
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [{ path: 'registro', component: RegistroComponent }],
  },

  {
    path: 'dashboardvotante',
    component: DashboardVotanteComponent,
  },

  // Ruta directa al registro (opcional, si quieres permitir acceso fuera del dashboard)
  // { path: 'registro', component: RegistroComponent },

  // Redirección por defecto (opcional si usas guards)
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
