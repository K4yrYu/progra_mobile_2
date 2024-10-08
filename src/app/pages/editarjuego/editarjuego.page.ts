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
  selector: 'app-editarjuego',
  templateUrl: './editarjuego.page.html',
  styleUrls: ['./editarjuego.page.scss'],
})
export class EditarjuegoPage implements OnInit {

  estados: Estado[] = [
    { value: '1', viewValue: 'Disponible' }, //1  true
    { value: '0', viewValue: 'No disponible' }, //0 False
  ];

  // Propiedad para el estado seleccionado
  estado: string = ''; // Inicializada en blanco o asigna un valor predeterminado si lo prefieres

  juegoLlego: any;

  arregloJuegoUnico: any = [
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

  constructor(private bd: ManejodbService, private router: Router, private activedroute: ActivatedRoute, private alertasService: AlertasService, private camaraService: CamaraService) {
    this.activedroute.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.juegoLlego = this.router.getCurrentNavigation()?.extras?.state?.['juegoSelect'];
      }
    })
   }

  //arreglar pork no se ve el juego unico
  ngOnInit() {
    // verificar si la BD está disponible
    this.bd.dbState().subscribe(data => {
      if (data) {
        // subscribir al observable de la consulta
        this.bd.fetchJuegoUnico().subscribe(res => {
          this.arregloJuegoUnico = res;
          this.bd.consultarJuegoPorId(this.juegoLlego.id_producto);
        });
      }
    });
  }

  async guardarCambios() {
    // Reiniciar errores antes de la validación
    this.errorCampos = false;
    this.errorPrecio = false;
    this.errorStock = false;
    this.errorImagen = false;

    // Verifica si algún campo está vacío o si el estado no está seleccionado
    if (!this.juegoLlego.nombre_prod || this.juegoLlego.precio_prod === null || !this.juegoLlego.descripcion_prod || this.juegoLlego.stock_prod === null || !this.juegoLlego.foto_prod || !this.estado) {
      this.errorCampos = true;
      return; // Salir si hay errores
    }

    // Verifica si el precio es menor a 0
    if (this.juegoLlego.precio_prod < 0) {
      this.errorPrecio = true;
      return; // Salir si hay errores
    }

    // Verifica si el stock es menor a 0
    if (this.juegoLlego.stock_prod < 0) {
      this.errorStock = true;
      return; // Salir si hay errores
    }


    await this.bd.modificarJuego(this.juegoLlego.id_producto, this.juegoLlego.nombre_prod, this.juegoLlego.precio_prod, this.juegoLlego.stock_prod, this.juegoLlego.descripcion_prod, this.juegoLlego.foto_prod, this.estado);

    // Navegar a la página deseada
    this.router.navigate(['/crudjuegos']);
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


  
}
