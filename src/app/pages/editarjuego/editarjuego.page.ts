import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CamaraService } from 'src/app/services/camara.service';
import { ManejodbService } from 'src/app/services/manejodb.service';

interface Estado {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-editarjuego',
  templateUrl: './editarjuego.page.html',
  styleUrls: ['./editarjuego.page.scss'],
})
export class EditarjuegoPage implements OnInit {
  estados: Estado[] = [
    { value: '1', viewValue: 'Disponible' }, // 1 true
    { value: '0', viewValue: 'No disponible' }, // 0 false
  ];

  estado: string = ''; // Inicializada en blanco o asigna un valor predeterminado
  juegoLlego: any;

  arregloJuegoUnico: any = [
    {
      id_producto: '',
      nombre_prod: '',
      precio_prod: '',
      stock_prod: '',
      descripcion_prod: '',
      foto_prod: '',
      estatus: '',
      id_categoria: '',
    }
  ];

  // Variables de control para los mensajes de error
  errorCampos: boolean = false;
  errorPrecio: boolean = false;
  errorStock: boolean = false;
  errorImagen: boolean = false;

  constructor(
    private bd: ManejodbService,
    private router: Router,
    private activedroute: ActivatedRoute,
    private camaraService: CamaraService
  ) {
    this.activedroute.queryParams.subscribe(res => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.juegoLlego = { ...this.router.getCurrentNavigation()?.extras?.state?.['juegoSelect'] }; // Clonación del objeto
      }
    });
  }

  ngOnInit() {
    // Verificar si la BD está disponible
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchJuegoUnico().subscribe(res => {
          this.arregloJuegoUnico = res;
          this.bd.consultarJuegoPorId(this.juegoLlego.id_producto);
        });
      }
    });
  }

  async guardarCambios() {
    this.resetErrores();

    // Validación de campos
    if (!this.juegoLlego.nombre_prod || this.juegoLlego.precio_prod === null || !this.juegoLlego.descripcion_prod || this.juegoLlego.stock_prod === null || !this.juegoLlego.foto_prod || !this.estado) {
      this.errorCampos = true;
      return;
    }

    if (this.juegoLlego.precio_prod < 0) {
      this.errorPrecio = true;
      return;
    }

    if (this.juegoLlego.stock_prod < 0) {
      this.errorStock = true;
      return;
    }

    try {
      await this.bd.modificarJuego(
        this.juegoLlego.id_producto,
        this.juegoLlego.nombre_prod,
        this.juegoLlego.precio_prod,
        this.juegoLlego.stock_prod,
        this.juegoLlego.descripcion_prod,
        this.juegoLlego.foto_prod,
        this.estado
      );

      this.router.navigate(['/crudjuegos']);
    } catch (error) {
      // Manejo del error si el nombre ya existe
      console.error('Error al modificar el juego:', error);
    }
  }

  private resetErrores() {
    this.errorCampos = false;
    this.errorPrecio = false;
    this.errorStock = false;
    this.errorImagen = false;
  }

  // Método para capturar la imagen usando el servicio de cámara
  async tomarFoto() {
    try {
      const fotoUrl = await this.camaraService.takePicture();
      if (fotoUrl) {
        this.juegoLlego.foto_prod = fotoUrl; // Asigna la URL de la imagen
        this.errorImagen = false; // Limpia el error si se toma la foto
      } else {
        this.errorImagen = true; // Manejo si no se devuelve una imagen
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.errorImagen = true; // Mostrar mensaje de error si algo falla
    }
  }

  // Método para volver sin cambiar valores
  volver() {
    this.router.navigate(['/crudjuegos']);
  }

  // Método para validar que los valores de precio y stock sean enteros
  validarNumeroEntero(campo: string) {
    if (campo === 'precio') {
      this.juegoLlego.precio_prod = Math.floor(this.juegoLlego.precio_prod || 0); // Redondea hacia abajo si es decimal
    } else if (campo === 'stock') {
      this.juegoLlego.stock_prod = Math.floor(this.juegoLlego.stock_prod || 0); // Redondea hacia abajo si es decimal
    }
  }
}
