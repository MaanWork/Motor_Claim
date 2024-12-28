import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyorComponent } from './surveyor.component';

const routes: Routes = [
  {
    path: '',
    component: SurveyorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyorRoutingModule {}
