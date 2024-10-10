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

  loggin!: any;
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
  usuario: string = "CREATE TABLE IF NOT EXISTS usuario (id_usuario INTEGER PRIMARY KEY autoincrement, rut_usuario VARCHAR(20) NOT NULL, nombres_usuario VARCHAR(100) NOT NULL, apellidos_usuario VARCHAR(100) NOT NULL, username VARCHAR(20) NOT NULL, clave VARCHAR(12) NOT NULL, correo VARCHAR(50) NOT NULL, token_recup_clave BOOLEAN NOT NULL, foto_usuario BLOB, estado_user BOOLEAN NOT NULL, userlogged BOOLEAN NOT NULL ,id_rol INTEGER, FOREIGN KEY (id_rol) REFERENCES rol_usuario(id_rol));";

  //producto
  producto: string = "CREATE TABLE IF NOT EXISTS producto (id_producto INTEGER PRIMARY KEY autoincrement, nombre_prod VARCHAR(50) NOT NULL, precio_prod INTEGER NOT NULL, stock_prod INTEGER NOT NULL, descripcion_prod TEXT NOT NULL, foto_prod BLOB, estatus BOOLEAN, id_categoria INTEGER, FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria));";

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
  rolesusuario1: string = "INSERT OR IGNORE INTO rol_usuario (nombre_rol) VALUES ('administrador');";

  rolesusuario2: string = "INSERT OR IGNORE INTO rol_usuario (nombre_rol) VALUES ('cliente');";

  //insert de 1 usuario 

  //user maestro
  registrousuario: string = "INSERT OR IGNORE INTO usuario (rut_usuario, nombres_usuario, apellidos_usuario, username, clave, correo, token_recup_clave, foto_usuario, estado_user, userlogged, id_rol) VALUES ('12345678-9', 'Juan Ignacio', 'Perez Lopez', 'admin', 'Admin123.', 'vicentepalma1202@gmail.com', 0, null, 1, 0, 1);";


  //usuario cliente  
  registrousuario2: string = "INSERT OR IGNORE INTO usuario (rut_usuario, nombres_usuario, apellidos_usuario, username, clave, correo, token_recup_clave, foto_usuario, estado_user, userlogged, id_rol) VALUES ('19994384-7', 'Alonso', 'Urrutia', 'admin2', 'Admin1234.', 'Amuc23@gmail.com', 0, null, 1, 0, 2);";


  //insert de las categorias de los productos
  categoriasproductos1: string = "INSERT OR IGNORE INTO categoria (nombre_categoria) VALUES ('Juego');";

  categoriasproductos2: string = "INSERT OR IGNORE INTO categoria (nombre_categoria) VALUES('Juguete');";

  categoriasproductos3: string = "INSERT OR IGNORE INTO categoria (nombre_categoria) VALUES('Consola');"


  //--------------------------------------------------------------------------------------------------------

  //var para los registros de un select
  listadoUsuarios = new BehaviorSubject([]);
  listadoUsuarioUnico = new BehaviorSubject([]); //por nombre
  listadoUsuarioConectado = new BehaviorSubject([]);

  //esto para traer los datos del usuario cuando este se logge en el sistema

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
  fetchUsuarios(): Observable<Usuarios[]> {
    return this.listadoUsuarios.asObservable();
  }

  fetchUsuarioUnico(): Observable<Usuarios[]> {
    return this.listadoUsuarioUnico.asObservable();
  }

  fetchUsuarioConectado(): Observable<Usuarios[]> {
    return this.listadoUsuarioConectado.asObservable();
  }

  fetchJuegos(): Observable<Juegos[]> {
    return this.listadoJuegos.asObservable();
  }
  fetchJuegoUnico(): Observable<Juegos[]> {
    return this.listadoJuegoUnico.asObservable();
  }

  fetchJuguetes(): Observable<Juguetes[]> {
    return this.listadoJuguetes.asObservable();
  }
  fetchJuguetesUnico(): Observable<Juguetes[]> {
    return this.listadoJugueteUnico.asObservable();
  }

  fetchConsolas(): Observable<Consolas[]> {
    return this.listadoConsolas.asObservable();
  }
  fetchConsolaUnico(): Observable<Consolas[]> {
    return this.listadoConsolaUnico.asObservable();
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  async crearBD() {
    if (this.dbCreated) return; // Verifica si la base de datos ya fue creada

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'megagames19.db',
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
      }

      // Actualizar la lista de usuarios después de insertar
      this.consultarUsuarios(); // Llamar a consultarUsuarios para refrescar la interfaz
      this.consultarJuegos();
      this.consultarJuguetes();
      this.consultarConsolas();

    } catch (e) {
      this.alertasService.presentAlert("Creación de tabla", "Error creando las tablas: " + JSON.stringify(e));
    }
  }

  ///////////////////////////////CRUD COMPLETO PARA LOS USUARIOS//////////////////////////////////

  //select * de todos los usuarios
  async consultarUsuarios() {
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
            foto_usuario: res.rows.item(i).foto_usuario,
            estado_user: res.rows.item(i).estado_user,
            userlogged: res.rows.item(i).userlogged,
            id_rol: res.rows.item(i).id_rol
          })
        }
      }
      this.listadoUsuarios.next(itemsU as any);
    })
  }



