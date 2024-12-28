import { SharedModule } from './../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { GarageRoutingModule } from './garage-routing.module';
import { GarageComponent } from './garage.component';
import { GarageInformationComponent } from './components/garage-information/garage-information.component';
import { GarageTermsConditionsComponent } from './modal/garage-terms-conditions/garage-terms-conditions.component';

@NgModule({
  declarations: [
    GarageComponent,
    GarageInformationComponent,
    GarageTermsConditionsComponent,

  ],
  imports: [
    CommonModule,
    GarageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],

  providers: [DatePipe],
  bootstrap: [GarageComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class GarageModule {}
