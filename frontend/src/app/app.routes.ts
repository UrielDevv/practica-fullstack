import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './auth/auth-guard';

import { ListaProductosComponent } from './productos/lista-productos/lista-productos';
import { DetalleProductos } from './productos/detalle-productos/detalle-productos';
import { FormularioProductoComponent } from './productos/formulario/formulario';
import { AjusteInventario } from './productos/ajuste-inventario/ajuste-inventario';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard],
    children: [
      { path: 'productos', component: ListaProductosComponent  }, // Muestra la lista de productos
      { path: 'productos/crearProducto', component: FormularioProductoComponent}, // Muestra el formulario para crear un producto
      { path: 'productos/:id', component: DetalleProductos }, // Muestra el detalle de un producto específico
      { path: 'productos/:id/editar', component: FormularioProductoComponent }, // Reutiliza el formulario para editar
      { path: 'productos/:id/ajuste-inventario', component: AjusteInventario }, // Para ajustar inventario
      { path: 'productos/actualizar-productos', component: FormularioProductoComponent }, // Para actualizar producto
      
    ]
  },
  {path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {path: '**', redirectTo: '/dashboard'}
];