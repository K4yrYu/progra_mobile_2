import { Platform } from '@ionic/angular'; // Importa Platform
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { ManejodbService } from 'src/app/services/manejodb.service';
import { AutenticacionService } from 'src/app/services/autenticacion.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  // Definir la variable que contendrá los datos del usuario conectado
  arregloUsuarioConectado: any[] = [
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
  ];

  constructor(
    private alertasService: AlertasService,
    private bd: ManejodbService,
    private router: Router,
    private platform: Platform, // Inyecta Platform
    private autenticacionService: AutenticacionService
  ) {}

  // Puedes usar el servicio aquí
  cerrarSesionManual() {
    this.autenticacionService.cerrarSesion(); // Llama a cerrar sesión manualmente si es necesario
  }

  ngOnInit() {
    // Verificar si la base de datos está lista
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.consultarUsuarios();
      }
    });
  }

  // Función para consultar los usuarios conectados
  async consultarUsuarios() {
    try {
      this.arregloUsuarioConectado = await this.bd.consultarUsuariosPorEstadoConectado();
    } catch (error) {
      console.error('Error al consultar usuarios por estado:', error);
    }
  }

  // Retorna la imagen del usuario o una imagen predeterminada si no existe
  getImagenUsuario(foto: string | null): string {
    return foto ? foto : 'assets/img/user_default_photo.jpg';
  }

  // Función para cerrar la sesión y redirigir al login
  async cerrarSesion() {
    try {
      await this.cerrarSesionManual();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
