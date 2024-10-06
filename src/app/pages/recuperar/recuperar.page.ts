import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  email: string = '';
  errorMessage: string = '';

  constructor(private router: Router) { }

  ngOnInit() {}

  validarCorreo() {
    const atSymbolCount = (this.email.match(/@/g) || []).length;

    if (atSymbolCount !== 1) {
      this.errorMessage = 'El correo electrónico debe contener exactamente un "@"';
    } else {
      this.errorMessage = '';
      this.router.navigate(['/cambioclave']);
    }
  }
}
