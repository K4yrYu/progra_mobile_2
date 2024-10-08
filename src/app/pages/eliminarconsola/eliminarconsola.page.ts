import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta
import { ManejodbService } from 'src/app/services/manejodb.service';

@Component({
  selector: 'app-eliminarconsola',
  templateUrl: './eliminarconsola.page.html',
  styleUrls: ['./eliminarconsola.page.scss'],
})
export class EliminarconsolaPage implements OnInit {

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

  constructor(private bd: ManejodbService, private router: Router, private activedroute: ActivatedRoute) {
    this.activedroute.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.consolaLlego = this.router.getCurrentNavigation()?.extras?.state?.['consolaSelect'];
      }
    })
   }

  ngOnInit() {
    // verificar si la BD está disponible
    this.bd.dbState().subscribe(data => {
      if (data) {
        // subscribir al observable de la consulta
        this.bd.fetchConsolaUnico().subscribe(res => {
          this.arregloConsolaUnico = res;
          this.bd.consultarConsolaPorId(this.consolaLlego.id_producto);
        });
      }
    });
  }

  async eliminarConsola() {
    // Aquí puedes realizar la lógica para eliminar el videojuego

    await this.bd.eliminarConsola(this.consolaLlego.id_producto);

    // Redirige después de que el usuario haya cerrado la alerta
    await this.router.navigate(['/crudconsolas']);
  }
}
