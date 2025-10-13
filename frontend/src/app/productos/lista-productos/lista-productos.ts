import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto,ProductoService } from '../producto';
import { finalize } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-productos.html',
  styleUrls: ['./lista-productos.css']
})

export class ListaProductosComponent implements OnInit {
  // Propiedades para manejar los estados
  public productos: Producto[] = [];
  public isLoading = true; // Inicia en true para mostrar el spinner al cargar
  public error: string | null = null;

  public page = 0;
  public size = 3;
  public totalPaginas = 0;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.error = null;

    this.productoService.getProducto(this.page, this.size)
      .pipe(
        finalize(() => this.isLoading = false) // Se ejecuta siempre, al final
      )
      .subscribe({
        next: (data) => {
          this.productos = data.content;
          this.totalPaginas = data.totalPages;
        },
        error: (err) => {
          this.error = 'No se pudieron cargar los productos. Inténtalo de nuevo más tarde.';
          console.error(err);
        }
      });
  }

  paginaAnterior(): void {
    if (this.page > 0) {
      this.page--;
      this.cargarProductos();
    }
  }

  paginaSiguiente(): void {
    if (this.page < this.totalPaginas - 1) {
      this.page++;
      this.cargarProductos();
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          alert('Producto eliminado exitosamente.');
          this.cargarProductos();
        },
        error: (err) => {
          console.error(err);
          alert('Error al eliminar el producto. Inténtalo de nuevo más tarde.');
        }
      });
    }
  }
  toggleActivo(producto: Producto): void {
    const nuevoEstado = !producto.activo;
    this.productoService.activarDesactivar(producto.id, nuevoEstado).subscribe({
      next: () => {
        alert(`Producto ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente.`);
        this.cargarProductos();
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar el estado del producto. Inténtalo de nuevo más tarde.');
      }
    });
  }
  }
