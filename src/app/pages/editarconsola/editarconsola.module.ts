import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarconsolaPageRoutingModule } from './editarconsola-routing.module';

import { EditarconsolaPage } from './editarconsola.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarconsolaPageRoutingModule
  ],
  declarations: [EditarconsolaPage]
})
export class EditarconsolaPageModule {}
