import { Platform } from '@ionic/angular'; // Importa Platform
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { ManejodbService } from 'src/app/services/manejodb.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {


  arregloUsuarioConectado: any [] = [
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



  constructor
  (private alertasService: AlertasService,
   private bd: ManejodbService,
   private router: Router,
   private platform: Platform // Inyecta Platform
   ) {}

  ngOnInit() {
    this.bd.dbState().subscribe(data => {
      if (data) {
        // Llama a la función que consulta todos los usuarios por estado
        this.bd.consultarUsuariosPorEstadoConectado().then(res => {
          this.arregloUsuarioConectado = res; // Almacena los usuarios en la variable
        }).catch(error => {
          console.error('Error al consultar usuarios por estado:', error);
        });
      }
    });

     // Suscripción al evento de cambio de ubicación de la página
     this.platform.backButton.subscribeWithPriority(10, () => {
      // Lógica para cerrar sesión al presionar el botón de retroceso del teléfono
      this.cerrarSesion();
    });
  }

 

 
  async cerrarSesion() {
    await this.bd.cerrarSesion();
    this.router.navigate(['/login']);
  }
}