import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-eliminarconsola',
  templateUrl: './eliminarconsola.page.html',
  styleUrls: ['./eliminarconsola.page.scss'],
})
export class EliminarconsolaPage implements OnInit {

  constructor(
    private alertasService: AlertasService, // Inyección del servicio
    private router: Router
  ) { }

  ngOnInit() { }

  async eliminarConsola() {
    // Aquí puedes realizar la lógica para eliminar la consola

    // Luego, muestra la alerta
    await this.alertasService.presentAlert('Producto Eliminado', 'La consola ha sido eliminada exitosamente.');

    // Redirige después de que el usuario haya cerrado la alerta
    this.router.navigate(['/crudconsolas']);
  }
}
