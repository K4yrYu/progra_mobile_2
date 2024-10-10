import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CamaraService } from 'src/app/services/camara.service'; // Asegúrate de que el path sea correcto

@Component({
  selector: 'app-modificarperfil',
  templateUrl: './modificarperfil.page.html',
  styleUrls: ['./modificarperfil.page.scss'],
})
export class ModificarperfilPage implements OnInit {
  nombres: string = '';
  apellidos: string = '';
  correo: string = '';
  imagenPerfil: string = ''; // Para almacenar la imagen de perfil

  // Mensajes de error
  errorMessage: string = '';

  constructor(private router: Router, private camaraService: CamaraService) {}

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

  // Método para obtener la imagen de perfil o la imagen predeterminada si no hay ninguna cargada
  getProfileImage(): string {
    return this.imagenPerfil ? this.imagenPerfil : 'assets/img/user_default_photo.jpg';
  }

  // Método para cambiar la imagen de perfil usando el servicio de la cámara
  async cambiarImagenPerfil() {
    try {
      const imageUrl = await this.camaraService.takePicture();
      this.imagenPerfil = imageUrl || 'assets/img/user_default_photo.jpg'; // Asignar imagen por defecto si es undefined
    } catch (error) {
    }
  }
  onSubmit() {
    // Restablece el mensaje de error al inicio
    this.errorMessage = '';

    // Verifica si hay errores
    if (!this.nombres || !this.apellidos) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    // Lógica para actualizar el perfil (si es necesario)
    
    // Si todo es válido, navega a la página de perfil
    this.router.navigate(['/perfil']);
  }
}
