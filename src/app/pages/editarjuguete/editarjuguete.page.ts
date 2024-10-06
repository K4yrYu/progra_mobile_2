import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta del servicio sea correcta

@Component({
  selector: 'app-editarjuguete',
  templateUrl: './editarjuguete.page.html',
  styleUrls: ['./editarjuguete.page.scss'],
})
export class EditarjuguetePage implements OnInit {

  juguete: any = {
    nombre: 'Funko Pop de Spider-Man',
    precio: 19990,
    descripcion: 'Figura de Spider-Man.',
    imagenUrl: 'assets/img/juguetes/spiderman-juguete.jpg',
    stock: 50
  };

  // Variables para los mensajes de error
  errorCampos: boolean = false;
  errorPrecio: boolean = false;
  errorStock: boolean = false;

  constructor(private router: Router, private alertasService: AlertasService) { }

  ngOnInit() { }

  async guardarCambios() {
    // Reiniciar errores
    this.errorCampos = false;
    this.errorPrecio = false;
    this.errorStock = false;

    // Verificar si algún campo está vacío
    if (!this.juguete.nombre || this.juguete.precio === null || !this.juguete.descripcion || this.juguete.stock === null || !this.juguete.imagenUrl) {
      this.errorCampos = true;
      return; // Salir si hay errores
    }

    // Verificar si el precio es menor a 0
    if (this.juguete.precio < 0) {
      this.errorPrecio = true;
      return; // Salir si hay errores
    }

    // Verificar si el stock es menor a 0
    if (this.juguete.stock < 0) {
      this.errorStock = true;
      return; // Salir si hay errores
    }

    // Si todos los campos son válidos, mostrar alerta de éxito
    await this.alertasService.presentAlert('Éxito', 'Producto editado correctamente');

    // Navegar a la página deseada
    this.router.navigate(['/crudjuguetes']);
  }
}
