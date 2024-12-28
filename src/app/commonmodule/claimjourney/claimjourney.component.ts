import { CommondataService } from './../../shared/services/commondata.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
import { ClaimjourneyService } from './claimjourney.service';
import { Router } from '@angular/router';
import { PolicyService } from '../policy/policy.service';
import { LossService } from '../loss/loss.service';
import { Subscriber, Subscription } from 'rxjs';

export interface PeriodicElement {
AllotedYn:any,
ApprovedYn:any,
ChassisNo:any,
ClaimNo:any,
CreatedBy:any,
Entrydate:any,
InsuranceId:any,
LosstypeId:any,
PartyNo:any,
PolicyNo:any,
ProductId:any,
RegionId:any,
SurveyorId:any,
SurveyorName:any,
}

@Component({
  selector: 'app-claimjourney',
  templateUrl: './claimjourney.component.html',
  styleUrls: ['./claimjourney.component.css']
})
export class ClaimjourneyComponent implements OnInit, OnDestroy{

  public searchDropdown: any = [];
  public searchValue: any;
  public searchForm: FormGroup;
  public panelOpen: boolean = true;
  public logindata: any = {};
  public policyInformation: any;
  public claimInformation: any;
  public allotedClaimLoss:any;
  public policyInformation2: any;


  public tableData: PeriodicElement[];
  public columnHeader: any;

  private subscription = new Subscription();

  constructor(
    private claimjourneyService: ClaimjourneyService,
    private policyService: PolicyService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private lossService:LossService

  ) { }

  ngOnInit(): void {
    this.onInitialFetchData();
  }
  async onInitialFetchData() {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;

    this.createFromControl();
    this.searchDropdown = await this.getSearchby();

    if (this.logindata?.UserType == 'surveyor') {
      this.columnHeader = {
        'PolicyNo': 'POLICY NO',
        'ClaimNo': 'CLAIM NO',
        'ChassisNo': 'CHASSIS NO',
        'SurveyorName': 'SURVEYOR NAME',
        'CreatedBy': 'CREATED BY',
        'InsuranceId': 'INSURANCE ID',
        'Action':'ACTION'

      };

    this.subscription = this.claimjourneyService.getAllotedClaimLoss.subscribe((event:any)=>{
        this.allotedClaimLoss = event;
        this.tableData = this.allotedClaimLoss;
        console.log(this.allotedClaimLoss);
        if(event == null){
          this.claimjourneyService.onGetAllotedLossForSurveyor()
        }
      })
    }
    if (this.logindata?.UserType == 'garage') {

    }
  }


  createFromControl() {
    this.searchForm = this.formBuilder.group({
      selectedValue: ['', Validators.required],
      searchvalue: ['', Validators.required],
    })
  }

  checkEmptyData(val) {
    if (val != null && val != undefined && val != '') {
      return true;
    }
    else return false;
  }

  commonReqObject() {
    return {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId":  this.logindata?.OaCode

    }
  }


  async getSearchby() {
    let UrlLink = `api/claimsearchby`;
    let response = (await this.claimjourneyService.getSearchby(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  async onSearch() {
    var ReqObj;
    var UrlLink;


    if (this.searchForm.controls['selectedValue'].value == '1') {
      ReqObj = {
        "QuotationPolicyNo": this.searchForm.controls['searchvalue'].value,
        ...this.commonReqObject()
      }
      UrlLink = `api/get/policyDetails`;
    }
    if (this.searchForm.controls['selectedValue'].value == '4') {
      UrlLink = `api/claimdetailsListbyclaimno`;
      ReqObj = {
        "ClaimNo": this.searchForm.controls['searchvalue'].value,
        ...this.commonReqObject()
      }
    }
    if (this.searchForm.controls['selectedValue'].value != '4' && this.searchForm.controls['selectedValue'].value != '1') {
      Swal.fire(
        'Please Select',
        "Policy No or Claim No",
        'error',
      )
    }
    return this.claimjourneyService.onCallPolicyDetails(UrlLink, ReqObj).subscribe(async (data: any) => {


      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        if (this.searchForm.controls['selectedValue'].value == '1') {
          var  FindObj = data.find((ele:any)=>ele.PolicyInfo.PolicyNo == this.searchForm.controls['searchvalue'].value);
          this.policyInformation = FindObj;
          console.log("Policy Infooooooooo",this.policyInformation)
          sessionStorage.setItem("PolicyNumber", this.policyInformation.PolicyInfo.PolicyNo);
          this.claimjourneyService.onGetPolicyDetails(this.policyInformation.PolicyInfo.PolicyNo,'notbyChassisNo',null);
        }

        if (this.searchForm.controls['selectedValue'].value == '4') {
          this.claimInformation = data;
          this.lossService.GetClaimLossDetails(this.claimInformation);
          sessionStorage.setItem("PolicyNumber", this.claimInformation.PolicyNo);
          console.log(this.claimInformation);
          this.claimjourneyService.onGetPolicyDetails(this.claimInformation.PolicyNo,'notbyChassisNo',null);
        }
      }

    }, (err) => {
      this.handleError(err);
    });

  }

  GetClaimLossDetails(row){
    this.lossService.GetClaimLossDetails(row);
  }

  onViewAllInformation(){
    sessionStorage.setItem("PolicyNumber", this.policyInformation.PolicyInfo.PolicyNo);
    this.router.navigate(['/Home/Claim/Policy-Info']);

  }


  onGoPolicyDetails(){
    if (this.searchForm.controls['selectedValue'].value == '1') {
      this.router.navigate(['/Home/Claim/Policy-Info']);

    } if (this.searchForm.controls['selectedValue'].value == '4') {
    this.router.navigate(['/Home/Loss']);


    }
  }


  onShowCondition(){
    if (this.logindata?.UserType == 'surveyor') {
      return true;
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
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