//busca a los usuarios por su username (nombre de usuario)
async consultarUsuariosPorUsername(user: any) {
  return this.database.executeSql('SELECT * FROM usuario WHERE username = ?', [user]).then(res => {
    //variable para almacenar el resultado de la consulta
    let itemsUPP: Usuarios[] = [];
    //verificar si hay registros en la consulta
    if (res.rows.length > 0) {
      //se recorren los resultados
      for (var i = 0; i < res.rows.length; i++) {
        //se agrega el registro a mi variable (itemsU)
        itemsUPP.push({
          id_usuario: res.rows.item(i).id_usuario,
          rut_usuario: res.rows.item(i).rut_usuario,
          nombres_usuario: res.rows.item(i).nombres_usuario,
          apellidos_usuario: res.rows.item(i).apellidos_usuario,
          username: res.rows.item(i).username,
          clave: res.rows.item(i).clave,
          correo: res.rows.item(i).correo,
          token_recup_clave: res.rows.item(i).token_recup_clave,
          foto_usuario: res.rows.item(i).foto_usuario,
          estado_user: res.rows.item(i).estado_user,
          userlogged: res.rows.item(i).userlogged,
          id_rol: res.rows.item(i).id_rol
        })
      }
    }
    this.listadoUsuarioUnico.next(itemsUPP as any);
  })
}

//verifica y valida el login 
async consultarUsuariosLoggin(user: any, clave: any): Promise<boolean> {
  return this.database.executeSql('SELECT * FROM usuario WHERE username = ? AND clave = ?', [user, clave]).then(res => {
    let itemsUL: Usuarios[] = [];
    if (res.rows.length > 0) {
      for (var i = 0; i < res.rows.length; i++) {
        itemsUL.push({
          id_usuario: res.rows.item(i).id_usuario,
          rut_usuario: res.rows.item(i).rut_usuario,
          nombres_usuario: res.rows.item(i).nombres_usuario,
          apellidos_usuario: res.rows.item(i).apellidos_usuario,
          username: res.rows.item(i).username,
          clave: res.rows.item(i).clave,
          correo: res.rows.item(i).correo,
          token_recup_clave: res.rows.item(i).token_recup_clave,
          foto_usuario: res.rows.item(i).foto_usuario,
          estado_user: res.rows.item(i).estado_user,
          userlogged: res.rows.item(i).userlogged,
          id_rol: res.rows.item(i).id_rol
        });
      }
      this.listadoUsuarioUnico.next(itemsUL as any);
      return true; // Usuario encontrado
    } else {
      return false; // No se encontró usuario
    }
  });
}

async consultarUsuariosPorEstado(): Promise<Usuarios[]> {
  return this.database.executeSql('SELECT * FROM usuario WHERE estado_user = 1', []).then(res => {
    let items: Usuarios[] = []; // Asegúrate de que Usuarios sea el tipo correcto

    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        items.push({
          id_usuario: res.rows.item(i).id_usuario,
          rut_usuario: res.rows.item(i).rut_usuario,
          nombres_usuario: res.rows.item(i).nombres_usuario,
          apellidos_usuario: res.rows.item(i).apellidos_usuario,
          username: res.rows.item(i).username,
          clave: res.rows.item(i).clave,
          correo: res.rows.item(i).correo,
          token_recup_clave: res.rows.item(i).token_recup_clave,
          foto_usuario: res.rows.item(i).foto_usuario,
          estado_user: res.rows.item(i).estado_user,
          userlogged: res.rows.item(i).userlogged,
          id_rol: res.rows.item(i).id_rol
        });
      }
    }
    return items; // Retorna el arreglo de usuarios
  }).catch(error => {
    this.alertasService.presentAlert("ERROR","USUARIO NO ENCONTRADO" + error);
    return []; // Retorna un arreglo vacío en caso de error
  });
}

