import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userF: string = "";

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Obtiene los parámetros de consulta de la URL
    this.activatedRoute.queryParams.subscribe(params => {
      this.userF = params['userconect'] || '';
    });
  }

  cerrarSesion() {
    // Redirige al login sin parámetros adicionales
    this.router.navigate(['/login']);
  }
}