import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos una interfaz para el objeto Producto para tener un tipado fuerte.
export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  existencias: number;
  activo: boolean;
  razon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // La URL base de tu API de Spring Boot
  private apiUrl = 'http://localhost:8080/productos';

  // Inyectamos HttpClient para poder hacer las peticiones HTTP
  constructor(private http: HttpClient) { }

  /**
   * Obtiene una lista paginada de productos.
   */
  getProductos(filtros: any, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value != null && value !== '') {
        params = params.append(key, value);
      }
    });
    return this.http.get<any>(this.apiUrl, { params });
  }

  getProducto(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * Obtiene un producto por su ID.
   */
  getProductoById(id: number): Observable<Producto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Producto>(url);
  }

  /**
   * Crea un nuevo producto.
   */
  crearProducto(producto: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  /**
   * Actualiza un producto existente.
   */
  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Producto>(url, producto);
  }

  /**
   * Activa o desactiva un producto.
   */
  activarDesactivar(id: number, activar: boolean): Observable<Producto> {
    const url = `${this.apiUrl}/${id}/activar`;
    const params = new HttpParams().set('activar', activar);
    return this.http.patch<Producto>(url, null, { params });
  }

  /**
   * Ajusta el inventario de un producto.
   */
  ajustarInventario(id: number, cantidad: number, razon: string): Observable<Producto> {
    const url = `${this.apiUrl}/${id}/ajustar`;
    const body = { cantidad, razon };
    return this.http.post<Producto>(url, body);
  }

  //Eliminar producto por ID
  eliminarProducto(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  //Eliminar varios productos por IDs
    eliminarProductos(ids: number[]): Observable<void> {
        const url = `${this.apiUrl}/batch-delete`;
        return this.http.post<void>(url, ids);
    }

    //Activar o desactivar varios productos por IDs
    activarDesactivarProductos(ids: number[], activar: boolean): Observable<void> {
        const url = `${this.apiUrl}/batch-activate`;
        const params = new HttpParams().set('activar', activar);
        return this.http.post<void>(url, ids, { params });
    }


}