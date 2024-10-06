import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Importa el servicio de alertas si lo necesitas

@Component({
  selector: 'app-agregarjuego',
  templateUrl: './agregarjuego.page.html',
  styleUrls: ['./agregarjuego.page.scss'],
})
export class AgregarjuegoPage implements OnInit {

  // Variables vinculadas a los campos del formulario
  nombre: string = '';
  descripcion: string = '';
  precio: number | null = null;
  stock: number | null = null;
  consolas: string = '';
  urlImagen: string = '';

  // Variables de control para mostrar mensajes de error
  errorCampos: boolean = false;
  errorPrecio: boolean = false;
  errorStock: boolean = false;

  constructor(private router: Router, private alertasService: AlertasService) {} // Si necesitas el servicio de alertas

  ngOnInit() {}

  async validarCampos() {
    // Reiniciar errores antes de la validación
    this.errorCampos = false;
    this.errorPrecio = false;
    this.errorStock = false;

    // Verificar si algún campo está vacío
    if (!this.nombre || !this.descripcion || this.precio === null || this.stock === null || !this.consolas || !this.urlImagen) {
      this.errorCampos = true;
      return; // Salir de la función si hay errores
    }

    // Verificar si el precio es menor a 0
    if (this.precio < 0) {
      this.errorPrecio = true;
      return; // Salir de la función si hay errores
    }

    // Verificar si el stock es menor a 0
    if (this.stock < 0) {
      this.errorStock = true;
      return; // Salir de la función si hay errores
    }

    // Si todos los campos son válidos, limpiar los errores
    this.errorCampos = false;
    this.errorPrecio = false;
    this.errorStock = false;

    // Mostrar alerta de éxito antes de navegar
    await this.alertasService.presentAlert('Éxito', 'Juego agregado correctamente.');

    // Navegar a la página deseada
    this.router.navigate(['/crudjuegos']);
  }
}
