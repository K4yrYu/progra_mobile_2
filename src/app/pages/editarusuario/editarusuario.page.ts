import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta del servicio sea correcta
import { CamaraService } from 'src/app/services/camara.service'; // Importar el servicio de cámara

@Component({
  selector: 'app-editarusuario',
  templateUrl: './editarusuario.page.html',
  styleUrls: ['./editarusuario.page.scss'],
})
export class EditarusuarioPage implements OnInit {
  
  usuario: any = {
    nombres: 'Juan',
    apellidos: 'Perez',
    correo: 'juan.perez&#64;example.com',
    usuario: 'juanp',
    contrasena: '',
    confirmarContrasena: '',
    rol: 'usuario', // Valor predeterminado
    estado: 'activo' // Valor predeterminado
  };

  // Variables de control para los mensajes de error
  errorCampos: boolean = false;
  errorCorreo: boolean = false;
  errorContrasena: boolean = false;

  constructor(private router: Router, 
             private alertasService: AlertasService,
             private camaraService: CamaraService 

  ) {}

  ngOnInit() {}

  async agregarFoto() {
    try {
      const foto = await this.camaraService.takePicture();
      this.usuario.foto = foto; // Guardar la URL de la foto
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.alertasService.presentAlert('Error', 'No se pudo agregar la foto.');
    }
  }

  async guardarCambios() {
    // Reiniciar errores antes de la validación
    this.errorCampos = false;
    this.errorCorreo = false;
    this.errorContrasena = false;

    // Verifica si algún campo está vacío
    if (!this.usuario.nombres || !this.usuario.apellidos || !this.usuario.correo || !this.usuario.usuario || !this.usuario.contrasena || !this.usuario.confirmarContrasena || !this.usuario.rol || !this.usuario.estado) {
      this.errorCampos = true;
      return; // Salir si hay errores
    }

    // Verifica si el correo es válido
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.usuario.correo)) {
      this.errorCorreo = true;
      return; // Salir si hay errores
    }

    // Verifica si las contraseñas coinciden
    if (this.usuario.contrasena !== this.usuario.confirmarContrasena) {
      this.errorContrasena = true;
      return; // Salir si hay errores
    }

    // Si todos los campos son válidos, mostrar alerta de éxito
    await this.alertasService.presentAlert('Éxito', 'Usuario editado correctamente');

    // Navegar a la página deseada
    this.router.navigate(['/crudusuarios']);
  }
}

