import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService, Producto } from '../producto';


@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css']
})

export class FormularioProductoComponent implements OnInit {
  public productoForm: FormGroup;

  constructor(private fb: FormBuilder, private productoService: ProductoService) {
    // Definimos la estructura y las reglas del formulario
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      categoria: ['', [Validators.required, Validators.minLength(3)]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      existencias: [null, [Validators.required, Validators.min(0)]],
      activo: ['', Validators.required],
      razon: ['']
    });
  }

  ngOnInit(): void {
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched(); // Marca todos los campos como "tocados" para mostrar errores
      return;
    }
    this.productoService.crearProducto(this.productoForm.value).subscribe(
      response => {
        console.log('Producto creado:', response);
        alert('Producto creado exitosamente.');
      },
      error => {
        console.error('Error al crear producto:', error);
        alert('Error al crear el producto. Inténtalo de nuevo más tarde.');
      }
    );
  }
/*
  editarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.productoService.editarProducto(this.productoForm.value).subscribe(
      response => {
        console.log('Producto editado:', response);
        alert('Producto editado exitosamente.');
      },
      error => {
        console.error('Error al editar producto:', error);
        alert('Error al editar el producto. Inténtalo de nuevo más tarde.');
      }
    );
  }*/

  get f() {
    return this.productoForm.controls;
  }
}
