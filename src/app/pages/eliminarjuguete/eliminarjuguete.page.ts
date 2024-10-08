import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManejodbService } from 'src/app/services/manejodb.service';

@Component({
  selector: 'app-eliminarjuguete',
  templateUrl: './eliminarjuguete.page.html',
  styleUrls: ['./eliminarjuguete.page.scss'],
})
export class EliminarjuguetePage implements OnInit {

  jugueteLlego: any;

  arregloJugueteUnico: any = [
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
        this.jugueteLlego = this.router.getCurrentNavigation()?.extras?.state?.['jugueteSelect'];
      }
    })
   }

  //arreglar pork no se ve el juego unico
  ngOnInit() {
    // verificar si la BD está disponible
    this.bd.dbState().subscribe(data => {
      if (data) {
        // subscribir al observable de la consulta
        this.bd.fetchJuguetesUnico().subscribe(res => {
          this.arregloJugueteUnico = res;
          this.bd.consultarJuguetePorId(this.jugueteLlego.id_producto);
        });
      }
    });
  }

  async eliminarJuguete() {
    // Aquí puedes realizar la lógica para eliminar el videojuego

    await this.bd.eliminarJuguete(this.jugueteLlego.id_producto);

    // Redirige después de que el usuario haya cerrado la alerta
    await this.router.navigate(['/crudjuguetes']);
  }
}
