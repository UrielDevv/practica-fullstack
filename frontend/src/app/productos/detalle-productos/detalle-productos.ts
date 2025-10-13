import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto } from '../producto';

@Component({
  selector: 'app-detalle-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './detalle-productos.html',
  styleUrls: ['./detalle-productos.css']
})
export class DetalleProductos {
    public searchForm: FormGroup;
    public productosEncontrados: Producto[] = [];
    public selectedProductIds = new Set<number>();

  constructor(private fb: FormBuilder, private productoService: ProductoService) { 
    this.searchForm = this.fb.group({
      id: [''],
      nombre: [''],
      marca: [''],
      precio: [''],
      existencias: [''],
      razon: [''],
      categoria: [''],
      activo: ['']
    });
  }

  buscarProductos() {
    const filtros = this.searchForm.value;
    // Usamos el método de la lista, pero sin paginación para simplicidad
    // En una app real, aquí también paginarías los resultados.
    this.productoService.getProductos(filtros, 0, 100).subscribe(response => {
      this.productosEncontrados = response.content;
      this.selectedProductIds.clear(); // Limpia la selección anterior
    });
  }

  // --- Lógica de Selección ---
  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.selectedProductIds.clear();
    if (checked) {
      this.productosEncontrados.forEach(p => this.selectedProductIds.add(p.id));
    }
  }

  toggleSelectProduct(id: number, event: any) {
    if (event.target.checked) {
      this.selectedProductIds.add(id);
    } else {
      this.selectedProductIds.delete(id);
    }
  }

  // --- Lógica de Acciones Masivas ---
  eliminarSeleccionados() {
    if (this.selectedProductIds.size === 0) return;
    const ids = Array.from(this.selectedProductIds);
    this.productoService.eliminarProductos(ids).subscribe(() => {
      alert('Productos eliminados');
      this.buscarProductos(); // Refresca la lista
    });
  }

  activarDesactivarSeleccionados(activar: boolean) {
    if (this.selectedProductIds.size === 0) return;
    const ids = Array.from(this.selectedProductIds);
    this.productoService.activarDesactivarProductos(ids, activar).subscribe(() => {
      alert(`Productos ${activar ? 'activados' : 'desactivados'}`);
      this.buscarProductos(); // Refresca la lista
    });
  }

  get f() {
    return this.searchForm.controls;
  }

}
