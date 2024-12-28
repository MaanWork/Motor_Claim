import { SharedModule } from './../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { DashboardTableComponent } from './dashboard-table.component';
import { DashboardTableRoutingModule } from './dasboard-table-routing.module';

@NgModule({
    declarations: [
        DashboardTableComponent,
    ],
    imports: [
        CommonModule,
        DashboardTableRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule
    ],
    providers: [DatePipe],
    bootstrap: [DashboardTableComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class DashboardTableModule { }
