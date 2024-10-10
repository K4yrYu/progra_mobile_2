import { Injectable } from '@angular/core';
import { ManejodbService } from './manejodb.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(
    private bd: ManejodbService,
    private router: Router
  ) { }

  async cerrarSesion() {
    await this.bd.cerrarSesion();
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }
}
