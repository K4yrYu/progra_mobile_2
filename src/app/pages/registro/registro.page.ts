import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { ManejodbService } from 'src/app/services/manejodb.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombres: string = '';
  apellidos: string = '';
  rut: string = '';
  usuario: string = '';
  correo: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  mensajesValidacion: string = '';

  arregloUsuarios: any[] = [];

  constructor(private router: Router, private bd: ManejodbService, private alerta: AlertasService) { }

  ngOnInit() {
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchUsuarios().subscribe(res => {
          this.arregloUsuarios = res;
        });
      }
    });
  }

  registrar() {
    this.mensajesValidacion = this.validarFormulario();

    if (!this.mensajesValidacion) {
      // Si no hay mensajes de validación, redirigir al usuario
      this.bd.agregarUsuariosCliente(this.rut, this.nombres, this.apellidos, this.usuario, this.contrasena, this.correo);
      this.router.navigate(['/login']);
      this.reiniciarCampos(); // Reiniciar campos después del registro
    }
  }

  validarFormulario(): string {
    // Validar campos vacíos
    if (!this.nombres || !this.apellidos || !this.rut || !this.usuario || !this.correo || !this.contrasena || !this.confirmarContrasena) {
      return 'Todos los campos son obligatorios.';
    }

    // Validar formato del RUT
    const rutValido = /^[0-9]+[-][0-9kK]{1}$/.test(this.rut);
    if (!rutValido) {
      return 'El formato del RUT es inválido. Debe ser en el formato: 12345678-k';
    }

    // Validar formato del correo
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo) && this.correo.split('@').length === 2;
    if (!correoValido) {
      return 'El formato del correo electrónico es inválido o contiene más de un símbolo "@"';
    }

    // Validar contraseñas coincidan
    if (this.contrasena !== this.confirmarContrasena) {
      return 'Las contraseñas no coinciden.';
    }

    // Validar longitud y formato de la contraseña
    const contraseñaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/.test(this.contrasena);
    if (!contraseñaValida) {
      return 'La contraseña debe tener al menos 6 caracteres, incluyendo mayúsculas, minúsculas y caracteres especiales.';
    }

    // Verifica si el usuario ya existe
    const usuarioExistente = this.arregloUsuarios.find(usuario => usuario.username === this.usuario);
    
    if (usuarioExistente) {
      return 'El usuario ya existe'; // Retorna un mensaje si el usuario ya existe
    }

    // Si todas las validaciones pasan, no retornar mensaje
    return '';
  }

  reiniciarCampos() {
    this.nombres = '';
    this.apellidos = '';
    this.rut = '';
    this.usuario = '';
    this.correo = '';
    this.contrasena = '';
    this.confirmarContrasena = '';
    this.mensajesValidacion = '';
  }
}
