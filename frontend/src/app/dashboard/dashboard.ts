import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  // styleUrls: ['./dashboard.component.css'] // Opcional, para estilos
})
export class DashboardComponent {
  constructor(private router: Router) {}

  logout(): void {
    // En una app real, llamarías a un authService.logout()
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}