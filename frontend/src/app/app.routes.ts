import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { ListaProductosComponent } from './productos/lista-productos/lista-productos';
import { DetalleProductos } from './productos/detalle-productos/detalle-productos';
import { FormularioProductoComponent } from './productos/formulario/formulario';
import { AjusteInventario } from './productos/ajuste-inventario/ajuste-inventario';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // Redirige a /login si la URL está vacía

  // Rutas para la gestión de productos
  { path: 'productos', component: ListaProductosComponent  }, // Muestra la lista de productos
  { path: 'productos/new', component: FormularioProductoComponent}, // Muestra el formulario para crear un producto
  { path: 'productos/:id', component: DetalleProductos }, // Muestra el detalle de un producto específico
  { path: 'productos/:id/edit', component: FormularioProductoComponent }, // Reutiliza el formulario para editar
  { path: 'productos/:id/adjust-stock', component: AjusteInventario }, // Para ajustar inventario
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/productos' }
];