import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarjuegoPageRoutingModule } from './editarjuego-routing.module';

import { EditarjuegoPage } from './editarjuego.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarjuegoPageRoutingModule
  ],
  declarations: [EditarjuegoPage]
})
export class EditarjuegoPageModule {}
