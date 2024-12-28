import { SharedModule } from './../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ClaimsComponent } from './claims.component';
import { ClaimsRoutingModule } from './claims-routing.module';

@NgModule({
  declarations: [
    ClaimsComponent,
    
  ],
  imports: [
    CommonModule,
    ClaimsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  
  providers: [DatePipe],
  bootstrap: [ClaimsComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class ClaimsModule {}
