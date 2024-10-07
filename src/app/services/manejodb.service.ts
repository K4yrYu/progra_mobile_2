import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertasService } from 'src/app/services/alertas.service';
import { Usuarios } from './usuarios';
import { Productos } from './productos';
import { Juegos } from './juegos';
import { Juguetes } from './juguetes';
import { Consolas } from './consolas';

@Injectable({
  providedIn: 'root'
})
export class ManejodbService {

  public database!: SQLiteObject;
  private dbCreated: boolean = false; // Propiedad para rastrear si la BD ya fue creada

  ////////////////////////////////// Creación de las tablas///////////////////////////

  //rol del usuario
  rol_usuario: string = "CREATE TABLE IF NOT EXISTS rol_usuario (id_rol INTEGER PRIMARY KEY autoincrement, nombre_rol VARCHAR(50) NOT NULL);";

  //estado(venta)
  estado: string = "CREATE TABLE IF NOT EXISTS estado (id_estado INTEGER PRIMARY KEY autoincrement, nombre VARCHAR(100) NOT NULL);";

  //categoria
  categoria: string = "CREATE TABLE IF NOT EXISTS categoria (id_categoria INTEGER PRIMARY KEY autoincrement, nombre_categoria TEXT NOT NULL);";

  //Usuario
  usuario: string = "CREATE TABLE IF NOT EXISTS usuario (id_usuario INTEGER PRIMARY KEY autoincrement, rut_usuario VARCHAR(20) NOT NULL, nombres_usuario VARCHAR(100) NOT NULL, apellidos_usuario VARCHAR(100) NOT NULL, username VARCHAR(20) NOT NULL, clave VARCHAR(12) NOT NULL, correo VARCHAR(50) NOT NULL, token_recup_clave BOOLEAN NOT NULL, estado_user BOOLEAN NOT NULL, id_rol INTEGER, FOREIGN KEY (id_rol) REFERENCES rol_usuario(id_rol));";
   
  //producto
  producto: string = "CREATE TABLE IF NOT EXISTS producto (id_producto INTEGER PRIMARY KEY autoincrement, nombre_prod VARCHAR(50) NOT NULL, precio_prod INTEGER NOT NULL, stock_prod INTEGER NOT NULL, descripcion_prod TEXT NOT NULL, foto_prod VARCHAR(50), estatus BOOLEAN, id_categoria INTEGER, FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria));"; //blob para la foto (TEMPORALMENTE CON VARCHAR)
  
  //venta
  venta: string = "CREATE TABLE IF NOT EXISTS venta (id_venta INTEGER PRIMARY KEY autoincrement, fecha_venta DATE NOT NULL, total INTEGER NOT NULL, id_usuario INTEGER, id_estado INTEGER , FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario), FOREIGN KEY (id_estado) REFERENCES estado(id_estado));";
 
  //detalle
  detalle: string = "CREATE TABLE IF NOT EXISTS detalle (id_detalle INTEGER PRIMARY KEY autoincrement, cantidad_d INTEGER NOT NULL, subtotal INTEGER NOT NULL, estado_retiro BOOLEAN NOT NULL, id_venta INTEGER, id_producto INTEGER, FOREIGN KEY (id_venta) REFERENCES venta(id_venta), FOREIGN KEY (id_producto) REFERENCES producto(id_producto));";
 
  //reseña
  resecna: string = "CREATE TABLE IF NOT EXISTS resecna (id_resecna INTEGER PRIMARY KEY autoincrement, text_resecna TEXT NOT NULL, puntos_resecna INTEGER NOT NULL, foto_resecna BLOB, id_usuario INTEGER, id_producto INTEGER, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario), FOREIGN KEY (id_producto) REFERENCES producto(id_producto));";
 
  //favoritos(lista de deseos)
  favoritos: string = "CREATE TABLE IF NOT EXISTS favoritos (id_favoritos INTEGER PRIMARY KEY autoincrement, fecha_creacion DATE NOT NULL, id_usuario INTEGER, id_producto INTEGER, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario), FOREIGN KEY (id_producto) REFERENCES producto(id_producto));"; 

  //--------------------------------------------------------------------------------------------------------

  //////////////////////////////////////INSERTS//////////////////////////////////////////////////

  //insert de los roles de usuario
  rolesusuario1: string= "INSERT OR IGNORE INTO rol_usuario (nombre_rol) VALUES ('administrador');";

  rolesusuario2: string= "INSERT OR IGNORE INTO rol_usuario (nombre_rol) VALUES ('cliente');";
  