async consultarUsuariosPorEstadoConectado(): Promise<Usuarios[]> {
  return this.database.executeSql('SELECT * FROM usuario WHERE userlogged = 1', []).then(res => {
    let itemsUPEC: Usuarios[] = []; // Asegúrate de que Usuarios sea el tipo correcto

    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        itemsUPEC.push({
          id_usuario: res.rows.item(i).id_usuario,
          rut_usuario: res.rows.item(i).rut_usuario,
          nombres_usuario: res.rows.item(i).nombres_usuario,
          apellidos_usuario: res.rows.item(i).apellidos_usuario,
          username: res.rows.item(i).username,
          clave: res.rows.item(i).clave,
          correo: res.rows.item(i).correo,
          token_recup_clave: res.rows.item(i).token_recup_clave,
          foto_usuario: res.rows.item(i).foto_usuario,
          estado_user: res.rows.item(i).estado_user,
          userlogged: res.rows.item(i).userlogged,
          id_rol: res.rows.item(i).id_rol
        });
      }
      this.listadoUsuarioConectado.next(itemsUPEC as any);
    }
    return itemsUPEC; // Retorna el arreglo de usuarios
  }).catch(error => {
    this.alertasService.presentAlert("ERROR","USUARIO NO ENCONTRADO" + error);
    return []; // Retorna un arreglo vacío en caso de error
  });
}

