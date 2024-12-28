import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GarageComponent } from './garage.component';

const routes: Routes = [
  {
    path: '',
    component: GarageComponent,
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GarageRoutingModule {}
