import { Component,PLATFORM_ID,inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {}

  // Este método se ejecuta cuando se envía el formulario
  onLogin(): void {
  if (this.email === 'test@correo.com' && this.password === '123456') {
    if (isPlatformBrowser(this.platformId)) {
      console.log('LOGIN: Guardando isLoggedIn en sessionStorage...');
      sessionStorage.setItem('isLoggedIn', 'true');
    }
    console.log('LOGIN: Intentando navegar a /dashboard');
    this.router.navigate(['/dashboard']);
  } else {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('isLoggedIn');
    }
    alert('Error: Correo o contraseña incorrectos.');
  }
  }
}