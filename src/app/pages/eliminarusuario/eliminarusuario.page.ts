import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-eliminarusuario',
  templateUrl: './eliminarusuario.page.html', // Asegúrate de que la ruta sea correcta
  styleUrls: ['./eliminarusuario.page.scss'],
})
export class EliminarusuarioPage implements OnInit {

  constructor(
    private alertasService: AlertasService, // Inyección del servicio
    private router: Router
  ) { }

  ngOnInit() { }

  async eliminarUsuario() {
    // Aquí puedes realizar la lógica para eliminar el usuario

    // Luego, muestra la alerta
    await this.alertasService.presentAlert('Usuario Eliminado', 'El usuario ha sido eliminado exitosamente.');

    // Redirige después de que el usuario haya cerrado la alerta
    this.router.navigate(['/crudusuarios']);
  }
}
