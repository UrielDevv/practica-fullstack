import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService, Producto } from '../producto';


@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
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
        // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
      },
      error => {
        console.error('Error al crear producto:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    );
  }



  
  get f() {
    return this.productoForm.controls;
  }
}
