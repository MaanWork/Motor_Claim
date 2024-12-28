import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardTableComponent } from './dashboard-table.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardTableRoutingModule {}
