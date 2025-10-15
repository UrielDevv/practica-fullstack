import { Component, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule // Necesario para usar *ngIf en el HTML
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] // Enlaza el nuevo CSS
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string | null = null; // Propiedad para el mensaje de error
  platformId = inject(PLATFORM_ID);

  constructor(private readonly router: Router) {}

  onLogin(): void {
    if (this.email === 'test@correo.com' && this.password === '123456') {
      this.errorMessage = null; // Limpia cualquier error previo
      
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem('isLoggedIn', 'true');
      }
      this.router.navigate(['/dashboard']);
      
    } else {
      // En lugar de un alert, asignamos el mensaje de error
      this.errorMessage = 'Error: Correo o contraseña incorrectos.';
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.removeItem('isLoggedIn');
      }
    }
  }
}