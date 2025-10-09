import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto } from '../producto';

@Component({
  selector: 'app-detalle-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './detalle-productos.html',
  styleUrl: './detalle-productos.css'
})
export class DetalleProductos {
    public detalleForm: FormGroup;

    public productos : Producto[] = [];

  constructor(private fb: FormBuilder, private productoService: ProductoService) { 
    this.detalleForm = this.fb.group({
      id: ['', Validators.required],
      nombre: [{ value: '', disabled: true }],
      marca: [{ value: '', disabled: true }],
      precio: [{ value: '', disabled: true }],
      existencias: [{ value: '', disabled: true }],
      razon: [{ value: '', disabled: true }],
      categoria: [{ value: '', disabled: true }],
      activo: [{ value: '', disabled: true }]
    });
  }

  buscarproductodetalle() {
    if (this.detalleForm.valid) {
      const productoId = this.detalleForm.get('id')?.value;
      this.productoService.getProductoById(productoId).subscribe(
        productos => {
          if (productos) {
            this.detalleForm.patchValue({
              id: productos.id,
              nombre: productos.nombre,
              marca: productos.marca,
              precio: productos.precio,
              existencias: productos.existencias,
              razon: productos.razon,
              categoria: productos.categoria,
              activo: productos.activo
            });
          }
        }
      );

      console.log('Buscar producto con ID:', productoId);
    }
  }

  get f() {
    return this.detalleForm.controls;
  }

}
