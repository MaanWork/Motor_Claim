import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { NumbersdotsOnlyDirective } from './directives/numbersdots-only.directive';
import { SortPipe } from './pipes/sort.pipe';
import { SafeHtmlPipe } from './pipes/safe-html-pipe';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { NewnotifiedComponent } from '../components/newnotified/newnotified.component';
import { DataTableComponent } from '../components/data-table/data-table.component';
import { AccidentInfoComponent } from './vehicleinfocomponent/accident-info/accident-info.component';
import { ImageviewModalComponent } from './imageview-modal/imageview-modal.component';
import { CustomerInformationComponent } from './policyinfocomponent/customer-information/customer-information.component';
import { ClaimSummaryComponent } from './lossinfocomponent/claim-summary/claim-summary.component';
import { LossAccidentFileComponent } from './lossinfocomponent/loss-accident-file/loss-accident-file.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BtnFooterComponent } from './btn-footer/btn-footer.component';
import { CustomerInfoComponent } from './vehicleinfocomponent/customer-info/customer-info.component';
import { StatementInfoComponent } from './vehicleinfocomponent/statement-info/statement-info.component';
import { DamageInfoComponent } from './vehicleinfocomponent/damage-info/damage-info.component';
import { ReasonInfoComponent } from './vehicleinfocomponent/reason-info/reason-info.component';
import { DriverInfoComponent } from './vehicleinfocomponent/driver-info/driver-info.component';
import { DocumentInfoComponent } from './vehicleinfocomponent/document-info/document-info.component';
import { LossDocumentFileComponent } from './lossinfocomponent/loss-document-file/loss-document-file.component';
import { LossMapComponent } from './lossinfocomponent/loss-map/loss-map.component';
import { LossDriverDetailsComponent } from './lossinfocomponent/loss-driver-details/loss-driver-details.component';
import { PolicyInformationComponent } from './policyinfocomponent/policy-information/policy-information.component';
import { VehicleInformationComponent } from './policyinfocomponent/vehicle-information/vehicle-information.component';
import { DamageModalComponent } from './lossinfocomponent/damage-modal/damage-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SecondaryLossComponent } from './secondary-loss/secondary-loss.component';
import { SurveyorGridComponent } from './surveyorcomponent/surveyor-grid/surveyor-grid.component';
import { DriverDetailsComponent } from './surveyorcomponent/driver-details/driver-details.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { DocumentReportSheetComponent } from './lossinfocomponent/document-report-sheet/document-report-sheet.component';
import { StatusUpdateComponent } from './lossinfocomponent/status-update/status-update.component';
import { TPLBodyInjuryComponent } from './subLosses/tplbody-injury/tplbody-injury.component';
import { TotalLossByAccidentComponent } from './subLosses/total-loss-by-accident/total-loss-by-accident.component';
import { TotalLossByTheftComponent } from './subLosses/total-loss-by-theft/total-loss-by-theft.component';
import { TotalLossByFireComponent } from './subLosses/total-loss-by-fire/total-loss-by-fire.component';
import { TPLDeathComponent } from './subLosses/tpldeath/tpldeath.component';
import { TPLPropertyDamageComponent } from './subLosses/tplproperty-damage/tplproperty-damage.component';
import { TotalTheftComponent } from './subLosses/total-theft/total-theft.component';
import { LossDmagePartsComponent } from './lossinfocomponent/loss-dmage-parts/loss-dmage-parts.component';
import { AllotedGaragesComponent } from './GarageComponent/alloted-garages/alloted-garages.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LoaderComponent } from './loader/loader.component';
import { AccidentDetailsComponent } from './claimintimationForms/accident-details/accident-details.component';
import { StatementInformationComponent } from './claimintimationForms/statement-information/statement-information.component';
import { DamageDetailsComponent } from './claimintimationForms/damage-details/damage-details.component';
import { ReasonInformationComponent } from './claimintimationForms/reason-information/reason-information.component';
import { DocumentInformationComponent } from './claimintimationForms/document-information/document-information.component';
import { CustomerDetailsComponent } from './claimintimationForms/customer-details/customer-details.component';
import { DriversDetailsComponent } from './claimintimationForms/drivers-details/drivers-details.component';
import { PolicySearchComponent } from './claimintimationForms/policy-search/policy-search.component';
import { ModalComponent } from '../commonmodule/dashboard-table/modal/modal.component';
import { DataInfoTableComponent } from './table-grid/data-info-table/data-info-table.component';
import { ClaimintimateGridComponent } from '../components/claimintimate-grid/claimintimate-grid.component';
import { DataTableOneComponent } from './table-grid/data-table-one/data-table-one.component';
import { CountrynamePipe } from './pipes/countryname.pipe';
import { LosstypenamePipe } from './pipes/losstypename.pipe';
import { DataTableTwoComponent } from './table-grid/data-table-two/data-table-two.component';
import { BranchbynamePipe } from './pipes/branchbyname.pipe';
import { LossSelectionComponent } from './loss-selection/loss-selection.component';
import { InnerTableComponent } from './table-grid/data-table-two/inner-table/inner-table.component';
import { LossModalComponent } from './loss-modal/loss-modal.component';
import { WaveOffModalComponent } from './lossinfocomponent/wave-off-modal/wave-off-modal.component';
import { LossSurveyorDocumentFileComponent } from './lossinfocomponent/loss-surveyor-document-file/loss-surveyor-document-file.component';
import { LossDocumentAiModalComponent } from './lossinfocomponent/loss-document-ai-modal/loss-document-ai-modal.component';
import { DragDropDirective } from './directives/drag-drop.directive';
import { StatusTrackComponent } from './statusTrackComponent/status-track.component';
import { TimelineModule } from 'primeng/timeline';
import { StatenamePipe } from './pipes/statename.pipe';
import { ReserveModalComponent } from './reserve-modal/reserve-modal.component';
import { Commaseparator } from './pipes/commaseparator.pipe';
import { ClaimIntimateCustomerGridComponent } from './claimintimateCustomer/claimintimate-grid/claimintimate-grid.component';
import { ExcessModalComponent } from './excess-modal/excess-modal.component';
import { LossReportComponent } from './subLosses/lossReport/lossReport.component';


