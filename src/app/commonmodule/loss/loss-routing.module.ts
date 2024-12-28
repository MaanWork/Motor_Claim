import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LossComponent } from './loss.component';

const routes: Routes = [
  {
    path: '',
    component: LossComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LossRoutingModule {}
