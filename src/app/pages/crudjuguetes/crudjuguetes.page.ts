import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crudjuguetes',
  templateUrl: './crudjuguetes.page.html',
  styleUrls: ['./crudjuguetes.page.scss'],
})
export class CrudjuguetesPage implements OnInit {

  juguetes: any = [
    {
      nombre: 'Funko Pop  de Spider-Man',
      precio: 19990,
      descripcion: 'Figura de Spider-Man .',
      imagenUrl: 'assets/img/juguetes/spiderman-juguete.jpg',
      stock: 50
    },
    {
      nombre: 'Amibo Kirby',
      precio: 14990,
      descripcion: 'Figura coleccionable de kirby.',
      imagenUrl: 'assets/img/juguetes/akirby-juguete.jpeg',
      stock: 40
    },
    {
      nombre: 'Funko Pop Coronel',
      precio: 49990,
      descripcion: 'Figura del coronel .',
      imagenUrl: 'assets/img/juguetes/coronel-juguete.jpg',
      stock: 30
    },
    {
      nombre: 'Funko Pop Kratos',
      precio: 69990,
      descripcion: 'Figura de kratos.',
      imagenUrl: 'assets/img/juguetes/Kratos2.jpg',
      stock: 20
    },
    {
      nombre: 'Zelda amibo',
      precio: 9990,
      descripcion: 'Amibo de zelda.',
      imagenUrl: 'assets/img/juguetes/Zelda-juguete.png',
      stock: 100
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
