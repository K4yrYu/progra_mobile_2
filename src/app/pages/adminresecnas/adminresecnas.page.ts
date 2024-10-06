import { Component, OnInit } from '@angular/core';
import { ManejodbService } from 'src/app/services/manejodb.service';

@Component({
  selector: 'app-adminresecnas',
  templateUrl: './adminresecnas.page.html',
  styleUrls: ['./adminresecnas.page.scss'],
})
export class AdminresecnasPage implements OnInit {

  arregloUsuarios: any = [
    {
      id_usuario: '',
      rut_usuario: '',
      nombres_usuario: '',
      apellidos_usuario: '',
      username: '',
      clave: '',
      correo: '',
      token_recup_clave: '',
      estado_user: '',
      id_rol: ''
    }
  ]

  constructor(private bd: ManejodbService) { }

  ngOnInit() {
    //verificar si la BD esta disponible
    this.bd.dbState().subscribe(data=>{
      if(data){
        //subscribir al observable de la consulta
        this.bd.fetchUsuarios().subscribe(res=>{
          this.arregloUsuarios = res;
        })
      }
    })
  }



}
