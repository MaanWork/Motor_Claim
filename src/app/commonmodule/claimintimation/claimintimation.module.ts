import { ClaimintimationComponent } from './claimintimation.component';
import { MaterialModule } from './../../material/material.module';
import { SharedModule } from './../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ClaimintimationRoutingModule } from './claimintimation-routing.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [ClaimintimationComponent],
  imports: [
    CommonModule,
    ClaimintimationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule
  ],

  providers: [ DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [ClaimintimationComponent],
})
export class ClaimintimationModule {}