@NgModule({
  declarations: [
    NumbersOnlyDirective,
    NumbersdotsOnlyDirective,
    DragDropDirective,
    SortPipe,
    SafeHtmlPipe,
    SearchFilterPipe,
    Commaseparator,
    NewnotifiedComponent,
    DataTableComponent,
    CustomerInfoComponent,
    AccidentInfoComponent,
    StatementInfoComponent,
    DamageInfoComponent,
    ReasonInfoComponent,
    DriverInfoComponent,
    DocumentInfoComponent,
    ImageviewModalComponent,
    CustomerInformationComponent,
    PolicyInformationComponent,
    VehicleInformationComponent,
    ClaimSummaryComponent,
    CountrynamePipe,
    LossAccidentFileComponent,
    LossDocumentFileComponent,
    LossMapComponent,
    LossDriverDetailsComponent,
    BtnFooterComponent,
    DamageModalComponent,
    SecondaryLossComponent,
    SurveyorGridComponent,
    DriverDetailsComponent,
    DateFormatPipe,
    DocumentReportSheetComponent,
    StatusUpdateComponent,
    TotalLossByAccidentComponent,
    TotalLossByTheftComponent,
    TotalLossByFireComponent,
    TPLBodyInjuryComponent,
    TPLDeathComponent,
    LossReportComponent,
    TPLPropertyDamageComponent,
    TotalTheftComponent,
    LossDmagePartsComponent,
    AllotedGaragesComponent,
    LoaderComponent,
    CustomerDetailsComponent,
    AccidentDetailsComponent,
    StatementInformationComponent,
    DamageDetailsComponent,
    ReasonInformationComponent,
    DriversDetailsComponent,
    DocumentInformationComponent,
    PolicySearchComponent,
    ModalComponent,
    DataInfoTableComponent,
    ClaimintimateGridComponent,
    DataTableOneComponent,
    LosstypenamePipe,
    BranchbynamePipe,
    StatenamePipe,
    LossSelectionComponent,
    DataTableTwoComponent,
    InnerTableComponent,
    LossModalComponent,
    WaveOffModalComponent,
    LossSurveyorDocumentFileComponent,
    LossDocumentAiModalComponent,
    StatusTrackComponent,
    ReserveModalComponent,
    ExcessModalComponent,
    ClaimIntimateCustomerGridComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAWc-muafas32QJAjZMQSeu-lxeozEIZFE',
      language: 'en',
      libraries: ['geometry', 'places']
    }),
    NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' }),
    AmazingTimePickerModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TimelineModule

  ],
  exports: [
    NumbersOnlyDirective,
    NumbersdotsOnlyDirective,
    DragDropDirective,
    SortPipe,
    SafeHtmlPipe,
    SearchFilterPipe,
    Commaseparator,
    NewnotifiedComponent,
    DataTableComponent,
    CustomerInfoComponent,
    AccidentInfoComponent,
    StatementInfoComponent,
    DamageInfoComponent,
    ReasonInfoComponent,
    DriverInfoComponent,
    DocumentInfoComponent,
    ImageviewModalComponent,
    CustomerInformationComponent,
    PolicyInformationComponent,
    VehicleInformationComponent,
    ClaimSummaryComponent,
    CountrynamePipe,
    LossAccidentFileComponent,
    LossDocumentFileComponent,
    LossMapComponent,
    LossDriverDetailsComponent,
    BtnFooterComponent,
    DamageModalComponent,
    ReserveModalComponent,
    ExcessModalComponent,
    SecondaryLossComponent,
    SurveyorGridComponent,
    DriverDetailsComponent,
    StatusUpdateComponent,
    TotalLossByAccidentComponent,
    TotalLossByTheftComponent,
    TotalLossByFireComponent,
    TPLBodyInjuryComponent,
    TPLDeathComponent,
    LossReportComponent,
    TPLPropertyDamageComponent,
    TotalTheftComponent,
    LossDmagePartsComponent,
    AllotedGaragesComponent,
    LoaderComponent,
    CustomerDetailsComponent,
    AccidentDetailsComponent,
    StatementInformationComponent,
    DamageDetailsComponent,
    ReasonInformationComponent,
    DriversDetailsComponent,
    DocumentInformationComponent,
    PolicySearchComponent,
    ModalComponent,
    DataInfoTableComponent,
    ClaimintimateGridComponent,
    DataTableOneComponent,
    DateFormatPipe,
    LosstypenamePipe,
    BranchbynamePipe,
    StatenamePipe,
    LossSelectionComponent,
    DataTableTwoComponent,
    InnerTableComponent,
    LossModalComponent,
    WaveOffModalComponent,
    LossDocumentAiModalComponent,
    ClaimIntimateCustomerGridComponent
    ],

  providers:[
    {provide:MatDialogRef , useValue:{} },

    { provide: MAT_DIALOG_DATA, useValue: {} }
  ],

})
export class SharedModule { }
