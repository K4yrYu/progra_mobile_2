import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta
import { ManejodbService } from 'src/app/services/manejodb.service';

@Component({
  selector: 'app-consolaunica',
  templateUrl: './consolaunica.page.html',
  styleUrls: ['./consolaunica.page.scss'],
})
export class ConsolaunicaPage implements OnInit {

  consolaLlego: any;

  arregloConsolaUnico: any = [
    {
      id_producto: '',
      nombre_prod: '',
      precio_prod: '',
      stock_prod:  '',
      descripcion_prod: '',  
      foto_prod: '',
      estatus: '',
      id_categoria: '',
    }
  ]



  constructor(private bd: ManejodbService, private router: Router, private activedroute: ActivatedRoute, private alertasService: AlertasService) {
    this.activedroute.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.consolaLlego = this.router.getCurrentNavigation()?.extras?.state?.['consolaSelect'];
      }
    })
   }

  
  //arreglar pork no se ve el juego unico
  ngOnInit() {
    // verificar si la BD está disponible
    this.bd.dbState().subscribe(data => {
      if (data) {
        // subscribir al observable de la consulta
        this.bd.fetchConsolaUnico().subscribe(res => {
          this.arregloConsolaUnico = res;
          this.bd.consultarJuguetePorId(this.consolaLlego.id_producto);
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
