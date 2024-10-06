import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crudconsolas',
  templateUrl: './crudconsolas.page.html',
  styleUrls: ['./crudconsolas.page.scss'],
})
export class CrudconsolasPage implements OnInit {

  consolas: any = [
    {
      nombre: 'PlayStation 2',
      precio: 459990,
      descripcion: 'Aguante la play 2.',
      imagenUrl: 'assets/img/consolas/ps2-consola.jpeg',
      stock: 20
    },
    {
      nombre: 'Wii',
      precio: 459990, 
      descripcion: 'La consola más vendida de nintendo.',
      imagenUrl: 'assets/img/consolas/wii-1.jpeg',
      stock: 15
    },
    {
      nombre: 'Nintendo Switch',
      precio: 299990, 
      descripcion: 'Una consola híbrida que se puede usar tanto como portátil como de sobremesa.',
      imagenUrl: 'assets/img/consolas/nintendosw-1.jpeg',
      stock: 30
    },
    {
      nombre: 'PlayStation 4',
      precio: 299990, 
      descripcion: 'La consola anterior de Sony, aún popular con una gran biblioteca de juegos.',
      imagenUrl: 'assets/img/consolas/ps4-1.jpeg',
      stock: 25
    },
    {
      nombre: 'Sega Genesis',
      precio: 299990, 
      descripcion: 'Una reliquia de los 80.',
      imagenUrl: 'assets/img/consolas/sega-genesis-consola.jpeg',
      stock: 18
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
