import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JuegounicoPage } from './juegounico.page';

const routes: Routes = [
  {
    path: '',
    component: JuegounicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegounicoPageRoutingModule {}
