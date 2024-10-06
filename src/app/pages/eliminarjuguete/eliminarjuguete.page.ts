import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-eliminarjuguete',
  templateUrl: './eliminarjuguete.page.html',
  styleUrls: ['./eliminarjuguete.page.scss'],
})
export class EliminarjuguetePage implements OnInit {

  constructor(
    private alertasService: AlertasService, // Inyección del servicio de alertas
    private router: Router
  ) { }

  ngOnInit() { }

  async eliminarJuguete() {
    // Aquí puedes realizar la lógica para eliminar el juguete

    // Muestra la alerta utilizando el servicio
    await this.alertasService.presentAlert('Producto Eliminado', 'El juguete ha sido eliminado exitosamente.');

    // Redirige después de que el usuario haya cerrado la alerta
    this.router.navigate(['/crudjuguetes']);
  }
}
