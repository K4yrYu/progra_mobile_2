import { Component, OnInit } from '@angular/core';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-jugueteunico',
  templateUrl: './jugueteunico.page.html',
  styleUrls: ['./jugueteunico.page.scss'],
})
export class JugueteunicoPage implements OnInit {

  constructor(private alertasService: AlertasService) { } // Inyección del servicio de alertas

  ngOnInit() {
  }

  compra() {
    this.alertasService.presentAlert('Añadido al carro', '¡Gracias!'); // Uso del servicio para mostrar la alerta
  }

  listadeseos() {
    this.alertasService.presentAlert('Añadido a Lista de Deseos', '¡Gracias!'); // Uso del servicio para mostrar la alerta
  }
}
