import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService, Producto } from '../producto';


@Component({
  selector: 'app-formulario',
  imports: [],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})

export class FormularioProductoComponent implements OnInit {
  public productoForm: FormGroup;

  constructor(private fb: FormBuilder, private productoService: ProductoService) {
    // Definimos la estructura y las reglas del formulario
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      marca: [''],
      categoria: [''],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      existencias: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    // Lógica para cargar datos si es un formulario de edición
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched(); // Marca todos los campos como "tocados" para mostrar errores
      return;
    }
    console.log('Datos del formulario:', this.productoForm.value);
    // Aquí llamarías al servicio para guardar el producto
    // this.productoService.crearProducto(this.productoForm.value).subscribe(...)
  }

  // Pequeña función de ayuda para acceder a los controles en el HTML
  get f() {
    return this.productoForm.controls;
  }
}
