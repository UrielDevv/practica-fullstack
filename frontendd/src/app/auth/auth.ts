import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject mantiene el estado actual de la autenticación
  private loggedIn = new BehaviorSubject<boolean>(false);
  
  // Exponemos el estado como un Observable para que otros componentes lo puedan "escuchar"
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor() {}

  // Lógica de login SIMULADA
  login(credentials: { email: string; password: string }): boolean {
    // En una app real, aquí llamarías a tu API de backend
    const isSuccess =
      credentials.email === 'test@correo.com' && credentials.password === '123456';

    if (isSuccess) {
      this.loggedIn.next(true); // Actualiza el estado a "autenticado"
    }
    return isSuccess;
  }

  logout(): void {
    this.loggedIn.next(false); // Actualiza el estado a "no autenticado"
  }
}