import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta
import Swiper from 'swiper'; // Muestra más de una tarjeta parcialmente visible esto se instala con un npm install swiper

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  slideOpts = {
    slidesPerView: 1.9, // Muestra más de una tarjeta parcialmente visible
    spaceBetween: 4,   // Espacio entre las tarjetas
    centeredSlides: true,
    loop: true,         // Hace que las tarjetas no se repitan en un bucle
  };
  
  // COLECCIONES DE PRODUCTOS
  // COLECCIÓN DE JUEGOS
  colec_juegos = [
    {
      nomJ: 'Hollow Knight',
      precioJ: '$15.000',
      imgJ: 'assets/img/juegos/caratula-hollow.jpeg'
    },
    {
      nomJ: 'Megaman11',
      precioJ: '$30.000',
      imgJ: 'assets/img/juegos/caratula-megaman11.jpeg'
    },
    {
      nomJ: 'Skyrim',
      precioJ: '$20.000',
      imgJ: 'assets/img/juegos/Skyrim_Cover.jpeg'
    },
    {
      nomJ: 'Lies of pi',
      precioJ: '$40.000',
      imgJ: 'assets/img/juegos/caratula-liesofp.jpeg'
    },
    {
      nomJ: 'Kakarot',
      precioJ: '$50.900',
      imgJ: 'assets/img/juegos/dbz-kakaroto-portada.jpeg'
    },
    {
      nomJ: 'Gears Of War',
      precioJ: '$54.000',
      imgJ: 'assets/img/juegos/gears of wars.jpeg'
    }
  ];

  // COLECCIÓN DE CONSOLAS
  colec_consolas = [
    {
      nomC: 'Ps2',
      precioC: '$150.000',
      imgC: 'assets/img/consolas/ps2-consola.jpeg'
    },
    {
      nomC: '2dsXL',
      precioC: '$210.000',
      imgC: 'assets/img/consolas/2dsXL-consola.jpeg'
    },
    {
      nomC: 'Switch',
      precioC: '$400.000',
      imgC: 'assets/img/consolas/nintendosw-1.jpeg'
    },
    {
      nomC: 'Ps4',
      precioC: '$400.000',
      imgC: 'assets/img/consolas/ps4-1.jpeg'
    },
    {
      nomC: 'Sega Genesis',
      precioC: '$80.000',
      imgC: 'assets/img/consolas/sega-genesis-consola.jpeg'
    },
    {
      nomC: 'Wii',
      precioC: '$120.000',
      imgC: 'assets/img/consolas/wii-1.jpeg'
    }
  ];

  // COLECCIÓN DE JUGUETES
  colec_juguetes = [
    {
      nomJT: 'Batman ',
      precioJT: '$550.000',
      imgJT: 'assets/img/juguetes/Batman-juguete.jpg'
    },
    {
      nomJT: 'C. Sanders',
      precioJT: '$20.000',
      imgJT: 'assets/img/juguetes/coronel-juguete.jpg'
    },
    {
      nomJT: 'Kirby Amiibo',
      precioJT: '$85.000',
      imgJT: 'assets/img/juguetes/akirby-juguete.jpeg'
    },
    {
      nomJT: 'Kratos',
      precioJT: '$40.000',
      imgJT: 'assets/img/juguetes/Kratos2.jpg'
    },
    {
      nomJT: 'Samus',
      precioJT: '$50.600',
      imgJT: 'assets/img/juguetes/samus1.jpg'
    },
    {
      nomJT: 'Spiderman',
      precioJT: '$50.99',
      imgJT: 'assets/img/juguetes/spiderman-juguete.jpg'
    }
  ];

  usernamelogged!: string;

  constructor(
    private router: Router, 
    private activedroute: ActivatedRoute, 
    private alertasService: AlertasService // Inyección del servicio de alertas
  ) {}
  
  ngAfterViewInit() {
    new Swiper('.swiper-container', this.slideOpts);
  }

  compra() {
    this.alertasService.presentAlert('Añadido al carro', '¡Gracias!');
  }
}
