import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta del servicio sea correcta

@Component({
  selector: 'app-editarjuego',
  templateUrl: './editarjuego.page.html',
  styleUrls: ['./editarjuego.page.scss'],
})
export class EditarjuegoPage implements OnInit {

  videojuego: any = {
    nombre: 'Hollow Knight',
    precio: 15000,
    descripcion: 'Juego de plataformas',
    imagenUrl: 'assets/img/caratula-hollow.jpeg',
    consolas: 'PlayStation, Xbox',
    stock: 20
  };

  // Variables de control para los mensajes de error
  errorCampos: boolean = false;
  errorPrecio: boolean = false;
  errorStock: boolean = false;

  constructor(private router: Router, private alertasService: AlertasService) { }

  ngOnInit() { }

  async guardarCambios() {
    // Reiniciar errores antes de la validación
    this.errorCampos = false;
    this.errorPrecio = false;
    this.errorStock = false;

    // Verifica si algún campo está vacío
    if (!this.videojuego.nombre || this.videojuego.precio === null || !this.videojuego.descripcion || this.videojuego.stock === null || !this.videojuego.consolas || !this.videojuego.imagenUrl) {
      this.errorCampos = true;
      return; // Salir si hay errores
    }

    // Verifica si el precio es menor a 0
    if (this.videojuego.precio < 0) {
      this.errorPrecio = true;
      return; // Salir si hay errores
    }

    // Verifica si el stock es menor a 0
    if (this.videojuego.stock < 0) {
      this.errorStock = true;
      return; // Salir si hay errores
    }

    // Si todos los campos son válidos, mostrar alerta de éxito
    await this.alertasService.presentAlert('Éxito', 'Producto editado correctamente');

    // Navegar a la página deseada
    this.router.navigate(['/crudjuegos']);
  }
}
