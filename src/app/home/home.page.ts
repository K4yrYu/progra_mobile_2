import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper'; // Muestra más de una tarjeta parcialmente visible esto se instala con un npm install swiper
import { YouTubeService } from 'src/app/services/youtube.service'; // Asegúrate de que la ruta sea correcta


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
      imgJ: 'assets/img/juegos/caratula-hollow.jpeg',
      videoId: 'y2EwIKVMTuU', // Añade el ID de vídeo correspondiente
    },
    {
      nomJ: 'Megaman11',
      precioJ: '$30.000',
      imgJ: 'assets/img/juegos/caratula-megaman11.jpeg',
      videoId: 'sEjxVfWzgVI', // Añade el ID de vídeo correspondiente
      
    },
    {
      nomJ: 'Skyrim',
      precioJ: '$20.000',
      imgJ: 'assets/img/juegos/Skyrim_Cover.jpeg',
      videoId: 'JSRtYpNRoN0&t=9s', // Añade el ID de vídeo correspondiente
    },
    {
      nomJ: 'Lies of pi',
      precioJ: '$40.000',
      imgJ: 'assets/img/juegos/caratula-liesofp.jpeg',
      videoId: 'TYr1x25Z1Ak', // Añade el ID de vídeo correspondiente
    },
    {
      nomJ: 'Kakarot',
      precioJ: '$50.900',
      imgJ: 'assets/img/juegos/dbz-kakaroto-portada.jpeg',
      videoId: 's0Xe1ggWDUI ', // Añade el ID de vídeo correspondiente
    },
    {
      nomJ: 'Gears Of War',
      precioJ: '$54.000',
      imgJ: 'assets/img/juegos/gears of wars.jpeg',
      videoId: 'wy8LRlS1SCc', // Añade el ID de vídeo correspondiente
    }
  ];

  // COLECCIÓN DE CONSOLAS
  colec_consolas = [
    {
      nomC: 'Ps2',
      precioC: '$150.000',
      imgC: 'assets/img/consolas/ps2-consola.jpeg',
      videoId: 'Hvcps5dFzfc', // Añade el ID de vídeo correspondiente
    },
    {
      nomC: '2dsXL',
      precioC: '$210.000',
      imgC: 'assets/img/consolas/2dsXL-consola.jpeg',
      videoId: '6ua8CRQaBv4', // Añade el ID de vídeo correspondiente
    },
    {
      nomC: 'Switch',
      precioC: '$400.000',
      imgC: 'assets/img/consolas/nintendosw-1.jpeg',
      videoId: 'iS-1tDfLxRQ', // Añade el ID de vídeo correspondiente
    },
    {
      nomC: 'Ps4',
      precioC: '$400.000',
      imgC: 'assets/img/consolas/ps4-1.jpeg',
      videoId: 'NygHJeiVg10', // Añade el ID de vídeo correspondiente
    },
    {
      nomC: 'Sega Genesis',
      precioC: '$80.000',
      imgC: 'assets/img/consolas/sega-genesis-consola.jpeg',
      videoId: '3YcRcXiuYOg', // Añade el ID de vídeo correspondiente
    },
    {
      nomC: 'Wii',
      precioC: '$120.000',
      imgC: 'assets/img/consolas/wii-1.jpeg',
      videoId: 'mBOaO7QTFMQ', // Añade el ID de vídeo correspondiente
    }
  ];

  // COLECCIÓN DE JUGUETES
  colec_juguetes = [
    {
      nomJT: 'Batman ',
      precioJT: '$550.000',
      imgJT: 'assets/img/juguetes/Batman-juguete.jpg',
      videoId: 'ofZFAqnlVvY', // Añade el ID de vídeo correspondiente
    },
    {
      nomJT: 'C. Sanders',
      precioJT: '$20.000',
      imgJT: 'assets/img/juguetes/coronel-juguete.jpg',
      videoId: 'joDwiMy8TT4', // Añade el ID de vídeo correspondiente
    },
    {
      nomJT: 'Kirby Amiibo',
      precioJT: '$85.000',
      imgJT: 'assets/img/juguetes/akirby-juguete.jpeg',
      videoId: '8WPw9U_7PXE', // Añade el ID de vídeo correspondiente
    },
    {
      nomJT: 'Kratos',
      precioJT: '$40.000',
      imgJT: 'assets/img/juguetes/Kratos2.jpg',
      videoId: 'JJ1arWpbFmM', // Añade el ID de vídeo correspondiente
    },
    {
      nomJT: 'Samus',
      precioJT: '$50.600',
      imgJT: 'assets/img/juguetes/samus1.jpg',
      videoId: 'jNbGAq_44sQ', // Añade el ID de vídeo correspondiente
    },
    {
      nomJT: 'Spiderman',
      precioJT: '$50.99',
      imgJT: 'assets/img/juguetes/spiderman-juguete.jpg',
      videoId: 'MlbYeIxjSSI', // Añade el ID de vídeo correspondiente
    }
  ];

  usernamelogged!: string;

  constructor(
    private youtubeService: YouTubeService // Inyección del servicio de YouTube

  ) {}
  
  ngAfterViewInit() {
    new Swiper('.swiper-container', this.slideOpts);
  }

  verTrailer(videoId: string) {
    this.youtubeService.openVideo(videoId);
  }
}
 