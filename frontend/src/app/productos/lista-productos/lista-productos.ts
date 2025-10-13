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
  
  // Paginación
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  // Selección
  selectedProductIds = new Set<number>();

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      nombre: [''],
      marca: [''],
      categoria: ['']
    });

    this.agregarForm = this.fb.group({
      nombre: ['', Validators.required],
      marca: [''],
      categoria: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      existencias: [0, [Validators.required, Validators.min(0)]],
      activo: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.error = null;
    const filtros = this.filtroForm.value;

    this.productoService.getProductos(filtros, this.currentPage, this.pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.productos = data.content;
          this.totalPages = data.totalPages;
        },
        error: (err) => this.error = 'No se pudieron cargar los productos.'
      });
  }

  aplicarFiltros(): void {
    this.currentPage = 0;
    this.filtroActivo = true; // Activa la UI de selección
    this.cargarProductos();
  }

  guardarProducto(): void {
    if (this.agregarForm.invalid) return;
    
    this.productoService.crearProducto(this.agregarForm.value).subscribe(() => {
      alert('Producto guardado exitosamente.');
      this.agregarForm.reset({ activo: true }); // Limpia el formulario
      this.mostrarFormularioAgregar = false; // Oculta el formulario
      this.cargarProductos(); // Refresca la lista
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe(() => this.cargarProductos());
    }
  }

  // --- Lógica de Paginación ---
  paginaSiguiente(): void {
    this.currentPage++;
    this.cargarProductos();
  }
  paginaAnterior(): void {
    this.currentPage--;
    this.cargarProductos();
  }
  
  // --- Lógica para mostrar/ocultar formularios ---
  toggleFormularioAgregar() {
    this.mostrarFormularioAgregar = !this.mostrarFormularioAgregar;
    if (this.mostrarFormularioAgregar) this.mostrarFormularioFiltros = false;
  }
  toggleFormularioFiltros() {
    this.mostrarFormularioFiltros = !this.mostrarFormularioFiltros;
    if (this.mostrarFormularioFiltros) this.mostrarFormularioAgregar = false;
  }

  // --- Lógica de Selección y Acciones Masivas ---
  // (Pega aquí los métodos que ya teníamos: toggleSelectAll, toggleSelectProduct, eliminarSeleccionados, etc.)
  toggleSelectAll(event: any) { /*...*/ }
  toggleSelectProduct(id: number, event: any) { /*...*/ }
  eliminarSeleccionados() {
     if (confirm(`¿Estás seguro de eliminar los ${this.selectedProductIds.size} productos seleccionados?`)) {
        const ids = Array.from(this.selectedProductIds);
        this.productoService.eliminarProductos(ids).subscribe(() => this.cargarProductos());
     }
  }


  

  limpiarFiltros(): void {
  this.filtroForm.reset({ nombre: '', marca: '', categoria: '' });
  this.filtroActivo = false;
  this.currentPage = 0;
  this.cargarProductos();
}

toggleActivo(producto: Producto): void {
  const nuevoEstado = !producto.activo;
  this.productoService.activarDesactivar(producto.id, nuevoEstado).subscribe(() => {
    // Actualiza la lista localmente para no recargar todo
    producto.activo = nuevoEstado; 
  });
}

}

