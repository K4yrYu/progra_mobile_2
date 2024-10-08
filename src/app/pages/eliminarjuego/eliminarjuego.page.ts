import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManejodbService } from 'src/app/services/manejodb.service';

@Component({
  selector: 'app-eliminarjuego',
  templateUrl: './eliminarjuego.page.html',
  styleUrls: ['./eliminarjuego.page.scss'],
})
export class EliminarjuegoPage implements OnInit {

  juegoLlego: any;

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
    }
  ]

  constructor(private bd: ManejodbService, private router: Router, private activedroute: ActivatedRoute) {
    this.activedroute.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.juegoLlego = this.router.getCurrentNavigation()?.extras?.state?.['juegoSelect'];
      }
    })
   }

  //arreglar pork no se ve el juego unico
  ngOnInit() {
    // verificar si la BD está disponible
    this.bd.dbState().subscribe(data => {
      if (data) {
        // subscribir al observable de la consulta
        this.bd.fetchJuegoUnico().subscribe(res => {
          this.arregloJuegoUnico = res;
          this.bd.consultarJuegoPorId(this.juegoLlego.id_producto);
        });
      }
    });
  }

  async eliminarJuego() {
    // Aquí puedes realizar la lógica para eliminar el videojuego

    await this.bd.eliminarJuegos(this.juegoLlego.id_producto);

    // Redirige después de que el usuario haya cerrado la alerta
    await this.router.navigate(['/crudjuegos']);
  }
}
