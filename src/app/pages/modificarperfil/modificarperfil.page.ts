import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modificarperfil',
  templateUrl: './modificarperfil.page.html',
  styleUrls: ['./modificarperfil.page.scss'],
})
export class ModificarperfilPage implements OnInit {
  nombres: string = '';
  apellidos: string = '';
  correo: string = '';
  
  // Mensajes de error
  errorMessage: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    // Inicializa las variables si es necesario
  }

  // Validaciones para los campos
  get nombresInvalid() {
    return !this.nombres && this.errorMessage;
  }

  get apellidosInvalid() {
    return !this.apellidos && this.errorMessage;
  }

  get correoInvalid() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !this.correo || !emailPattern.test(this.correo);
  }

  onSubmit() {
    // Restablece el mensaje de error al inicio
    this.errorMessage = '';

    // Verifica si hay errores
    if (!this.nombres || !this.apellidos) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    // Verifica si el correo es inválido y establece el mensaje de error correspondiente
    if (this.correoInvalid) {
      this.errorMessage = 'Ingrese un correo electrónico válido.';
      return;
    }

    // Lógica para actualizar el perfil (si es necesario)
    
    // Si todo es válido, navega a la página de perfil
    this.router.navigate(['/perfil']);
  }
}
