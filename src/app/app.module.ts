import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LogingarageComponent } from './components/logingarage/logingarage.component';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {
  MultilevelMenuService,
  NgMaterialMultilevelMenuModule,
  ɵb,
} from "ng-material-multilevel-menu";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { AuthService } from './shared/services/auth/auth.service';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorService } from './shared/services/errors/error.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PendingAuthLetterComponent } from './commonmodule/lop/pending-auth-letter/pending-auth-letter.component';
import { LoginAssessorComponent } from './components/login-assessor/login-assessor.component';
import { LoginMenuComponent } from './components/login-menu/login-menu.component';
import { HttpInterceptorService } from 'src/HttpInterceptors/http-interceptor.service';
import { BranchModalComponent } from './components/branch-modal/branch-modal.component';
import { SessionRedirectComponent } from './components/session-redirect/session-redirect.component';
import { PaymentDetailsComponent } from './components/payment/payment-details/payment-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClaimsComponent } from './admin/claims/claims.component';
import { NewGarageDetailsComponent } from './admin/components/loginCreation/Garage/new-garage-details/new-garage-details.component';
import { SearchComponent } from './admin/search/search.component';
import { GarageListComponent } from './admin/components/loginCreation/Garage/garage-list/garage-list.component';
import { SurveyorListComponent } from './admin/components/loginCreation/Surveyor/surveyor-list/surveyor-list.component';
import { NewSurveyorDetailsComponent } from './admin/components/loginCreation/Surveyor/new-surveyor-details/new-surveyor-details.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { PolicySearchDetailsComponent } from './shared/claimintimateCustomer/policySearchDetails/policy-search-details.component';
import { ClaimIntimateDetailsComponent } from './shared/claimintimateCustomer/claim-intimate-details/claim-intimate-details.component';
import { LoginCheckClaimComponent } from './components/login-check-claim/login-check-claim.component';
import { SearchClaimDetailsComponent } from './components/search-claim-details/search-claim-details.component';
import { PersonalQuoteDetailsComponent } from './demo/components/quotation/quotation-plan/personal-quote-details/personal-quote-details.component';
import { ClaimSearchComponent } from './components/claim-search/claim-search.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LogingarageComponent,
    LoginCheckClaimComponent,
    GarageListComponent,
    ChangePasswordComponent,
    NavbarComponent,
    AdminLayoutComponent,
    PendingAuthLetterComponent,
    LoginLayoutComponent,
    HomeLayoutComponent,
    ForgotPasswordComponent,
    LoginAssessorComponent,
    LoginMenuComponent,
    BranchModalComponent,
    SessionRedirectComponent,
    PaymentDetailsComponent,
    ClaimsComponent,
    SearchComponent,
    SurveyorListComponent,
    NewGarageDetailsComponent,
    NewSurveyorDetailsComponent,
    PolicySearchDetailsComponent,
    ClaimIntimateDetailsComponent,
    SearchClaimDetailsComponent,
    PersonalQuoteDetailsComponent,
    ClaimSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    HttpClientModule,
    NgMaterialMultilevelMenuModule,
    NgxSpinnerModule,
    NgbModule,
    NgxPaginationModule,
    TableModule,
    PaginatorModule,
    AmazingTimePickerModule 
  ],

  providers: [
    ɵb,MultilevelMenuService,DatePipe, AuthService, AuthGuard,ErrorService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AppModule {
  //"ApiUrl": "http://192.168.1.49:8080/ClaimApi/",
    //"DocApiUrl": "http://192.168.1.49:8080/CommonApi/"
 }
