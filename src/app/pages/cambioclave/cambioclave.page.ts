import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambioclave',
  templateUrl: './cambioclave.page.html',
  styleUrls: ['./cambioclave.page.scss'],
})
export class CambioclavePage implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private router: Router) { }

  ngOnInit() {}

  validarContrasenas() {
    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Los campos no pueden estar vacíos.';
    } else if (this.password !== this.confirmPassword || this.password.length < 6) {
      this.errorMessage = 'Las contraseñas no coinciden o no cumplen con los requisitos.';
    } else {
      this.errorMessage = '';
      this.router.navigate(['/login']);
    }
  }
}
