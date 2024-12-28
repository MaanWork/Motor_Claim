import { NotifiyMasterComponent } from './components/masters/notifiy-master/notifiy-master.component';
import { ClaimDeductDetailsComponent } from './components/masters/claim-deduct-details/claim-deduct-details.component';
import { ClaimStatusMasterComponent } from './components/masters/claim-status-master/claim-status-master.component';
import { BankCityMasterComponent } from './components/masters/bank-city-master/bank-city-master.component';
import { VehiclePartsGroupMasterComponent } from './components/masters/vehicle-parts-group-master/vehicle-parts-group-master.component';
import { UsertypeMasterComponent } from './components/masters/usertype-master/usertype-master.component';
import { RoleMasterComponent } from './components/masters/role-master/role-master.component';
import { ProductMasterComponent } from './components/masters/product-master/product-master.component';
import { OccupationMasterComponent } from './components/masters/occupation-master/occupation-master.component';
import { ImgDetectMasterComponent } from './components/masters/img-detect-master/img-detect-master.component';
import { NationalityMasterComponent } from './components/masters/nationality-master/nationality-master.component';
import { CountryMasterComponent } from './components/masters/country-master/country-master.component';
import { LossTypeMasterComponent } from './components/masters/loss-type-master/loss-type-master.component';
import { PartyTypeMasterComponent } from './components/masters/party-type-master/party-type-master.component';
import { VehicleBodyMasterComponent } from './components/masters/vehicle-body-master/vehicle-body-master.component';
import { InsuranceCmpyMasterComponent } from './components/masters/insurance-cmpy-master/insurance-cmpy-master.component';
import { RegionMasterComponent } from './components/masters/region-master/region-master.component';
import { BranchMasterComponent } from './components/masters/branch-master/branch-master.component';
import { GarageMasterComponent } from './components/masters/garage-master/garage-master.component';
import { SurveyorMasterComponent } from './components/masters/surveyor-master/surveyor-master.component';
import { UserListComponent } from './components/loginCreation/user-list/user-list.component';
import { ClaimofficierListComponent } from './components/loginCreation/claimofficier-list/claimofficier-list.component';
import { AdminListComponent } from './components/loginCreation/admin-list/admin-list.component';
import { AdminComponent } from './../components/admin/admin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrencyMasterComponent } from './components/masters/currency-master/currency-master.component';
import { DeductibleMasterComponent } from './components/masters/deductible-master/deductible-master.component';
import { ExchangeMasterComponent } from './components/masters/exchange-master/exchange-master.component';
import { MailMasterComponent } from './components/masters/mail-master/mail-master.component';
import { SmsConfigMasterComponent } from './components/masters/sms-config-master/sms-config-master.component';
import { CityMasterComponent } from './components/masters/city-master/city-master.component';
import { BankMasterComponent } from './components/masters/bank-master/bank-master.component';
import { DocumentMasterComponent } from './components/masters/document-master/document-master.component';
import { BankBranchMasterComponent } from './components/masters/bank-branch-master/bank-branch-master.component';
import { ClaimSubstatusMasterComponent } from './components/masters/claim-substatus-master/claim-substatus-master.component';
import { SurveyorListComponent } from './components/loginCreation/Surveyor/surveyor-list/surveyor-list.component';
import { NewSurveyorDetailsComponent } from './components/loginCreation/Surveyor/new-surveyor-details/new-surveyor-details.component';
import { GarageListComponent } from './components/loginCreation/Garage/garage-list/garage-list.component';
import { NewGarageDetailsComponent } from './components/loginCreation/Garage/new-garage-details/new-garage-details.component';
import { ExchangeComponent } from './components/masters/exchagemasterNew/exchangemaster.component';
import { BankNewMasterComponent } from './components/masters/bank-master/banknewmaster/banknewmaster.component';
import { AdminDetailsComponent } from './components/loginCreation/admin-list/admin-details/admin-details.component';
import { ClaimDetailsComponent } from './components/loginCreation/claimofficier-list/claim-details/claim-details.component';
import { CauseLossMasterComponent } from './components/masters/causeloss/causeloss.component';

const routes: Routes = [

  {
    path: '',
    component: AdminListComponent,
  },

  {
    path: 'ClaimLogin',
    component: ClaimofficierListComponent,
  },
  
  {
    path: 'AdminDetails',
    component: AdminDetailsComponent,
  },
  {
    path: 'ClaimDetails',
    component: ClaimDetailsComponent,
  },
  
  
  {
    path: 'UserLogin',
    component: UserListComponent,
  },
  {
    path: 'SurveyorMaster',
    component: SurveyorMasterComponent,
  },

  {
    path: 'GarageMaster',
    component: GarageMasterComponent,
  },
  {
    path: 'BranchMaster',
    component: BranchMasterComponent,
  },
  {
    path: 'RegionMaster',
    component: RegionMasterComponent,
  },
  {
    path: 'InsuranceMaster',
    component: InsuranceCmpyMasterComponent,
  },
  {
    path: 'CityMaster',
    component: CityMasterComponent,
  },
  {
    path: 'CauseofLoss',
    component: CauseLossMasterComponent,
  },
  {
    path: 'BankMaster',
    component: BankMasterComponent,
  },
  {
    path:'BankNewMaster',
    component:BankNewMasterComponent
  },
  {
    path: 'BankBranchMaster',
    component: BankBranchMasterComponent,
  },
  {
    path: 'VehicleMaster',
    component: VehicleBodyMasterComponent,
  },
  {
    path: 'PartyTypeMaster',
    component: PartyTypeMasterComponent,
  },
  {
    path: 'LossTypeMaster',
    component: LossTypeMasterComponent,
  },
  {
    path: 'CountryMaster',
    component: CountryMasterComponent,
  },
  {
    path: 'CurrencyMaster',
    component: CurrencyMasterComponent,
  },
  {
    path: 'DeductibleMaster',
    component: DeductibleMasterComponent,
  },
  {
    path: 'ExchangeMaster',
    component: ExchangeMasterComponent,
  },
  {
    path: 'ExchangeNewMaster',
    component: ExchangeComponent,
  },
  {
    path: 'MailMaster',
    component: MailMasterComponent,
  },

  {
    path: 'NationalityMaster',
    component: NationalityMasterComponent,
  },
  {
    path: 'ImageMaster',
    component: ImgDetectMasterComponent,
  },
  {
    path: 'DocumentMaster',
    component: DocumentMasterComponent,
  },
  {
    path: 'OccupationMaster',
    component: OccupationMasterComponent,
  },
  {
    path: 'ProductMaster',
    component: ProductMasterComponent,
  },
  {
    path: 'RoleMaster',
    component: RoleMasterComponent,
  },
  {
    path: 'SmsMaster',
    component: SmsConfigMasterComponent,
  },
  {
    path: 'UsertypeMaster',
    component: UsertypeMasterComponent,
  },
  {
    path: 'VehicleParts',
    component: VehiclePartsGroupMasterComponent,
  },
  {
    path: 'BankCityMaster',
    component: BankCityMasterComponent,
  },
  {
    path: 'ClaimStatusMaster',
    component: ClaimStatusMasterComponent,
  },
  {
    path: 'ClaimSubStatusMaster',
    component: ClaimSubstatusMasterComponent,
  },
  {
    path: 'ClaimDeduct',
    component: ClaimDeductDetailsComponent,
  },
  {
    path: 'NotifyMaster',
    component: NotifiyMasterComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
