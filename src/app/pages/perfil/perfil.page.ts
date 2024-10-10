import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { ManejodbService } from 'src/app/services/manejodb.service';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { ViewWillEnter } from '@ionic/angular'; // Importar ViewWillEnter

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit, ViewWillEnter { // Implementa ViewWillEnter

  // Definir la variable que contendrá los datos del usuario conectado
  arregloUsuarioConectado: any[] = [];

  constructor(
    private alertasService: AlertasService,
    private bd: ManejodbService,
    private router: Router,
    private autenticacionService: AutenticacionService
  ) {}

  // Método que se llama cada vez que la vista se está a punto de mostrar
  ionViewWillEnter() {
    this.consultarUsuarios(); // Cargar usuarios cada vez que se entra a la vista
  }

  ngOnInit() {
    // Verificar si la base de datos está lista
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.consultarUsuarios(); // Cargar usuarios cuando la base de datos está lista
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
      await this.autenticacionService.cerrarSesion(); // Llama a cerrar sesión manualmente
      this.arregloUsuarioConectado = []; // Limpiar el arreglo después de cerrar sesión
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}