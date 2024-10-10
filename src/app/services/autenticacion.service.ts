import { Injectable } from '@angular/core';
import { ManejodbService } from './manejodb.service';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(
    private bd: ManejodbService,
    private router: Router
  ) {
    // Escuchar el evento de cambio de estado de la aplicación
    App.addListener('appStateChange', async (state) => {
      if (!state.isActive) {
        await this.bd.consultarUsuariosPorEstadoConectado(); // Consultar usuarios conectados
        this.cerrarSesion(); // Cerrar sesión cuando la aplicación pasa a segundo plano
      }
    });
  }

  async cerrarSesion() {
    try {
      await this.bd.actualizarEstadoUsuario2(); // Actualiza el estado del usuario en sesión
      await this.bd.cerrarSesion(); // Cambia el estado de userlogged a 0
      this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }
}
