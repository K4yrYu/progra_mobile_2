import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta
import { ManejodbService } from 'src/app/services/manejodb.service';

@Component({
  selector: 'app-juguetes',
  templateUrl: './juguetes.page.html',
  styleUrls: ['./juguetes.page.scss'],
})
export class JuguetesPage implements OnInit {

  jugueteSelect: any;

   //repetir pero cambiar a juguetes y consolas
   arregloJuguetes: any = [
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


  constructor(private alertasService: AlertasService, private bd: ManejodbService, private router: Router) { } // Inyección del servicio de alertas

  ngOnInit() {
    
    // verificar si la BD está disponible
    this.bd.dbState().subscribe(data => {
      if (data) {
        // subscribir al observable de la consulta
        this.bd.fetchJuguetes().subscribe(res => {
          this.arregloJuguetes = res;
        });
      }
    });
  }

  irJugueteUnico(x:any){
    let navigationExtras: NavigationExtras = {
      state: {
        jugueteSelect: x
      }
    }
    this.router.navigate(['/jugueteunico'], navigationExtras);

  }

  compra() {
    this.alertasService.presentAlert('Añadido al carro', '¡Gracias!'); // Uso del servicio para mostrar la alerta
  }
}
