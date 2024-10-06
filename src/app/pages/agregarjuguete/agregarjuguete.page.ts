import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta del servicio sea correcta

@Component({
  selector: 'app-agregarjuguete',
  templateUrl: './agregarjuguete.page.html',
  styleUrls: ['./agregarjuguete.page.scss'],
})
export class AgregarjuguetePage implements OnInit {

  // Variables vinculadas a los campos del formulario
  nombre: string = '';
  descripcion: string = '';
  precio: number | null = null;
  stock: number | null = null;
  urlImagen: string = '';
  
  // Variables para los mensajes de error
  errorCampos: boolean = false;
  errorPrecio: boolean = false;
  errorStock: boolean = false;

  constructor(private router: Router, private alertasService: AlertasService) {}

  ngOnInit() {}

  async validarCampos() {
    // Reiniciar errores
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

    // Si hay errores, mostrar alertas correspondientes
    if (this.errorCampos) {
      await this.alertasService.presentAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (this.errorPrecio) {
      await this.alertasService.presentAlert('Error', 'El precio no puede ser menor a 0.');
      return;
    }

    if (this.errorStock) {
      await this.alertasService.presentAlert('Error', 'El stock no puede ser menor a 0.');
      return;
    }

    // Si todos los campos son válidos, mostrar alerta de éxito
    await this.alertasService.presentAlert('Éxito', 'Juguete agregado correctamente');

    // Navegar a la página deseada
    this.router.navigate(['/crudjuguetes']);
  }
}
