import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  usuario: string = '';
  correo: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  mensajesValidacion: string = '';

  constructor(private router: Router) { }

  ngOnInit() {}

  registrar() {
    this.mensajesValidacion = this.validarFormulario();

    if (!this.mensajesValidacion) {
      // Si no hay mensajes de validación, redirigir al usuario
      this.router.navigate(['/home']);
    }
  }

  validarFormulario(): string {
    // Validar campos vacíos
    if (!this.usuario || !this.correo || !this.contrasena || !this.confirmarContrasena) {
      return 'Todos los campos son obligatorios.';
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

    // Si todas las validaciones pasan, no retornar mensaje
    return '';
  }
}
