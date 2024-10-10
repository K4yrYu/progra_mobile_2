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
  listadoUsuarioUnico = new BehaviorSubject([]);
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

  crearBD() {
    if (this.dbCreated) return; // Verifica si la base de datos ya fue creada

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'megagames16.db',
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

  consultarUsuariosLoggin(user: any, clave: any): Promise<boolean> {
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

  //valida el uusario loggeado para un autoinicio de sesion
  actualizarEstadoUsuario(username: any): Promise<void> {
    return this.database.executeSql('UPDATE usuario SET userlogged = ? WHERE username = ?', [1, username])
      .then(() => {
        console.log(`Estado de usuario ${username} actualizado a logged in.`);
      })
      .catch(error => {
        console.error('Error al actualizar el estado de usuario:', error);
      });
  }

  //verifica que el nombre de usuario no este ocupado por otro usuario al registrarse 
  verificarUsuarioExistente(username: any): Promise<boolean> {
    return this.database.executeSql('SELECT * FROM usuario WHERE username = ?', [username]).then(res => {
      // Retorna true si hay algún usuario con ese username, false si no hay
      return res.rows.length > 0;
    }).catch(error => {
      console.error('Error al verificar el usuario existente:', error);
      return false; // Devuelve false en caso de error
    });
  }

  cerrarSesion(username: string): Promise<void> {
    return this.database.executeSql('UPDATE usuario SET userlogged = ? WHERE username = ?', [0, username])
      .then(() => {
        console.log(`Estado de usuario ${username} actualizado a logged out.`);
      })
      .catch(error => {
        console.error('Error al actualizar el estado de usuario:', error);
      });
  }

  //añadir usuario cliente (REGISTRO)
  agregarUsuariosCliente(rutU: any, nombresU: any, apellidosU: any, userU: any, claveU: any, correoU: any): Promise<void> {
    // Retornar una promesa para garantizar que la función cumple con el tipo de retorno
    return this.verificarUsuarioExistente(userU).then(existe => {
      if (existe) {
        // Si el usuario ya existe, muestra una alerta
        this.alertasService.presentAlert("Agregar", "El nombre de usuario ya está en uso. Por favor, elige otro.");
        return; // Termina la ejecución de la promesa
      } else {
        // Si el usuario no existe, procede a agregarlo
        return this.database.executeSql('INSERT OR IGNORE INTO usuario (rut_usuario, nombres_usuario, apellidos_usuario, username, clave, correo, token_recup_clave, estado_user, id_rol) VALUES (?, ?, ?, ?, ?, ?, false, true, 2)', [rutU, nombresU, apellidosU, userU, claveU, correoU])
          .then(res => {
            this.alertasService.presentAlert("Agregar", "Usuario agregado exitosamente.");
            this.consultarUsuarios(); // Llama a la función para mostrar la lista actualizada
          }).catch(e => {
            this.alertasService.presentAlert("Agregar", "Error: " + JSON.stringify(e));
          });
      }
    }).catch(error => {
      console.error('Error al verificar la existencia del usuario:', error);
      this.alertasService.presentAlert("Agregar", "Error al verificar el usuario.");
    });
  }


  //añadir usuario (panel admin)
  agregarUsuariosAdmin(rutU: any, nombresU: any, apellidosU: any, userU: any, claveU: any, correoU: any, estadoU: any) {
    // Lógica para agregar usuarios
    return this.database.executeSql('INSERT OR IGNORE INTO usuario (rut_usuario, nombres_usuario, apellidos_usuario, username, clave, correo, token_recup_clave, estado_user, id_rol) VALUES (?, ?, ?, ?, ?, ?, 0, ?, 1)', [rutU, nombresU, apellidosU, userU, claveU, correoU, estadoU]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Agregar", "Usuario Agregado");
      //se llama al select para mostrar la lista actualizada
      this.consultarUsuarios();
    }).catch(e => {
      this.alertasService.presentAlert("agregar", "Error: " + JSON.stringify(e));
    });
  }


  modificarUsuarios(idU: any, rutU: any, nombresU: any, apellidosU: any, userU: any, claveU: any, correoU: any, estadoU: any) {
    if (idU = 1) {
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

  eliminarUsuarios(idU: any) {
    if (idU = 1) {
      return this.alertasService.presentAlert("ERROR", "NO PUEDE ELIMINAR AL ADMINISTRADOR PRINCIPAL");
    } else {
      return this.database.executeSql('DELETE FROM usuario WHERE id_usuario = ?', [idU]).then(res => {
        //se añade la alerta
        this.alertasService.presentAlert("Eliminar", "Usuario eliminado");
        //se llama al select para mostrar la lista actualizada
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
  consultarJuegoPorId(idjuegoU: any) {
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

  //-----------------------------------------------------------

  consultarJuguetePorId(idjugueteU: any) {
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

  consultarConsolaPorId(idconsolaU: any) {
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
  consultarJuegos() {
    return this.database.executeSql('SELECT * FROM producto WHERE id_categoria = 1', []).then(resp => {
      //variable para almacenar el resultado de la consulta
      let itemsP: Juegos[] = [];
      //verificar si hay registros en la consulta
      if (resp.rows.length > 0) {
        //se recorren los resultados
        for (var i = 0; i < resp.rows.length; i++) {
          //se agrega el registro a mi variable 
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



  agregarJuegos(nombre_prod: string, precio_prod: number, stock_prod: number, descripcion_prod: string, foto_prod: any): Promise<void> {
    // Verificar si el juego con ese nombre ya existe
    return this.database.executeSql('SELECT COUNT(*) as count FROM producto WHERE nombre_prod = ?', [nombre_prod])
      .then(res => {
        const nombreExiste = res.rows.item(0).count > 0; // Verifica si el nombre ya existe
  
        if (nombreExiste) {
          this.alertasService.presentAlert("Error", "El juego con ese nombre ya existe.");
          return Promise.reject("El juego ya existe"); // Rechaza la promesa
        }
  
        // Si no existe, procede a agregar el nuevo juego
        return this.database.executeSql('INSERT INTO producto (nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod, estatus, id_categoria) VALUES (?, ?, ?, ?, ?, 1, 1)',
          [nombre_prod, precio_prod, stock_prod, descripcion_prod, foto_prod])
          .then(() => {
            this.alertasService.presentAlert("Agregar", "Juego Agregado");
            this.consultarJuegos();
          })
          .catch(e => {
            this.alertasService.presentAlert("Agregar", "Error al agregar juego");
            return Promise.reject(e);
          });
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }



  modificarJuego(idJ: any, nomJ: any, precioJ: any, stockJ: any, descripJ: any, fotoJ: any, estatusJ: any): Promise<void> {
    // Obtener el nombre actual del producto en la base de datos
    return this.database.executeSql('SELECT nombre_prod FROM producto WHERE id_producto = ?', [idJ])
      .then(res => {
        const nombreActual = res.rows.item(0).nombre_prod; // Nombre actual del producto
  
        // Solo verificar si el nuevo nombre es diferente al actual
        if (nomJ !== nombreActual) {
          return this.database.executeSql('SELECT COUNT(*) as count FROM producto WHERE nombre_prod = ? AND id_producto != ?', [nomJ, idJ])
            .then(res => {
              const nombreExiste = res.rows.item(0).count > 0; // Verifica si el nombre ya existe
  
              if (nombreExiste) {
                // Si existe, muestra alerta y lanza un error
                this.alertasService.presentAlert("Error", "El nombre del juego ya existe. Por favor elige otro nombre.");
                return Promise.reject("Nombre del juego ya existe"); // Utiliza Promise.reject para manejarlo en el componente
              }
              // Si el nombre no existe, retorna una promesa resuelta
              return Promise.resolve();
            });
        } else {
          // Si el nombre no ha cambiado, retorna una promesa resuelta
          return Promise.resolve();
        }
      })
      .then(() => {
        // Modificar el juego, ya sea que el nombre haya cambiado o no
        return this.database.executeSql('UPDATE producto SET nombre_prod = ?, precio_prod = ?, stock_prod = ?, descripcion_prod = ?, foto_prod = ?, estatus = ?, id_categoria = 1 WHERE id_producto = ?', [nomJ, precioJ, stockJ, descripJ, fotoJ, estatusJ, idJ])
          .then(() => {
            this.alertasService.presentAlert("Modificar", "Juego modificado");
            this.consultarJuegos(); // Muestra la lista actualizada
          });
      })
      .catch(e => {
        return Promise.reject(e); // Asegúrate de rechazar la promesa en caso de error
      });
  }



  eliminarJuegos(idJ: any) {
    return this.database.executeSql('DELETE FROM producto WHERE id_producto = ?', [idJ]).then(res => {
      //se añade la alerta
      this.alertasService.presentAlert("Eliminar", "Juego eliminado");
      //se llama al select para mostrar la lista actualizada
      this.consultarJuegos();
    }).catch(e => {
      this.alertasService.presentAlert("Eliminar", "Error: " + JSON.stringify(e));
    });
  }


  //---------------------------CRUD DE JUGUETES----------------------------------------------
  consultarJuguetes() {
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



  agregarJuguetes(nombre_prod: string, precio_prod: number, stock_prod: number, descripcion_prod: string, foto_prod: any) {
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



  modificarJuguete(idJ: any, nomJ: any, precioJ: any, stockJ: any, descripJ: any, fotoJ: any, estatusJ: any) {
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



  eliminarJuguete(idJGT: any) {
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

  consultarConsolas() {
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



  agregarConsola(nombre_prod: any, precio_prod: any, stock_prod: any, descripcion_prod: any, foto_prod: any) {
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



  modificarConsola(idJ: any, nomJ: any, precioJ: any, stockJ: any, descripJ: any, fotoJ: any, estatusJ: any) {
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



  eliminarConsola(idCU: any) {
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
