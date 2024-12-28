import { MaterialModule } from './../../material/material.module';
import { SharedModule } from './../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ClaimjourneyRoutingModule } from './claimjourney-routing.module';
import { ClaimjourneyComponent } from './claimjourney.component';
import { InfoAboutPolicyComponent } from './components/info-about-policy/info-about-policy.component';
import { InfoAboutClaimComponent } from './components/info-about-claim/info-about-claim.component';

@NgModule({
  declarations: [ClaimjourneyComponent, InfoAboutPolicyComponent, InfoAboutClaimComponent],
  imports: [
    CommonModule,
    ClaimjourneyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule
  ],
    
  providers: [DatePipe],
  bootstrap: [ClaimjourneyComponent],
})
export class ClaimjourneyModule {}
