import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-eliminarjuego',
  templateUrl: './eliminarjuego.page.html',
  styleUrls: ['./eliminarjuego.page.scss'],
})
export class EliminarjuegoPage implements OnInit {

  constructor(
    private alertasService: AlertasService, // Inyección del servicio de alertas
    private router: Router
  ) { }

  ngOnInit() { }

  async eliminarJuego() {
    // Aquí puedes realizar la lógica para eliminar el videojuego

    // Muestra la alerta utilizando el servicio
    await this.alertasService.presentAlert('Producto Eliminado', 'El videojuego ha sido eliminado exitosamente.');

    // Redirige después de que el usuario haya cerrado la alerta
    this.router.navigate(['/crudjuegos']);
  }
}
