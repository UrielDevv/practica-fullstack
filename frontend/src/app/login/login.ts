import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  // Propiedades para vincular con los campos del formulario
  email = '';
  password = '';

  constructor(private router: Router) {}

  // Este método se ejecuta cuando se envía el formulario
  onLogin(): void {
    // Lógica de simulación: Comparamos con valores fijos
    if (this.email === 'test@correo.com' && this.password === '123456') {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Error: Correo o contraseña incorrectos.');
    }
  }
}