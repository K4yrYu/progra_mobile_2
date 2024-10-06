import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManejodbService } from 'src/app/services/manejodb.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  Usuario_registrado: string = "admin";
  password_registrado: string = "Admin123.";

  usernameunlogged: string = "";
  password: string = "";
  loginError: boolean = false;

  // Expresión regular para validar la contraseña
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\.)[A-Za-z\d.]{6,}$/;

  constructor(private router: Router, private manejodbService: ManejodbService) {}

  ngOnInit() {
    this.manejodbService.crearBD(); // Llama al método para crear la base de datos
  }

  loggin() {
    // Verifica que el usuario y la contraseña sean correctos
    if (this.usernameunlogged === this.Usuario_registrado 
        && this.password === this.password_registrado
        && this.passwordPattern.test(this.password)) {
      // Redirige a perfil pasando el nombre de usuario como parámetro en la URL
      this.router.navigate(['/perfil'], {
        queryParams: { userconect: this.usernameunlogged }
      });
      this.loginError = false;
    } else {
      this.loginError = true;
    }
  }
}
