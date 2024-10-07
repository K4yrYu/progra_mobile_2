import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta del servicio sea correcta

interface Estado {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-editarconsola',
  templateUrl: './editarconsola.page.html',
  styleUrls: ['./editarconsola.page.scss'],
})
export class EditarconsolaPage implements OnInit {

  estados: Estado[] = [
    { value: 'disponible', viewValue: 'Disponible' },
    { value: 'no disponible', viewValue: 'No disponible' },
  ];

  // Propiedad para la categoría seleccionada
  estado: string = ''; // Puede ser inicializada con un valor predeterminado si es necesario

  consola: any = {
    nombre: 'PlayStation 2',
    precio: 459990,
    descripcion: 'La última consola de Sony con gráficos avanzados y soporte para juegos de nueva generación.',
    stock: 20,
    imagenUrl: 'assets/img/consolas/ps2-consola.jpg',
  };

  // Variables de control para los mensajes de error
  errorCampos: boolean = false;
  errorPrecio: boolean = false;
  errorStock: boolean = false;

  constructor(private router: Router, private alertasService: AlertasService) {}

  ngOnInit() {}

  async guardarCambios() {
    // Reiniciar errores antes de la validación
    this.errorCampos = false;
    this.errorPrecio = false;
    this.errorStock = false;

    // Verifica si algún campo está vacío
    if (!this.consola.nombre || this.consola.precio === null || !this.consola.descripcion || this.consola.stock === null || !this.consola.imagenUrl || !this.estado) {
      this.errorCampos = true;
      return; // Salir si hay errores
    }

    // Verifica si el precio es menor a 0
    if (this.consola.precio < 0) {
      this.errorPrecio = true;
      return; // Salir si hay errores
    }

    // Verifica si el stock es menor a 0
    if (this.consola.stock < 0) {
      this.errorStock = true;
      return; // Salir si hay errores
    }

    // Si todos los campos son válidos, mostrar alerta de éxito
    await this.alertasService.presentAlert('Éxito', 'Producto editado correctamente');

    // Navegar a la página deseada
    this.router.navigate(['/crudconsolas']);
  }
}
