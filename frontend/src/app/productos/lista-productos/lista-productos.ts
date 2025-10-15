import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Producto, ProductoService } from '../producto';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './lista-productos.html',
  styleUrls: ['./lista-productos.css']
})
export class ListaProductosComponent implements OnInit {
  // Estado de la UI
  productos: Producto[] = [];
  isLoading = true;
  error: string | null = null;
  mostrarFormularioAgregar = false;
  mostrarFormularioFiltros = false;
  filtroActivo = false;

  // Formularios
  agregarForm: FormGroup;
  filtroForm: FormGroup;
  editForm: FormGroup;
  editingId: number | null = null;

  // Paginación y Selección
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  selectedProductIds = new Set<number>();

  constructor(
    private readonly productoService: ProductoService,
    private readonly fb: FormBuilder,
  ) {
    this.filtroForm = this.fb.group({ nombre: [''], marca: [''], categoria: [''] });
    this.agregarForm = this.fb.group({
      nombre: ['', Validators.required], marca: [''], categoria: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      existencias: [0, [Validators.required, Validators.min(0)]],
      activo: [true, Validators.required]
    });
    this.editForm = this.fb.group({
      nombre: ['', Validators.required], marca: [''], categoria: [''],
      precio: [0, Validators.required], existencias: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  // --- Métodos Principales ---
  cargarProductos(): void {
    this.isLoading = true; this.error = null;
    this.productoService.getProductos(this.filtroForm.value, this.currentPage, this.pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => { this.productos = data.content; this.totalPages = data.totalPages; },
        error: (err) => this.error = 'No se pudieron cargar los productos.'
      });
  }

  aplicarFiltros(): void {
    this.currentPage = 0; this.filtroActivo = true;
    this.cargarProductos();
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({ nombre: '', marca: '', categoria: '' });
    this.filtroActivo = false; this.currentPage = 0;
    this.cargarProductos();
  }

  guardarProducto(): void {
    if (this.agregarForm.invalid) return;
    this.productoService.crearProducto(this.agregarForm.value).subscribe(() => {
      alert('Producto guardado'); this.agregarForm.reset({ activo: true });
      this.mostrarFormularioAgregar = false; this.cargarProductos();
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe(() => this.cargarProductos());
    }
  }

  toggleActivo(producto: Producto): void {
    const nuevoEstado = !producto.activo;
    this.productoService.activarDesactivar(producto.id, nuevoEstado).subscribe(() => {
      producto.activo = nuevoEstado; // Actualización local
    });
  }

  // --- Edición Inline ---
  iniciarEdicion(producto: Producto): void {
    this.editingId = producto.id;
    this.editForm.setValue({
      nombre: producto.nombre, marca: producto.marca, categoria: producto.categoria,
      precio: producto.precio, existencias: producto.existencias
    });
  }

  cancelarEdicion(): void {
    this.editingId = null;
  }

  guardarEdicion(producto: Producto): void {
    if (this.editForm.invalid) return;
    const datosActualizados = { ...producto, ...this.editForm.value };
    this.productoService.actualizarProducto(producto.id, datosActualizados).subscribe(pActualizado => {
      const index = this.productos.findIndex(p => p.id === producto.id);
      this.productos[index] = pActualizado;
      this.editingId = null;
    });
  }

  // --- Paginación ---
  paginaSiguiente(): void { this.currentPage++; this.cargarProductos(); }
  paginaAnterior(): void { this.currentPage--; this.cargarProductos(); }
  
  // --- Formularios Desplegables ---
  toggleFormularioAgregar() { this.mostrarFormularioAgregar = !this.mostrarFormularioAgregar; if (this.mostrarFormularioAgregar) this.mostrarFormularioFiltros = false; }
  toggleFormularioFiltros() { this.mostrarFormularioFiltros = !this.mostrarFormularioFiltros; if (this.mostrarFormularioFiltros) this.mostrarFormularioAgregar = false; }

  // --- Selección y Acciones Masivas ---
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.selectedProductIds.clear();
    if (checked) {
      this.productos.forEach(p => this.selectedProductIds.add(p.id));
    }
  }

  get isAllSelected(): boolean {
    return this.productos.length > 0 && this.selectedProductIds.size === this.productos.length;
  }

  toggleSelectProduct(id: number, event: any): void {
    if (event.target.checked) this.selectedProductIds.add(id);
    else this.selectedProductIds.delete(id);
  }

  eliminarSeleccionados(): void {
     if (confirm(`¿Seguro que quieres eliminar los ${this.selectedProductIds.size} productos seleccionados?`)) {
        const ids = Array.from(this.selectedProductIds);
        this.productoService.eliminarProductos(ids).subscribe(() => this.cargarProductos());
     }
  }
  
  activarDesactivarSeleccionados(activar: boolean): void {
    const ids = Array.from(this.selectedProductIds);
    this.productoService.activarDesactivarProductos(ids, activar).subscribe(() => this.cargarProductos());
  }
}