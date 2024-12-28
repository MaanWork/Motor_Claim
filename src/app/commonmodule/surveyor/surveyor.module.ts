import { SharedModule } from './../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { SurveyorComponent } from './surveyor.component';
import { SurveyorRoutingModule } from './surveyor-routing.module';


@NgModule({
    declarations: [
        SurveyorComponent,
    ],
    imports: [
        CommonModule,
        SurveyorRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule
    ],
    providers: [DatePipe],
    bootstrap: [SurveyorComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SurveyorModule { }
