import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarjuguetePageRoutingModule } from './editarjuguete-routing.module';

import { EditarjuguetePage } from './editarjuguete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarjuguetePageRoutingModule
  ],
  declarations: [EditarjuguetePage]
})
export class EditarjuguetePageModule {}
