import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.html'
})
export class LoginComponent {
  // Propiedades para vincular con los campos del formulario
  email = '';
  password = '';

  constructor() {}

  // Este método se ejecuta cuando se envía el formulario
  onLogin(): void {
    // Lógica de simulación: Comparamos con valores fijos
    if (this.email === 'test@correo.com' && this.password === '123456') {
      alert('¡Inicio de sesión exitoso!');
      // Aquí, en una app real, redirigirías al usuario a otra página.
    } else {
      alert('Error: Correo o contraseña incorrectos.');
    }
  }
}