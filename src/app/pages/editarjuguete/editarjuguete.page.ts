import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CamaraService } from 'src/app/services/camara.service';
import { ManejodbService } from 'src/app/services/manejodb.service';

interface Estado {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-editarjuguete',
  templateUrl: './editarjuguete.page.html',
  styleUrls: ['./editarjuguete.page.scss'],
})
export class EditarjuguetePage implements OnInit {

  estados: Estado[] = [
    { value: '1', viewValue: 'Disponible' }, // 1: true
    { value: '0', viewValue: 'No disponible' }, // 0: false
  ];

  estado: string = ''; // Inicializada en blanco o asigna un valor predeterminado
  jugueteLlego: any;

  arregloJugueteUnico: any = [
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
        this.jugueteLlego = this.router.getCurrentNavigation()?.extras?.state?.['jugueteSelect'];
      }
    });
  }

  ngOnInit() {
    // Verificar si la BD está disponible
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchJuguetesUnico().subscribe(res => {
          this.arregloJugueteUnico = res;
          this.bd.consultarJuguetePorId(this.jugueteLlego.id_producto);
        });
      }
    });
  }

  async guardarCambios() {
    this.resetErrores();

    // Validación de campos
    if (!this.jugueteLlego.nombre_prod || this.jugueteLlego.precio_prod === null || !this.jugueteLlego.descripcion_prod || this.jugueteLlego.stock_prod === null || !this.jugueteLlego.foto_prod || !this.estado) {
      this.errorCampos = true;
      return;
    }

    if (this.jugueteLlego.precio_prod < 0) {
      this.errorPrecio = true;
      return;
    }

    if (this.jugueteLlego.stock_prod < 0) {
      this.errorStock = true;
      return;
    }

    await this.bd.modificarJuguete(
      this.jugueteLlego.id_producto, 
      this.jugueteLlego.nombre_prod, 
      this.jugueteLlego.precio_prod, 
      this.jugueteLlego.stock_prod, 
      this.jugueteLlego.descripcion_prod, 
      this.jugueteLlego.foto_prod, 
      this.estado
    ); 

    this.router.navigate(['/crudjuguetes']);
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
        this.jugueteLlego.foto_prod = fotoUrl; // Asigna la URL de la imagen
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
      this.jugueteLlego.precio_prod = Math.floor(this.jugueteLlego.precio_prod || 0); // Redondea hacia abajo si es decimal
    } else if (campo === 'stock') {
      this.jugueteLlego.stock_prod = Math.floor(this.jugueteLlego.stock_prod || 0); // Redondea hacia abajo si es decimal
    }
  }
}
