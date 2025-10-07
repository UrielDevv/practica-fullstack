import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.auth'; // Lo crearemos a continuación

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.css'] // Puedes agregar estilos aquí
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    const isAuthenticated = this.authService.login(this.credentials);

    if (isAuthenticated) {
      // Si el login es exitoso, redirige a una página principal (ej. /dashboard)
      this.router.navigate(['/dashboard']);
    } else {
      // Si falla, muestra un mensaje de error
      this.errorMessage = 'Correo o contraseña incorrectos.';
    }
  }
}