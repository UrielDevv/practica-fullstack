import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.login';
import { DashboardComponent } from './dashboard/dashboard.login';
import { authGuard } from './auth/auth.auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] // <-- Aquí protegemos la ruta
  },
  // Redirige al dashboard si ya está logueado, o al login si no
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' } // Ruta comodín
];