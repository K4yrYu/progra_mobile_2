import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { CamaraService } from 'src/app/services/camara.service'; // Importar el servicio de cámara

interface Usuario {
  nombres: string;
  apellidos: string;
  rut: string;
  correo: string;
  usuario: string;
  contrasena: string;
  confirmarContrasena: string;
  rol: string;
  estado: string;
  foto?: string; // Propiedad opcional para la foto
}

@Component({
  selector: 'app-agregarusuario',
  templateUrl: './agregarusuario.page.html',
  styleUrls: ['./agregarusuario.page.scss'],
})
export class AgregarusuarioPage {
  usuario: Usuario = {
    nombres: '',
    apellidos: '',
    rut: '',
    correo: '',
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
    rol: '',
    estado: '',
  };

  // Variables de control para los mensajes de error
  errorCampos: boolean = false;
  errorCorreo: boolean = false;
  errorContrasena: boolean = false;
  errorFormatoContrasena: boolean = false;
  errorRut: boolean = false;

  constructor(
    private router: Router,
    private alertasService: AlertasService,
    private camaraService: CamaraService // Inyectar el servicio de cámara
  ) {}

  async agregarFoto() {
    try {
      const foto = await this.camaraService.takePicture();
      this.usuario.foto = foto; // Guardar la URL de la foto
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.alertasService.presentAlert('Error', 'No se pudo agregar la foto.');
    }
  }

  async validarCampos() {
    // Reiniciar errores antes de la validación
    this.errorCampos = false;
    this.errorCorreo = false;
    this.errorContrasena = false;
    this.errorFormatoContrasena = false;
    this.errorRut = false;

    // Verifica si algún campo está vacío
    if (
      !this.usuario.nombres ||
      !this.usuario.apellidos ||
      !this.usuario.rut ||
      !this.usuario.correo ||
      !this.usuario.usuario ||
      !this.usuario.contrasena ||
      !this.usuario.confirmarContrasena
    ) {
      this.errorCampos = true;
      return; // Salir si hay errores
    }

    // Verifica si el correo es válido
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.usuario.correo)) {
      this.errorCorreo = true;
      return; // Salir si hay errores
    }

    // Verifica el formato del RUT (puedes personalizar la validación según tus necesidades)
    const rutPattern = /^\d{1,8}-[0-9kK]{1}$/; // Formato RUT: 12345678-9 o 12345678-k
    if (!rutPattern.test(this.usuario.rut)) {
      this.errorRut = true;
      return; // Salir si hay errores
    }

    // Verifica si las contraseñas coinciden
    if (this.usuario.contrasena !== this.usuario.confirmarContrasena) {
      this.errorContrasena = true;
      return; // Salir si hay errores
    }

    // Verifica el formato de la contraseña
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\.)[A-Za-z\d.]{6,}$/;
    if (!passwordPattern.test(this.usuario.contrasena)) {
      this.errorFormatoContrasena = true;
      return; // Salir si hay errores
    }

    // Si todos los campos son válidos, mostrar alerta de éxito
    await this.alertasService.presentAlert('Éxito', 'Usuario agregado correctamente');
    this.router.navigate(['/crudusuarios']);
  }
}
