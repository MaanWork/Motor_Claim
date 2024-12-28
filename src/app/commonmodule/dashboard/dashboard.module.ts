import { SharedModule } from './../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { BarchartComponent } from './components/charts/barchart/barchart.component';
import { ZincBarchartComponent } from './components/charts/zinc-barchart/zinc-barchart.component';
import { PiechartComponent } from './components/charts/piechart/piechart.component';
import { NgChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    DashboardComponent,
    BarchartComponent,
    ZincBarchartComponent,
    PiechartComponent,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    NgChartsModule,
    

  ],

  providers: [DatePipe],
  bootstrap: [DashboardComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class DashboardModule {}
