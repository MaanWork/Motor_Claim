import { InfoAboutPolicyComponent } from './components/info-about-policy/info-about-policy.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaimjourneyComponent } from './claimjourney.component';

const routes: Routes = [
  {
    path: '',
    component: ClaimjourneyComponent,
  },
  {
    path: 'Policy-Info',
    component: InfoAboutPolicyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimjourneyRoutingModule {}
