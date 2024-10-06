import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Ruta del servicio

@Component({
  selector: 'app-agregarconsola',
  templateUrl: './agregarconsola.page.html',
  styleUrls: ['./agregarconsola.page.scss'],
})
export class AgregarconsolaPage implements OnInit {

  // Variables vinculadas a los campos del formulario
  nombre: string = '';
  descripcion: string = '';
  precio: number | null = null;
  stock: number | null = null;
  urlImagen: string = '';

  // Variables de control para mostrar mensajes de error
  errorCampos: boolean = false;
  errorPrecio: boolean = false;
  errorStock: boolean = false;

  constructor(private router: Router, private alertasService: AlertasService) {}

  ngOnInit() {}

  async validarCampos() {
    // Reiniciar errores antes de la validación
    this.errorCampos = false;
    this.errorPrecio = false;
    this.errorStock = false;

    // Verificar si algún campo está vacío
    if (!this.nombre || !this.descripcion || this.precio === null || this.stock === null || !this.urlImagen) {
      this.errorCampos = true;
    }

    // Verificar si el precio es menor a 0
    if (this.precio !== null && this.precio < 0) {
      this.errorPrecio = true;
    }

    // Verificar si el stock es menor a 0
    if (this.stock !== null && this.stock < 0) {
      this.errorStock = true;
    }

    // Si hay errores, solo regresar sin mostrar alertas
    if (this.errorCampos || this.errorPrecio || this.errorStock) {
      return; // Salir de la función si hay errores
    }

    // Si todos los campos son válidos, mostrar alerta de éxito
    await this.alertasService.presentAlert('Éxito', 'Consola agregada correctamente');

    // Navegar a la página deseada después de cerrar la alerta
    this.router.navigate(['/crudconsolas']);
  }
}
