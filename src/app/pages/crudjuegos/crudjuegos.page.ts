import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crudjuegos',
  templateUrl: './crudjuegos.page.html',
  styleUrls: ['./crudjuegos.page.scss'],
})
export class CrudjuegosPage implements OnInit {
  
  videojuegos: any= [
    {
      nombre: ' Hollow knight',
      precio: 15000,
      descripcion: 'Juego de paciencia',
      imagenUrl: 'assets/img/juegos/caratula-hollow.jpeg',
      consolas: 'PlayStation, Xbox',
      stock: 35
    },
    {
      nombre: 'Lies of pi',
      precio: 4999,
      descripcion: 'Juego de estrategia',
      imagenUrl: 'assets/img/juegos/caratula-liesofp.jpeg',
      consolas: 'PC, Nintendo Switch',
      stock: 20
    },
    {
      nombre: 'Megaman 11',
      precio: 19990,
      descripcion: 'Juego de megaman nuevo',
      imagenUrl: 'assets/img/juegos/caratula-megaman11.jpeg',
      consolas: 'PlayStation, Xbox, PC',
      stock: 50
    },
    {
      nombre: 'Dbz Kakaroto',
      precio: 39990,
      descripcion: 'Juego de pelea ',
      imagenUrl: 'assets/img/juegos/dbz-kakaroto-portada.jpeg',
      consolas: 'Nintendo Switch, PC',
      stock: 25
    },
    {
      nombre: 'Skyrim',
      precio: 59990,
      descripcion: 'Juego de aventura',
      imagenUrl: 'assets/img/juegos/Skyrim_Cover.jpeg',
      consolas: 'PlayStation, Xbox',
      stock: 15
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
