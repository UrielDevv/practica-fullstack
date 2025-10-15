import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../producto';


@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css']
})

export class FormularioProductoComponent {
  public productoForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly productoService: ProductoService) {
    // Definimos la estructura y las reglas del formulario
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      categoria: ['', [Validators.required, Validators.minLength(3)]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      existencias: [null, [Validators.required, Validators.min(0)]],
      activo: ['', Validators.required],
      razon: ['', Validators.minLength(5)]
    });
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched(); // Marca todos los campos como "tocados" para mostrar errores
      return;
    }
    this.productoService.crearProducto(this.productoForm.value).subscribe({
      next: response => {
        console.log('Producto creado:', response);
        alert('Producto creado exitosamente.');
      },
      error: error => {
        console.error('Error al crear producto:', error);
        alert('Error al crear el producto. Inténtalo de nuevo más tarde.');
      }
    });
  }

  get f() {
    return this.productoForm.controls;
  }
}
