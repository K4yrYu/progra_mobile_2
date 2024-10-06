import { Component, OnInit } from '@angular/core';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-consolas',
  templateUrl: './consolas.page.html',
  styleUrls: ['./consolas.page.scss'],
})
export class ConsolasPage implements OnInit {

  constructor(private alertasService: AlertasService) { } // Inyección del servicio de alertas

  ngOnInit() {
  }

  compra() {
    this.alertasService.presentAlert('Añadido al carro', '¡Gracias!'); // Uso del servicio para mostrar la alerta
  }
}
