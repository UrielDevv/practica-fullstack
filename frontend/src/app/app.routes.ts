import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { ListaProductos } from './productos/lista-productos/lista-productos';
import { DetalleProductos } from './productos/detalle-productos/detalle-productos';
import { Formulario } from './productos/formulario/formulario';
import { AjusteInventario } from './productos/ajuste-inventario/ajuste-inventario';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // Redirige a /login si la URL está vacía

  // Rutas para la gestión de productos
  { path: 'productos', component: ListaProductos  }, // Muestra la lista de productos
  { path: 'productos/new', component: Formulario }, // Muestra el formulario para crear un producto
  { path: 'productos/:id', component: DetalleProductos }, // Muestra el detalle de un producto específico
  { path: 'productos/:id/edit', component: Formulario }, // Reutiliza el formulario para editar
  { path: 'productos/:id/adjust-stock', component: AjusteInventario }, // Para ajustar inventario
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/productos' }
];