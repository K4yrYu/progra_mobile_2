import { Component, OnInit } from '@angular/core';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  constructor(private alertasService: AlertasService) { } // Inyección del servicio de alertas

  ngOnInit() {
  }

  alertascarro() {
    this.alertasService.presentAlert('Gracias Por Su Compra', ''); // Uso del servicio para mostrar la alerta
  }
}
