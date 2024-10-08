import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service'; // Asegúrate de que la ruta del servicio sea correcta
import { CamaraService } from 'src/app/services/camara.service';
import { ManejodbService } from 'src/app/services/manejodb.service';

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
    { value: '1', viewValue: 'Disponible' }, //1  true
    { value: '0', viewValue: 'No disponible' }, //0 False
  ];

  estado: string = ''; // Inicializada en blanco o asigna un valor predeterminado

  consolaLlego: any;

  arregloConsola: any = [
    {
      id_producto: '',
      nombre_prod: '',
      precio_prod: '',
      stock_prod:  '',
      descripcion_prod: '',  
      foto_prod: '',
      estatus: '',
      id_categoria: '',
    }
  ]

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
        this.consolaLlego = this.router.getCurrentNavigation()?.extras?.state?.['consolaSelect'];
      }
    })
  }

  ngOnInit() {
    // verificar si la BD está disponible
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchConsolaUnico().subscribe(res => {
          this.arregloConsola = res;
          this.bd.consultarConsolaPorId(this.consolaLlego.id_producto);
        });
      }
    });
  }

  async guardarCambios() {
    this.resetErrores();

    // Validación de campos
    if (!this.consolaLlego.nombre_prod || this.consolaLlego.precio_prod === null || !this.consolaLlego.descripcion_prod || this.consolaLlego.stock_prod === null || !this.consolaLlego.foto_prod || !this.estado) {
      this.errorCampos = true;
      return;
    }

    if (this.consolaLlego.precio_prod < 0) {
      this.errorPrecio = true;
      return;
    }

    if (this.consolaLlego.stock_prod < 0) {
      this.errorStock = true;
      return;
    }

    await this.bd.modificarConsola(
      this.consolaLlego.id_producto, 
      this.consolaLlego.nombre_prod, 
      this.consolaLlego.precio_prod, 
      this.consolaLlego.stock_prod, 
      this.consolaLlego.descripcion_prod, 
      this.consolaLlego.foto_prod, 
      this.estado
    );

    this.router.navigate(['/crudconsolas']);
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
        this.consolaLlego.foto_prod = fotoUrl; // Asigna la URL de la imagen
        this.errorImagen = false; // Limpia el error si se toma la foto
      } else {
        this.errorImagen = true; // Manejo si no se devuelve una imagen
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.errorImagen = true; // Mostrar mensaje de error si algo falla
    }
  }

  // Método para validar que los valores de precio y stock sean enteros
  validarNumeroEntero(campo: string) {
    if (campo === 'precio') {
      this.consolaLlego.precio_prod = Math.floor(this.consolaLlego.precio_prod || 0); // Redondea hacia abajo si es decimal
    } else if (campo === 'stock') {
      this.consolaLlego.stock_prod = Math.floor(this.consolaLlego.stock_prod || 0); // Redondea hacia abajo si es decimal
    }
  }
}
