import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './auth/auth-guard'; // El guardián que protege las rutas

import { ListaProductosComponent } from './productos/lista-productos/lista-productos';
import { FormularioProductoComponent } from './productos/formulario/formulario';

export const routes: Routes = [
  
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '', 
        component: ListaProductosComponent
      },
      {
        path: 'productos/:id/editar', 
        component: FormularioProductoComponent
      }
    ]
  },

  {
    path: '', 
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**', 
    redirectTo: '/dashboard'
  }
];