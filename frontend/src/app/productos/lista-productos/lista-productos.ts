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
  //styleUrl: './lista-productos.css'
})

export class ListaProductosComponent implements OnInit {
  // Propiedades para manejar los estados
  public productos: Producto[] = [];
  public isLoading = true; // Inicia en true para mostrar el spinner al cargar
  public error: string | null = null;

  // Paginación (ejemplo)
  private page = 0;
  private size = 10;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.error = null;

    this.productoService.getProductos(this.page, this.size)
      .pipe(
        finalize(() => this.isLoading = false) // Se ejecuta siempre, al final
      )
      .subscribe({
        next: (data) => {
          this.productos = data.content; 
        },
        error: (err) => {
          this.error = 'No se pudieron cargar los productos. Inténtalo de nuevo más tarde.';
          console.error(err);
        }
      });
  }
}
