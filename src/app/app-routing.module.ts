import { Routes, RouterModule } from '@angular/router';
import { PolicySearchComponent } from './shared/claimintimationForms/policy-search/policy-search.component';
import { LoginAssessorComponent } from './components/login-assessor/login-assessor.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ClaimintimateGridComponent } from './components/claimintimate-grid/claimintimate-grid.component';
import { LogingarageComponent } from './components/logingarage/logingarage.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { PendingAuthLetterComponent } from './commonmodule/lop/pending-auth-letter/pending-auth-letter.component';
import { SessionRedirectComponent } from './components/session-redirect/session-redirect.component';
import { PaymentDetailsComponent } from './components/payment/payment-details/payment-details.component';
import { ClaimsComponent } from './admin/claims/claims.component';
import { NewGarageDetailsComponent } from './admin/components/loginCreation/Garage/new-garage-details/new-garage-details.component';
import { SearchComponent } from './admin/search/search.component';
import { GarageListComponent } from './admin/components/loginCreation/Garage/garage-list/garage-list.component';
import { SurveyorListComponent } from './admin/components/loginCreation/Surveyor/surveyor-list/surveyor-list.component';
import { NewSurveyorDetailsComponent } from './admin/components/loginCreation/Surveyor/new-surveyor-details/new-surveyor-details.component';
import { PolicySearchDetailsComponent } from './shared/claimintimateCustomer/policySearchDetails/policy-search-details.component';
import { ClaimIntimateDetailsComponent } from './shared/claimintimateCustomer/claim-intimate-details/claim-intimate-details.component';
import { ClaimIntimateCustomerGridComponent } from './shared/claimintimateCustomer/claimintimate-grid/claimintimate-grid.component';
import { LoginCheckClaimComponent } from './components/login-check-claim/login-check-claim.component';
import { SearchClaimDetailsComponent } from './components/search-claim-details/search-claim-details.component';
import { ClaimSearchComponent } from './components/claim-search/claim-search.component';

const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  {
    path: 'Home',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'Dashboard',
        pathMatch: 'full',
      },
      {
        path: 'Dashboard',
        loadChildren: () =>
          import('./commonmodule/dashboard/dashboard.module').then(
            (n) => n.DashboardModule
          ),
          data: { preload: true }
      },
      {
        path: 'claimsearch',
        component: ClaimSearchComponent,
      },
      {
        path: 'Table',
        loadChildren: () =>
          import('./commonmodule/dashboard-table/dasboard-table.module').then(
            (n) => n.DashboardTableModule
          ),
      },
      {
        path: 'Claim',
        loadChildren: () =>
          import('./commonmodule/claimjourney/claimjourney.module').then(
            (n) => n.ClaimjourneyModule
          ),
      },
      {
        path: 'Policy',
        loadChildren: () =>
          import('./commonmodule/policy/policy.module').then(
            (n) => n.PolicyModule
          ),
      },
      {
        path: 'Payment',
       component: PaymentDetailsComponent
      },
      {
        path: 'Search',
        component: SearchComponent
      },
      {
        path: 'Claims',
        component: ClaimsComponent
      },
      {
        path: 'Loss',
        loadChildren: () =>
          import('./commonmodule/loss/loss.module').then(
            (n) => n.LossModule
          ),
      },

      {
        path: 'Surveyor',
        loadChildren: () =>
          import('./commonmodule/surveyor/surveyor.module').then(
            (n) => n.SurveyorModule
          ),
      },
      {
        path: 'Garage',
        loadChildren: () =>
          import('./commonmodule/garage/garage.module').then(
            (n) => n.GarageModule
          ),
      },
      {
        path: 'PendingAuthLetter',
        component:PendingAuthLetterComponent
      },
      {
        path: 'Claimforms',
        loadChildren: () =>
          import('./commonmodule/claimintimation/claimintimation.module').then(
            (n) => n.ClaimintimationModule
          ),
      },
      {
        path: 'Admin',
        loadChildren: () =>
          import('./admin/admin.module').then(
            (n) => n.AdminModule
          ),
      },
      {
        path: 'GarageLogin',
        component: GarageListComponent,
      },
      {
        path: 'newGarageDetails',
        component: NewGarageDetailsComponent,
      },
      {
        path: 'SurveyorLogin',
        component: SurveyorListComponent,
      },
      {
        path: 'newSurveyorDetails',
        component: NewSurveyorDetailsComponent,
      },
      {
        path: 'ClaimIntimate',
        component:ClaimintimateGridComponent
      },
    ],
  },

  {
    path: 'Login',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'Home',
        pathMatch: 'full',
      },
      {
        path: 'sessionRedirect',
        component:SessionRedirectComponent
      },
      {
        path: 'Home',
        component:HomeComponent
      },
      {
        path: 'Officer',
        component:LoginComponent
      },
      {
        path: 'Assessor',
        component:LoginAssessorComponent
      },
      {
        path: 'Garage',
        component:LogingarageComponent
      },
      {
        path: 'Change-Password',
        component:ChangePasswordComponent

      },
      {
        path: 'Forgot-Password',
        component:ForgotPasswordComponent

      },
      {
        path: 'Claim-Intimate',
        component:PolicySearchComponent

      },
      {
        path: 'ClaimIntimate',
        component:PolicySearchDetailsComponent

      },
      {
        path: 'IntimateDetails',
        component: ClaimIntimateDetailsComponent

      },
      {
        path: 'IntimatedList',
        component: ClaimIntimateCustomerGridComponent

      },
      {
        path: 'Check-Claim',
        component: LoginCheckClaimComponent

      },
      {
        path: 'Search-Claim',
        component: SearchClaimDetailsComponent

      },
    ],
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