  //insert de 1 usuario 
  registrousuario: string= "INSERT OR IGNORE INTO usuario (rut_usuario, nombres_usuario, apellidos_usuario, username, clave, correo, token_recup_clave, estado_user, id_rol) VALUES ('12345678-9', 'Juan Ignacio', 'Perez Lopez', 'admin', 'Admin123.', 'juan.perez@example.com', FALSE, TRUE, 1);";

  registrousuario2: string="INSERT OR IGNORE INTO usuario (rut_usuario, nombres_usuario, apellidos_usuario, username, clave, correo, token_recup_clave, estado_user, id_rol) VALUES ('19994384-7', 'Alonso', 'Urrutia', 'admin', 'Admin1234.', 'Amuc23@gmail.com', FALSE, TRUE, 2);";
  
  //insert de las categorias de los productos
  categoriasproductos1: string ="INSERT OR IGNORE INTO categoria (nombre_categoria) VALUES ('Juego');";

  categoriasproductos2: string ="INSERT OR IGNORE INTO categoria (nombre_categoria) VALUES('Juguete');";

  categoriasproductos3: string ="INSERT OR IGNORE INTO categoria (nombre_categoria) VALUES('Consola');";

  //insert de los diferentes productos
  // Insert 1
registrojuego1= "INSERT INTO producto (nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod, estatus, id_categoria) VALUES ('The Legend of Zelda: Breath of the Wild', 60000, 30, 'Explora el vasto mundo de Hyrule en una épica aventura.', 'zelda_breath.png', 1, 1);";

// Insert 2
registrojuego2= "INSERT INTO producto (nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod, estatus, id_categoria) VALUES ('Super Mario Odyssey', 50000, 25, 'Únete a Mario en una odisea por diferentes mundos.', 'mario_odyssey.png', 1, 1);";

// Insert 3
registrojuego3= "INSERT INTO producto (nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod, estatus, id_categoria) VALUES ('Animal Crossing: New Horizons', 45000, 40, 'Crea tu propia isla paradisíaca en este relajante simulador de vida.', 'animal_crossing.png', 1, 1);";

  
  //--------------------------------------------------------------------------------------------------------

  //var para los registros de un select
  listadoUsuarios = new BehaviorSubject([]);

  //select juegos + juwgo unico
  listadoJuegos = new BehaviorSubject([]);
  listadoJuegoUnico = new BehaviorSubject([]);

  //select cjuguete + juguete unico
  listadoJuguetes = new BehaviorSubject([]);
  listadoJugueteUnico = new BehaviorSubject([]);

  //select consola + consola unica
  listadoConsolas = new BehaviorSubject([]);
  listadoConsolaUnico = new BehaviorSubject([]);

