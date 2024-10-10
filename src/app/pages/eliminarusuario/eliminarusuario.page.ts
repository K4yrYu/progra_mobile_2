import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta
import { ManejodbService } from 'src/app/services/manejodb.service';

@Component({
  selector: 'app-eliminarusuario',
  templateUrl: './eliminarusuario.page.html', // Asegúrate de que la ruta sea correcta
  styleUrls: ['./eliminarusuario.page.scss'],
})
export class EliminarusuarioPage implements OnInit {

  //usuario que llega desde crud
  usuarioLlego: any;

  //usuario que esta en la sesion
  UsuarioEnSesion: any;

  arregloUsuariounico: any = [
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

  constructor(private bd: ManejodbService, private router: Router, private activedroute: ActivatedRoute) {
    this.activedroute.queryParams.subscribe(res => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras.state) {
        this.usuarioLlego = navigation.extras.state['usuarioSelect'];
      }
    });
  }

  ngOnInit() {
    // verificar si la BD está disponible
    this.bd.dbState().subscribe(data => {
      if (data) {
        // subscribir al observable de la consulta
        this.bd.fetchUsuarioUnico().subscribe(res => {
          this.arregloUsuariounico = res;
        });
      }
    });
  }


  async eliminarUsuario() {
    
    //enviar id usuario a borrar / id_usuario en sesion 
    await this.bd.eliminarUsuarios(this.usuarioLlego.id_usuario);


    // Redirige después de que el usuario haya cerrado la alerta
    this.router.navigate(['/crudusuarios']);
  }
}