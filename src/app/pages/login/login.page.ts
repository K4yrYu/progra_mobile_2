import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManejodbService } from 'src/app/services/manejodb.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usernameunlogged: string = "";
  password: string = "";
  loginError: boolean = false;

  // Expresión regular para validar la contraseña
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\.)[A-Za-z\d.]{6,}$/;

  arregloUsuarios: any [] = [
    {
      id_usuario: '',
      rut_usuario: '',
      nombres_usuario: '',
      apellidos_usuario: '',
      username: '',
      clave: '',
      correo: '',
      token_recup_clave: '',
      foto_usuario: '',
      estado_user: '',
      userlogged: '',
      id_rol: ''
    }
  ]

  constructor(private router: Router, private bd: ManejodbService) {}


  ngOnInit() {
    this.bd.crearBD(); // Llama al método para crear la base de datos
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchUsuarios().subscribe(res => {
          this.arregloUsuarios = res;
        });
      }
    });
  }


  async loggin(user: any, clave: any) {
    await this.bd.consultarUsuariosLoggin(user, clave).then((found) => {
      if (found && this.passwordPattern.test(this.password)) {
        // Actualiza el estado de userlogged a 1
          this.bd.actualizarEstadoUsuario(user).then(() => {
          this.router.navigate(['/perfil']);
          this.resetFields(); // Limpia los campos en caso de éxito
          this.loginError = false;
        }).catch(error => {
          this.loginError = true; // Maneja errores en la actualización
          this.resetFields(); // Limpia los campos en caso de error
        });
      } else {
        this.loginError = true;
        this.resetFields(); // Limpia los campos en caso de error
      }
    }).catch(error => {
      this.loginError = true; // Maneja errores en la consulta
      this.resetFields(); // Limpia los campos en caso de error
    });
  }

  // Función para limpiar los campos
  resetFields() {
    this.usernameunlogged = "";
    this.password = "";
  }

  

  
}