  //var para manipular el estado de la base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertasService: AlertasService) { 
    // No llamamos a crearBD aquí
  }

  //funciones retorno de los observables
  fetchUsuarios(): Observable<Usuarios[]>{
    return this.listadoUsuarios.asObservable();
  }

  fetchJuegos(): Observable<Juegos[]>{
    return this.listadoJuegos.asObservable();
  }
  fetchJuegoUnico(): Observable<Juegos[]>{
    return this.listadoJuegoUnico.asObservable();
  }

  dbState(){
    return this.isDBReady.asObservable();
  }

  crearBD() {
    if (this.dbCreated) return; // Verifica si la base de datos ya fue creada

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'megagames14.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.creartablas();
        this.alertasService.presentAlert("Creación de BD", "Base de datos creada con éxito."); // Alerta de éxito
        this.isDBReady.next(true);
        this.dbCreated = true; // Marca que la base de datos fue creada
      }).catch(e => {
        this.alertasService.presentAlert("Creación de BD", "Error creando la BD: " + JSON.stringify(e)); // Alerta de error
      });
    });
  }

  async creartablas() {
    try {
      //se espera a que se terminen de generar las respectivas tablas
      await this.database.executeSql(this.rol_usuario, []);
      await this.database.executeSql(this.estado, []);
      await this.database.executeSql(this.categoria, []);
      await this.database.executeSql(this.usuario, []);
      await this.database.executeSql(this.producto, []);
      await this.database.executeSql(this.venta, []);
      await this.database.executeSql(this.detalle, []);
      await this.database.executeSql(this.resecna, []);
      await this.database.executeSql(this.favoritos, []);

      // Verificar si ya existe el usuario 'admin'
      const res = await this.database.executeSql('SELECT * FROM usuario WHERE username = "admin"', []);
      if (res.rows.length === 0) { // Solo insertar si no existe
        await this.database.executeSql(this.rolesusuario1, []);
        await this.database.executeSql(this.rolesusuario2, []);
        await this.database.executeSql(this.registrousuario, []);
        await this.database.executeSql(this.registrousuario2, []);
        await this.database.executeSql(this.categoriasproductos1, []);
        await this.database.executeSql(this.categoriasproductos2, []);
        await this.database.executeSql(this.categoriasproductos3, []);
        await this.database.executeSql(this.registrojuego1, []);
        await this.database.executeSql(this.registrojuego2, []);
        await this.database.executeSql(this.registrojuego3, []);
      }

      // Actualizar la lista de usuarios después de insertar
      this.consultarUsuarios(); // Llamar a consultarUsuarios para refrescar la interfaz
      this.consultarJuegos();

    } catch (e) {
      this.alertasService.presentAlert("Creación de tabla", "Error creando las tablas: " + JSON.stringify(e));
    }
  }

  ///////////////////////////////CRUD COMPLETO PARA LOS USUARIOS//////////////////////////////////

  consultarUsuarios() {
    return this.database.executeSql('SELECT * FROM usuario', []).then(res => {
      //variable para almacenar el resultado de la consulta
      let itemsU: Usuarios[] = [];
      //verificar si hay registros en la consulta
      if (res.rows.length > 0) {
        //se recorren los resultados
        for (var i = 0; i < res.rows.length; i++) {
          //se agrega el registro a mi variable (itemsU)
          itemsU.push({
            id_usuario: res.rows.item(i).id_usuario,
            rut_usuario: res.rows.item(i).rut_usuario,
            nombres_usuario: res.rows.item(i).nombres_usuario,
            apellidos_usuario: res.rows.item(i).apellidos_usuario,
            username: res.rows.item(i).username,
            clave: res.rows.item(i).clave,
            correo: res.rows.item(i).correo,
            token_recup_clave: res.rows.item(i).token_recup_clave,
            estado_user: res.rows.item(i).estado_user,
            id_rol: res.rows.item(i).id_rol
          })
        }
      }
      this.listadoUsuarios.next(itemsU as any);
    })
  }

  //añadir usuario cliente
  agregarUsuariosCliente(rutU: string, nombresU: string, apellidosU: string, userU: string, claveU: string, correoU: string) {
    // Lógica para agregar usuarios
    return this.database.executeSql('INSERT OR IGNORE INTO usuario (rut_usuario, nombres_usuario, apellidos_usuario, username, clave, correo, token_recup_clave, estado_user, id_rol) VALUES (?, ?, ?, ?, ?, ?, false, true, 2)', [rutU, nombresU, apellidosU, userU, claveU, correoU]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Agregar", "Usuario Agregado");
      //se llama al select para mostrar la lista actualizada
      this.consultarUsuarios();
    }).catch(e=>{
      this.alertasService.presentAlert("agregar", "Error: " + JSON.stringify(e)); 
  });
  }


  //añadir usuario Admin
  agregarUsuariosAdmin(rutU: string, nombresU: string, apellidosU: string, userU: string, claveU: string, correoU: string) {
    // Lógica para agregar usuarios
    return this.database.executeSql('INSERT OR IGNORE INTO usuario (rut_usuario, nombres_usuario, apellidos_usuario, username, clave, correo, token_recup_clave, estado_user, id_rol) VALUES (?, ?, ?, ?, ?, ?, false, true, 1)', [rutU, nombresU, apellidosU, userU, claveU, correoU]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Agregar", "Usuario Agregado");
      //se llama al select para mostrar la lista actualizada
      this.consultarUsuarios();
    }).catch(e=>{
      this.alertasService.presentAlert("agregar", "Error: " + JSON.stringify(e)); 
  });
  }


  modificarUsuarios(idU: string, rutU: string, nombresU: string, apellidosU: string, userU: string, claveU: string, correoU: string, estadoU: boolean) {
    // Lógica para modificar usuarios
    return this.database.executeSql('UPDATE usuario SET rut_usuario = ?, nombres_usuario = ?, apellidos_usuario = ?, username = ?, clave = ?, correo = ?, estado_user = ? WHERE id_usuario = ?', [rutU, nombresU, apellidosU, userU, claveU, correoU, estadoU, idU]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Eliminar", "Usuario modificado");
      //se llama al select para mostrar la lista actualizada
      this.consultarUsuarios();
    }).catch(e=>{
      this.alertasService.presentAlert("modificar", "Error: " + JSON.stringify(e)); 
  });
  }

  eliminarUsuarios(idU: string) {
    return this.database.executeSql('DELETE FROM usuario WHERE id_usuario = ?', [idU]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Eliminar", "Usuario eliminado");
      //se llama al select para mostrar la lista actualizada
      this.consultarUsuarios();
    }).catch(e=>{
        this.alertasService.presentAlert("Eliminar", "Error: " + JSON.stringify(e)); 
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////


  //////////////////////////////crud completo PRODUCTOS//////////////////////////////////////////////
  
  //OBTENER PRODUCTO POR ID (funcion del producto unico)
  // Método para obtener un producto específico por su ID
  

  //se realizara un select * para cada producto 
  consultarJuegoPorId(idjuegoU: any){
    return this.database.executeSql('SELECT * FROM producto WHERE id_producto = ?', [idjuegoU]).then(resp => {
      //variable para almacenar el resultado de la consulta
      let itemsJU: Juegos[] = [];
      //verificar si hay registros en la consulta
      if (resp.rows.length > 0) {
        //se recorren los resultados
        for (var i = 0; i < resp.rows.length; i++) {
          //se agrega el registro a mi variable (itemsU)
          itemsJU.push({
            id_producto: resp.rows.item(i).id_producto, 
            nombre_prod: resp.rows.item(i).nombre_prod, 
            precio_prod: resp.rows.item(i).precio_prod,  
            stock_prod: resp.rows.item(i).stock_prod,  
            descripcion_prod: resp.rows.item(i).descripcion_prod,  
            foto_prod: resp.rows.item(i).foto_prod, 
            estatus: resp.rows.item(i).estatus, 
            id_categoria: resp.rows.item(i).id_categoria
          })
        }
      }
      this.listadoJuegoUnico.next(itemsJU as any);
    })
  }

  ////////--JUEGOS
  consultarJuegos(){
    return this.database.executeSql('SELECT * FROM producto WHERE id_categoria = 1', []).then(resp => {
      //variable para almacenar el resultado de la consulta
      let itemsP: Juegos[] = [];
      //verificar si hay registros en la consulta
      if (resp.rows.length > 0) {
        //se recorren los resultados
        for (var i = 0; i < resp.rows.length; i++) {
          //se agrega el registro a mi variable (itemsU)
          itemsP.push({
            id_producto: resp.rows.item(i).id_producto, 
            nombre_prod: resp.rows.item(i).nombre_prod, 
            precio_prod: resp.rows.item(i).precio_prod,  
            stock_prod: resp.rows.item(i).stock_prod,  
            descripcion_prod: resp.rows.item(i).descripcion_prod,  
            foto_prod: resp.rows.item(i).foto_prod, 
            estatus: resp.rows.item(i).estatus, 
            id_categoria: resp.rows.item(i).id_categoria
          })
        }
      }
      this.listadoJuegos.next(itemsP as any);
    })
  }



  agregarJuegos(nombre_prod: string, precio_prod:number, stock_prod: number, descripcion_prod: string, foto_prod: string) {
    // Lógica para agregar usuarios
    return this.database.executeSql('INSERT OR IGNORE INTO producto (nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod, estatus, id_categoria) VALUES (?,?,?,?,?,1,1);', [nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Agregar", "Juego Agregado");
      //se llama al select para mostrar la lista actualizada
      this.consultarJuegos();
    }).catch(e=>{
      this.alertasService.presentAlert("agregar", "Error: " + JSON.stringify(e)); 
  });
  }



  modificarJuego(idJ: any, nomJ: any, precioJ: any, stockJ: any, descripJ: any, fotoJ: any, estatusJ: any) {
    // Lógica para modificar usuarios
    return this.database.executeSql('UPDATE producto SET nombre_prod = ?, precio_prod = ?, stock_prod = ?, descripcion_prod = ?, foto_prod = ?, estatus = ?, id_categoria = 1 WHERE id_producto = ?', [nomJ, precioJ, stockJ, descripJ, fotoJ, estatusJ, idJ]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Modifciar", "juego Modificado");
      //se llama al select para mostrar la lista actualizada
      this.consultarJuegos();
    }).catch(e=>{
      this.alertasService.presentAlert("modificar", "Error: " + JSON.stringify(e)); 
  });
  }



  eliminarJuegos(idJ: string) {
    return this.database.executeSql('DELETE FROM producto WHERE id_producto = ?', [idJ]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Eliminar", "Juego eliminado");
      //se llama al select para mostrar la lista actualizada
      this.consultarJuegos();
    }).catch(e=>{
        this.alertasService.presentAlert("Eliminar", "Error: " + JSON.stringify(e)); 
    });
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////


  



}
