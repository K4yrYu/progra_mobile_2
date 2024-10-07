import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta
import { ManejodbService } from 'src/app/services/manejodb.service';

@Component({
  selector: 'app-juegounico',
  templateUrl: './juegounico.page.html',
  styleUrls: ['./juegounico.page.scss'],
})
export class JuegounicoPage implements OnInit {
  arregloJuegoUnico: any = [
    {
      id_producto: '',
      nombre_prod: '',
      precio_prod: '',
      stock_prod:  '',
      descripcion_prod: '',  
      foto_prod: '',
      estatus: '',
      id_categoria: '', 
      nombre_categoria: ''
    }
  ]


  constructor(private alertasService: AlertasService, private route: ActivatedRoute, private bd: ManejodbService) { } // Inyección del servicio de alertas


  
  //arreglar pork no se ve el juego unico
  ngOnInit() {
    // verificar si la BD está disponible
    this.bd.dbState().subscribe(data => {
      if (data) {
        // subscribir al observable de la consulta
        this.bd.fetchJuegos().subscribe(res => {
          this.arregloJuegoUnico = res;
        });
      }
    });
  }

  compra() {
    this.alertasService.presentAlert('Añadido al carro', '¡Gracias!'); // Uso del servicio para mostrar la alerta
  }

  listadeseos() {
    this.alertasService.presentAlert('Añadido a Lista de Deseos', '¡Gracias!'); // Uso del servicio para mostrar la alerta
  }
}
