import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurveyorService } from './surveyor.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DashboardTableService } from '../dashboard-table/dasboard-table.service';
import { LossService } from '../loss/loss.service';
import { PolicyService } from '../policy/policy.service';
import { ClaimjourneyService } from '../claimjourney/claimjourney.service';
import { Subscription } from 'rxjs';
import { CommondataService } from 'src/app/shared/services/commondata.service';

@Component({
  selector: 'app-surveyor',
  templateUrl: './surveyor.component.html',
  styleUrls: ['./surveyor.component.css']
})
export class SurveyorComponent implements OnInit, OnDestroy {

  public logindata: any;
  public claimDetails: any;
  public PolicyInformation: any;
  public claimIntimationInfo: any;
  public surveryorForm: FormGroup
  private subscription = new Subscription();
  constructor(
    private policyService: PolicyService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    private lossService: LossService,
    public dialog: MatDialog,
    private dashboardTableService: DashboardTableService,
    private commondataService: CommondataService,
    private surveyorService: SurveyorService,
    private claimjourneyService: ClaimjourneyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createFromControl();
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    console.log(this.claimDetails);
    this.subscription = this.claimjourneyService.getpolicyInfo.subscribe(async (event: any) => {
      this.PolicyInformation = event;
      if (this.PolicyInformation == null) {
        this.claimjourneyService.onGetPolicyDetails(sessionStorage.getItem("PolicyNumber"), 'byChassisNo',null);
      }
    });
    this.onInitialFetchData();


  }
  async onInitialFetchData() {
    console.log("Session Data",this.claimDetails)
    let claimrefNo = "";
    if(this.claimDetails.Claimrefno) claimrefNo = this.claimDetails.Claimrefno;
    else if(this.claimDetails.ClaimRefNo) claimrefNo = this.claimDetails.ClaimRefNo;
    let obj = {
      'Claimrefno': claimrefNo,
      'PolicyNo': this.claimDetails.PolicyNo,
    }
    this.claimIntimationInfo = await this.dashboardTableService.onViewClaimIntimation(this.claimDetails)
    console.log(this.claimIntimationInfo);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createFromControl() {
    this.surveryorForm = this.formBuilder.group({
      Latitude: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(50)]],
      Longitude: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(50)]],
    })
  }

  onSetFormValues() {
    this.surveryorForm.controls['Latitude'].setValue('');
    this.surveryorForm.controls['Longitude'].setValue('');

  }

  commonReqObject() {
    return {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId": this.logindata?.OaCode

    }
  }







  handleError(error) {
    let errorMessage: any = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = { 'ErrorCode': error.status, 'Message': error.message };
      this.errorService.showError(error, errorMessage);

    }

  }

}
