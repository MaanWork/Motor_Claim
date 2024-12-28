import { UserListComponent } from './components/loginCreation/user-list/user-list.component';
import { ClaimofficierListComponent } from './components/loginCreation/claimofficier-list/claimofficier-list.component';

import { AdminComponent } from './../components/admin/admin.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminListComponent } from './components/loginCreation/admin-list/admin-list.component';
import { SurveyorMasterComponent } from './components/masters/surveyor-master/surveyor-master.component';
import { GarageMasterComponent } from './components/masters/garage-master/garage-master.component';
import { VehicleBodyMasterComponent } from './components/masters/vehicle-body-master/vehicle-body-master.component';
import { PartyTypeMasterComponent } from './components/masters/party-type-master/party-type-master.component';
import { LossTypeMasterComponent } from './components/masters/loss-type-master/loss-type-master.component';
import { InsuranceCmpyMasterComponent } from './components/masters/insurance-cmpy-master/insurance-cmpy-master.component';
import { BranchMasterComponent } from './components/masters/branch-master/branch-master.component';
import { RegionMasterComponent } from './components/masters/region-master/region-master.component';
import { CountryMasterComponent } from './components/masters/country-master/country-master.component';
import { CurrencyMasterComponent } from './components/masters/currency-master/currency-master.component';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { DeductibleMasterComponent } from './components/masters/deductible-master/deductible-master.component';
import { ExchangeMasterComponent } from './components/masters/exchange-master/exchange-master.component';
import { MailMasterComponent } from './components/masters/mail-master/mail-master.component';
import { NationalityMasterComponent } from './components/masters/nationality-master/nationality-master.component';
import { ImgDetectMasterComponent } from './components/masters/img-detect-master/img-detect-master.component';
import { OccupationMasterComponent } from './components/masters/occupation-master/occupation-master.component';
import { ProductMasterComponent } from './components/masters/product-master/product-master.component';
import { RoleMasterComponent } from './components/masters/role-master/role-master.component';
import { SmsConfigMasterComponent } from './components/masters/sms-config-master/sms-config-master.component';
import { UsertypeMasterComponent } from './components/masters/usertype-master/usertype-master.component';
import { VehiclePartsGroupMasterComponent } from './components/masters/vehicle-parts-group-master/vehicle-parts-group-master.component';
import { BankCityMasterComponent } from './components/masters/bank-city-master/bank-city-master.component';
import { ClaimStatusMasterComponent } from './components/masters/claim-status-master/claim-status-master.component';
import { ClaimDeductDetailsComponent } from './components/masters/claim-deduct-details/claim-deduct-details.component';
import { NotifiyMasterComponent } from './components/masters/notifiy-master/notifiy-master.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { LossTypeDocumentComponent } from './components/modal/loss-type-document/loss-type-document.component';
import { CityMasterComponent } from './components/masters/city-master/city-master.component';
import { AgmCoreModule } from '@agm/core';
import { BankMasterComponent } from './components/masters/bank-master/bank-master.component';
import { DocumentMasterComponent } from './components/masters/document-master/document-master.component';
import { BankBranchMasterComponent } from './components/masters/bank-branch-master/bank-branch-master.component';
import { ClaimSubstatusMasterComponent } from './components/masters/claim-substatus-master/claim-substatus-master.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { PaginatorModule } from 'primeng/paginator';
import { AccordionModule } from 'primeng/accordion';
import { AdminTableComponent } from './tableComponents/admin-table/admin-table.component';
import { ViewStatusComponent } from './components/masters/viewstatus/viewstatus.component';
import { ExchangeComponent } from './components/masters/exchagemasterNew/exchangemaster.component';
import { BankNewMasterComponent } from './components/masters/bank-master/banknewmaster/banknewmaster.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminDetailsComponent } from './components/loginCreation/admin-list/admin-details/admin-details.component';
import { ClaimDetailsComponent } from './components/loginCreation/claimofficier-list/claim-details/claim-details.component';
import { CauseLossMasterComponent } from './components/masters/causeloss/causeloss.component';
@NgModule({
  declarations: [
    AdminComponent,
    AdminListComponent,
    ClaimofficierListComponent,
    UserListComponent,
    SurveyorMasterComponent,
    GarageMasterComponent,
    VehicleBodyMasterComponent,
    PartyTypeMasterComponent,
    LossTypeMasterComponent,
    InsuranceCmpyMasterComponent,
    BranchMasterComponent,
    RegionMasterComponent,
    CountryMasterComponent,
    CurrencyMasterComponent,
    DeductibleMasterComponent,
    ExchangeMasterComponent,
    MailMasterComponent,
    NationalityMasterComponent,
    ImgDetectMasterComponent,
    OccupationMasterComponent,
    ProductMasterComponent,
    RoleMasterComponent,
    SmsConfigMasterComponent,
    UsertypeMasterComponent,
    VehiclePartsGroupMasterComponent,
    BankCityMasterComponent,
    ClaimStatusMasterComponent,
    ClaimDeductDetailsComponent,
    NotifiyMasterComponent,
    LossTypeDocumentComponent,
    CityMasterComponent,
    BankMasterComponent,
    DocumentMasterComponent,
    BankBranchMasterComponent,
    ClaimSubstatusMasterComponent,
    AdminTableComponent,
    ViewStatusComponent,
    ExchangeComponent,
    BankNewMasterComponent,
    AdminDetailsComponent,
    ClaimDetailsComponent,
    CauseLossMasterComponent  

  ],
  imports: [
    CommonModule,
    CKEditorModule,
    AdminRoutingModule,
    FormsModule,
    MatDatepickerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAWc-muafas32QJAjZMQSeu-lxeozEIZFE',
      language: 'en',
      libraries: ['geometry', 'places']
    }),
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    NgxPaginationModule,
    TableModule,
    TabViewModule,
    PaginatorModule,
    AccordionModule,
    NgbModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],

  providers: [DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AdminComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AdminModule {}
