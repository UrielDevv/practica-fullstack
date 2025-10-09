import { Component, PLATFORM_ID,inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  // styleUrls: ['./dashboard.component.css'] // Opcional, para estilos
})
export class DashboardComponent {
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {}

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('isLoggedIn'); // Elimina el estado de inicio de sesión
    }
    this.router.navigate(['/login']);
  }
}