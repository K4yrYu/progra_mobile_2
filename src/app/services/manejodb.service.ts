import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertasService } from 'src/app/services/alertas.service';
import { Usuarios } from './usuarios';

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
  producto: string = "CREATE TABLE IF NOT EXISTS producto (id_producto INTEGER PRIMARY KEY autoincrement, nombre_prod VARCHAR(50) NOT NULL, precio_prod INTEGER NOT NULL, stock_prod INTEGER NOT NULL, descripcion_prod TEXT NOT NULL, foto_prod BLOB, estatus BOOLEAN, id_categoria INTEGER, FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria));"; //blob para la foto
  
  //venta
  venta: string = "CREATE TABLE IF NOT EXISTS venta (id_venta INTEGER PRIMARY KEY autoincrement, fecha_venta DATE NOT NULL, total INTEGER NOT NULL, id_usuario INTEGER, id_estado INTEGER , FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario), FOREIGN KEY (id_estado) REFERENCES estado(id_estado));";
 
  //detalle
  detalle: string = "CREATE TABLE IF NOT EXISTS detalle (id_detalle INTEGER PRIMARY KEY autoincrement, cantidad_d INTEGER NOT NULL, subtotal INTEGER NOT NULL, estado_retiro BOOLEAN NOT NULL, id_venta INTEGER, id_producto INTEGER, FOREIGN KEY (id_venta) REFERENCES venta(id_venta), FOREIGN KEY (id_producto) REFERENCES producto(id_producto));";
 
  //resecna
  resecna: string = "CREATE TABLE IF NOT EXISTS resecna (id_resecna INTEGER PRIMARY KEY autoincrement, text_resecna TEXT NOT NULL, puntos_resecna INTEGER NOT NULL, foto_resecna BLOB, id_usuario INTEGER, id_producto, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario), FOREIGN KEY (id_producto) REFERENCES producto(id_producto));";
 
  //favoritos(lista de deseos)
  favoritos: string = "CREATE TABLE IF NOT EXISTS favoritos (id_favoritos INTEGER PRIMARY KEY autoincrement, fecha_creacion DATE NOT NULL, id_usuario INTEGER, id_producto, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario), FOREIGN KEY (id_producto) REFERENCES producto(id_producto));"; 


  
  //--------------------------------------------------------------------------------------------------------

  //////////////////////////////////////INSERTS//////////////////////////////////////////////////

  //insert de los roles de usuario
  rolesusuario1: string= "INSERT OR IGNORE INTO rol_usuario (nombre_rol) VALUES ('administrador');";

  rolesusuario2: string= "INSERT OR IGNORE INTO rol_usuario (nombre_rol) VALUES ('cliente');";
  
  //insert de 1 usuario 
  registrousuario: string= "INSERT OR IGNORE INTO usuario (rut_usuario, nombres_usuario, apellidos_usuario, username, clave, correo, token_recup_clave, estado_user, id_rol) VALUES ('12345678-9', 'Juan Ignacio', 'Perez Lopez', 'admin', 'Admin123.', 'juan.perez@example.com', FALSE, TRUE, 1);";

  //insert de las categorias de los productos
  categoriasproductos: string ="INSERT OR IGNORE INTO categoria (nombre_categoria) VALUES ('Juego'), ('Juguete'), ('Consola')";

  //insert de 3 productos diferentes por cada categoria (alonso pongale XD, en la foranea del id es 1=juego 2=juguete 3=consola)


  
  //--------------------------------------------------------------------------------------------------------

  //var para los registros de un select
  listadoUsuarios = new BehaviorSubject([]);

  //var para manipular el estado de la base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertasService: AlertasService) { 
    // No llamamos a crearBD aquí
  }

  //funciones retorno de los observables
  fetchUsuarios(): Observable<Usuarios[]>{
    return this.listadoUsuarios.asObservable();
  }

  dbState(){
    return this.isDBReady.asObservable();
  }

  crearBD() {
    if (this.dbCreated) return; // Verifica si la base de datos ya fue creada

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'megagames5.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.creartablas();
        this.consultarUsuarios();
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

      //se espera (await) a que terminen los insert si es que hay
      await this.database.executeSql(this.rolesusuario1, []);
      await this.database.executeSql(this.rolesusuario2, []);
      await this.database.executeSql(this.registrousuario, []);
      await this.database.executeSql(this.categoriasproductos, []);
    } catch (e) {
      this.alertasService.presentAlert("Creación de tabla", "Error creando las tablas: " + JSON.stringify(e));
    }
  }

  consultarUsuarios(){
    return this.database.executeSql('SELECT * FROM usuario',[]).then(res=>{
      //variable para almacenar el resultado de la consulta
      let itemsU: Usuarios[] = [];
      //verificar si hay registros en la consulta
      if(res.rows.length > 0){
        //se recorren los resultados
        for(var i = 0; i < res.rows.length; i++){
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

  agregarUsuarios(){

  }

  modificarUsuarios(){

  }

  eliminarUsuarios(idU:string){ 
    return this.database.executeSql('DELETE FROM usuario WHERE id_usuario = ?',[idU]).then(res=>{
      //se añade la alerta
      this.alertasService.presentAlert("Eliminar", "Usuario eliminado");
      //se llama al select para mostrar la lista actualizada
      this.consultarUsuarios();
    }).catch(e=>{
      //alerta del error
      this.alertasService.presentAlert("Eliminar", "Error: " + JSON.stringify(e));
    })
  }
}
