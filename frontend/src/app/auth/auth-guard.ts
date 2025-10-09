import { inject, PLATFORM_ID } from '@angular/core'; // <-- Importa PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // <-- Importa isPlatformBrowser
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID); // <-- Obtiene el identificador de la plataforma

  console.log('AuthGuard: Verificando si el usuario está autenticado...');

  // Solo ejecuta el código de sessionStorage si estamos en un navegador
  if (isPlatformBrowser(platformId)) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    console.log('Guard: isLoggedIn =', isLoggedIn);

    if (isLoggedIn === 'true') {
      console.log('AuthGuard: Usuario autenticado');
      return true; // Si ha iniciado sesión, permite el acceso
    }
  }

  // Si no estamos en el navegador o no ha iniciado sesión, redirige al login
  console.log('AuthGuard: Usuario no autenticado, redirigiendo a /login');
  return router.createUrlTree(['/login']);
};