async cerrarSesion(): Promise<void> {
  return this.database.executeSql('UPDATE usuario SET userlogged = 0 WHERE userlogged = 1', [])
    .then(() => {
      this.alertasService.presentAlert("Sesión Cerrada", "Vuelva pronto");
    })
    .catch(error => {
      this.alertasService.presentAlert("ERROR", 'Error al actualizar el estado de usuario: ' + error);
      throw error; // Rechaza la promesa en caso de error
    });
}


  //valida el uusario loggeado para un autoinicio de sesion
  async actualizarEstadoUsuario(username: any): Promise<void> {
    return this.database.executeSql('UPDATE usuario SET userlogged = ? WHERE username = ?', [1, username])
      .then(() => {
        console.log(`Estado de usuario ${username} actualizado a logged in.`);
      })
      .catch(error => {
        console.error('Error al actualizar el estado de usuario:', error);
      });
  }

  //valida el uusario loggeado para un autoinicio de sesion
  async actualizarEstadoUsuario2(): Promise<void> {
    return this.database.executeSql('UPDATE usuario SET userlogged = ? WHERE userlogged = 1 AND userlogged = 0', [0])
      .then(() => {
        console.log(`usuarios restablecidos.`);
      })
      .catch(error => {
        console.error('Error al actualizar el estado de usuario:', error);
      });
  }

  //verifica que el nombre de usuario no este ocupado por otro usuario al registrarse 
  async verificarUsuarioExistente(username: any): Promise<boolean> {
    return this.database.executeSql('SELECT * FROM usuario WHERE username = ?', [username]).then(res => {
      // Retorna true si hay algún usuario con ese username, false si no hay
      return res.rows.length > 0;
    }).catch(error => {
      return false; // Devuelve false en caso de error
    });
  }

  
  //añadir usuario cliente (REGISTRO)
  async agregarUsuariosCliente(rutU: any, nombresU: any, apellidosU: any, userU: any, claveU: any, correoU: any) {
    // Lógica para agregar usuarios
    return this.database.executeSql('INSERT OR IGNORE INTO usuario (rut_usuario, nombres_usuario, apellidos_usuario, username, clave, correo, token_recup_clave, foto_usuario, estado_user, userlogged, id_rol) VALUES (?, ?, ?, ?, ?, ?, 0, null, 1, 0, 2)', [rutU, nombresU, apellidosU, userU, claveU, correoU]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Agregar", "Usuario Agregado");
      //se llama al select para mostrar la lista actualizada
      this.consultarUsuarios();
    }).catch(e=>{
      this.alertasService.presentAlert("agregar", "Error: " + JSON.stringify(e)); 
  });
  }


  //añadir usuario (panel admin)
  async agregarUsuariosAdmin(rutU: any, nombresU: any, apellidosU: any, userU: any, claveU: any, correoU: any, estadoU: any, id_rolU: any) {
    // Lógica para agregar usuarios
    return this.database.executeSql('INSERT OR IGNORE INTO usuario (rut_usuario, nombres_usuario, apellidos_usuario, username, clave, correo, token_recup_clave, foto_usuario, estado_user, userlogged, id_rol) VALUES (?, ?, ?, ?, ?, ?, 0, null, 1, 0, ?)', [rutU, nombresU, apellidosU, userU, claveU, correoU, estadoU, id_rolU]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Agregar", "Usuario Agregado");
      //se llama al select para mostrar la lista actualizada
      this.consultarUsuarios();
    }).catch(e => {
      this.alertasService.presentAlert("agregar", "Error: " + JSON.stringify(e));
    });
  }


  async modificarUsuarios(idU: any, rutU: any, nombresU: any, apellidosU: any, userU: any, claveU: any, correoU: any, estadoU: any) {
    if (idU === 1) {
      return this.alertasService.presentAlert("ERROR", "NO PUEDE MODIFICARSE AL ADMINISTRADOR PRINCIPAL");
    } else {
      // Lógica para modificar usuarios
      return this.database.executeSql('UPDATE usuario SET rut_usuario = ?, nombres_usuario = ?, apellidos_usuario = ?, username = ?, correo = ?, estado_user = ? WHERE id_usuario = ?', [rutU, nombresU, apellidosU, userU, claveU, correoU, estadoU, idU]).then(res => {
        //se añade la alerta
        this.alertasService.presentAlert("Eliminar", "Usuario modificado");
        //se llama al select para mostrar la lista actualizada
        this.consultarUsuarios();
      }).catch(e => {
        this.alertasService.presentAlert("modificar", "Error: " + JSON.stringify(e));
      })
    };
  }

  async eliminarUsuarios(idU: any) {
    if (idU === 1) {
      return this.alertasService.presentAlert("ERROR", "NO PUEDE ELIMINAR AL ADMINISTRADOR PRINCIPAL");
    } else {
      return this.database.executeSql('DELETE FROM usuario WHERE id_usuario = ?', [idU]).then(res => {
        //se añade la alerta
        this.alertasService.presentAlert("Eliminar", "Usuario eliminado");
        this.consultarUsuarios();
      }).catch(e => {
        this.alertasService.presentAlert("Eliminar", "Error: " + JSON.stringify(e));
      })
    };
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////


  //////////////////////////////crud completo PRODUCTOS//////////////////////////////////////////////

  //OBTENER PRODUCTO POR ID (funcion del producto unico)
  // Método para obtener un producto específico por su ID

  //se realizara un select * para cada producto 
  async consultarJuegoPorId(idjuegoU: any) {
    try {
      const resp = await this.database.executeSql('SELECT id_producto, nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod, estatus, id_categoria FROM producto WHERE id_producto = ?', [idjuegoU]);
      let itemsJU: Juegos[] = [];
      if (resp.rows.length > 0) {
        for (var i = 0; i < resp.rows.length; i++) {
          itemsJU.push({
            id_producto: resp.rows.item(i).id_producto,
            nombre_prod: resp.rows.item(i).nombre_prod,
            precio_prod: resp.rows.item(i).precio_prod,
            stock_prod: resp.rows.item(i).stock_prod,
            descripcion_prod: resp.rows.item(i).descripcion_prod,
            foto_prod: resp.rows.item(i).foto_prod,
            estatus: resp.rows.item(i).estatus,
            id_categoria: resp.rows.item(i).id_categoria
          });
        }
      }
      this.listadoJuegoUnico.next(itemsJU as any);
    } catch (error) {
      console.error("Error al consultar juego por ID:", error);
    }
  }
  

  //-----------------------------------------------------------

  async consultarJuguetePorId(idjugueteU: any) {
    return this.database.executeSql('SELECT * FROM producto WHERE id_producto = ?', [idjugueteU]).then(resp => {
      //variable para almacenar el resultado de la consulta
      let itemsJGTU: Juguetes[] = [];
      //verificar si hay registros en la consulta
      if (resp.rows.length > 0) {
        //se recorren los resultados
        for (var i = 0; i < resp.rows.length; i++) {
          //se agrega el registro a mi variable (itemsU)
          itemsJGTU.push({
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
      this.listadoJugueteUnico.next(itemsJGTU as any);
    })
  }

  //---------------------------------------------------------------------------

  async consultarConsolaPorId(idconsolaU: any) {
    return this.database.executeSql('SELECT * FROM producto WHERE id_producto = ?', [idconsolaU]).then(resp => {
      //variable para almacenar el resultado de la consulta
      let itemsCU: Consolas[] = [];
      //verificar si hay registros en la consulta
      if (resp.rows.length > 0) {
        //se recorren los resultados
        for (var i = 0; i < resp.rows.length; i++) {
          //se agrega el registro a mi variable (itemsU)
          itemsCU.push({
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
      this.listadoConsolaUnico.next(itemsCU as any);
    })
  }

  ////////--JUEGOS
  async consultarJuegos() {
    try {
      const resp = await this.database.executeSql('SELECT id_producto, nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod, estatus, id_categoria FROM producto WHERE id_categoria = 1', []);
      const itemsP: Juegos[] = [];
      if (resp.rows.length > 0) {
        for (let i = 0; i < resp.rows.length; i++) {
          itemsP.push({
            id_producto: resp.rows.item(i).id_producto,
            nombre_prod: resp.rows.item(i).nombre_prod,
            precio_prod: resp.rows.item(i).precio_prod,
            stock_prod: resp.rows.item(i).stock_prod,
            descripcion_prod: resp.rows.item(i).descripcion_prod,
            foto_prod: resp.rows.item(i).foto_prod,
            estatus: resp.rows.item(i).estatus,
            id_categoria: resp.rows.item(i).id_categoria
          });
        }
      }
      this.listadoJuegos.next(itemsP as any);
    } catch (error) {
      console.error("Error al consultar juegos:", error);
    }
  }
  

  async agregarJuegos(nombre_prod: string, precio_prod: number, stock_prod: number, descripcion_prod: string, foto_prod: any) {
    try {
      await this.database.transaction(async (tx) => {
        await tx.executeSql('INSERT OR IGNORE INTO producto (nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod, estatus, id_categoria) VALUES (?,?,?,?,?,1,1);', [nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod]);
      });
      this.alertasService.presentAlert("Agregar", "Juego Agregado");
      this.consultarJuegos();
    } catch (e) {
      this.alertasService.presentAlert("agregar", "Error: " + JSON.stringify(e));
    }
  }
  



  async modificarJuego(idJ: any, nomJ: any, precioJ: any, stockJ: any, descripJ: any, fotoJ: any, estatusJ: any) {
    try {
      await this.database.transaction(async (tx) => {
        await tx.executeSql('UPDATE producto SET nombre_prod = ?, precio_prod = ?, stock_prod = ?, descripcion_prod = ?, foto_prod = ?, estatus = ?, id_categoria = 1 WHERE id_producto = ?', [nomJ, precioJ, stockJ, descripJ, fotoJ, estatusJ, idJ]);
      });
      this.alertasService.presentAlert("Modificar", "Juego Modificado");
      this.consultarJuegos();
    } catch (e) {
      this.alertasService.presentAlert("modificar", "Error: " + JSON.stringify(e));
    }
  }
  

  async eliminarJuegos(idJ: any) {
    try {
      await this.database.transaction(async (tx) => {
        await tx.executeSql('DELETE FROM producto WHERE id_producto = ?', [idJ]);
      });
      this.alertasService.presentAlert("Eliminar", "Juego eliminado");
      this.consultarJuegos();
    } catch (e) {
      this.alertasService.presentAlert("Eliminar", "Error: " + JSON.stringify(e));
      console.error("Error al eliminar juego:", e);
    }
  }
  


  //---------------------------CRUD DE JUGUETES----------------------------------------------
  async consultarJuguetes() {
    return this.database.executeSql('SELECT * FROM producto WHERE id_categoria = 2', []).then(resp => {
      //variable para almacenar el resultado de la consulta
      let itemsJGT: Juguetes[] = [];
      //verificar si hay registros en la consulta
      if (resp.rows.length > 0) {
        //se recorren los resultados
        for (var i = 0; i < resp.rows.length; i++) {
          //se agrega el registro a mi variable 
          itemsJGT.push({
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
      this.listadoJuguetes.next(itemsJGT as any);
    })
  }



  async agregarJuguetes(nombre_prod: string, precio_prod: number, stock_prod: number, descripcion_prod: string, foto_prod: any) {
    // Lógica para agregar juguetes
    return this.database.executeSql('INSERT OR IGNORE INTO producto (nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod, estatus, id_categoria) VALUES (?,?,?,?,?,1,2);', [nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Agregar", "Juguete Agregado");
      //se llama al select para mostrar la lista actualizada
      this.consultarJuguetes();
    }).catch(e => {
      this.alertasService.presentAlert("agregar", "Error: " + JSON.stringify(e));
    });
  }



  async modificarJuguete(idJ: any, nomJ: any, precioJ: any, stockJ: any, descripJ: any, fotoJ: any, estatusJ: any) {
    // Lógica para modificar juguetes
    return this.database.executeSql('UPDATE producto SET nombre_prod = ?, precio_prod = ?, stock_prod = ?, descripcion_prod = ?, foto_prod = ?, estatus = ?, id_categoria = 2 WHERE id_producto = ?', [nomJ, precioJ, stockJ, descripJ, fotoJ, estatusJ, idJ]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Modificar", "juguete Modificado");
      //se llama al select para mostrar la lista actualizada
      this.consultarJuguetes();
    }).catch(e => {
      this.alertasService.presentAlert("modificar", "Error: " + JSON.stringify(e));
    });
  }



  async eliminarJuguete(idJGT: any) {
    return this.database.executeSql('DELETE FROM producto WHERE id_producto = ?', [idJGT]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Eliminar", "Juguete eliminado");
      //se llama al select para mostrar la lista actualizada
      this.consultarJuguetes();
    }).catch(e => {
      this.alertasService.presentAlert("Eliminar", "Error: " + JSON.stringify(e));
    });
  }

  //---------------------------CRUD DE CONSOLAS----------------------------------------------

  async consultarConsolas() {
    return this.database.executeSql('SELECT * FROM producto WHERE id_categoria = 3', []).then(resp => {
      //variable para almacenar el resultado de la consulta
      let itemsC: Consolas[] = [];
      //verificar si hay registros en la consulta
      if (resp.rows.length > 0) {
        //se recorren los resultados
        for (var i = 0; i < resp.rows.length; i++) {
          //se agrega el registro a mi variable 
          itemsC.push({
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
      this.listadoConsolas.next(itemsC as any);
    })
  }



  async agregarConsola(nombre_prod: any, precio_prod: any, stock_prod: any, descripcion_prod: any, foto_prod: any) {
    // Lógica para agregar juguetes
    return this.database.executeSql('INSERT OR IGNORE INTO producto (nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod, estatus, id_categoria) VALUES (?,?,?,?,?,1,3);', [nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Agregar", "Consola Agregada");
      //se llama al select para mostrar la lista actualizada
      this.consultarConsolas();
    }).catch(e => {
      this.alertasService.presentAlert("agregar", "Error: " + JSON.stringify(e));
    });
  }



  async modificarConsola(idJ: any, nomJ: any, precioJ: any, stockJ: any, descripJ: any, fotoJ: any, estatusJ: any) {
    // Lógica para modificar juguetes
    return this.database.executeSql('UPDATE producto SET nombre_prod = ?, precio_prod = ?, stock_prod = ?, descripcion_prod = ?, foto_prod = ?, estatus = ?, id_categoria = 3 WHERE id_producto = ?', [nomJ, precioJ, stockJ, descripJ, fotoJ, estatusJ, idJ]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Modificar", "Consola Modificada");
      //se llama al select para mostrar la lista actualizada
      this.consultarConsolas();
    }).catch(e => {
      this.alertasService.presentAlert("modificar", "Error: " + JSON.stringify(e));
    });
  }



  async eliminarConsola(idCU: any) {
    return this.database.executeSql('DELETE FROM producto WHERE id_producto = ?', [idCU]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Eliminar", "Consola eliminada");
      //se llama al select para mostrar la lista actualizada
      this.consultarConsolas();
    }).catch(e => {
      this.alertasService.presentAlert("Eliminar", "Error: " + JSON.stringify(e));
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////






}
