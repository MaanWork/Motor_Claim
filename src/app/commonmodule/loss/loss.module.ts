import { SharedModule } from './../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { LossComponent } from './loss.component';
import { LossRoutingModule } from './loss-routing.module';
import { NewLossModalComponent } from './new-loss-modal/new-loss-modal.component';
import { NewPartyModalComponent } from './new-party-modal/new-party-modal.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ClaimStatusTrackingComponent } from './claim-status-tracking/claim-status-tracking.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'
import { PartyDetailComponent } from './components/party-detail/party-detail.component';
import { ClaimAllotModalComponent } from './modal/claim-allot-modal/claim-allot-modal.component';
import { PaymentComponent } from './modal/payment/payment.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LossReservedTransactionModalComponent } from './modal/loss-reserved-transaction-modal/loss-reserved-transaction-modal.component';

@NgModule({
    declarations: [
        LossComponent,
        NewLossModalComponent,
        NewPartyModalComponent,
        ClaimStatusTrackingComponent,
        PartyDetailComponent,
        ClaimAllotModalComponent,
        PaymentComponent,
        LossReservedTransactionModalComponent
    ],
    imports: [
        CommonModule,
        LossRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' }),
        SharedModule,
        NgxPaginationModule
    ],
    providers: [
        DatePipe,
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
    ],
    bootstrap: [LossComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class LossModule { }
