import { ClaimjourneyService } from './../claimjourney/claimjourney.service';
import { ErrorService } from './../../shared/services/errors/error.service';
import { PolicyService } from './policy.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LossService } from '../loss/loss.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
export interface PeriodicElement {
  AdditionalDescription: any,
  BranchCode: any,
  BranchDescription: any,
  CauseOfLoss: any,
  ChassisNo: any,
  ClaimChannel: any,
  ClaimDate: any,
  ClaimNo: any,
  Claimrefno: any,
  CreatedBy: any,
  CustomerId: any,
  DateOfIncident: any,
  Edit: any,
  EntryDate: any,
  EstimateAmt: any,
  GarageId: any,
  InsDescription: any,
  InsuranceId: any,
  LosstypeId: any,
  NoOfPart: any,
  OutstandingAmt: any,
  PaidAmt: any,
  PartNo: any,
  PoliceReportSource: any,
  PoliceReportno: any,
  PolicyNo: any,
  Product: any,
  ProductDesc: any,
  ProductId: any,
  RegionCode: any,
  Status: any,
}
@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit, OnDestroy{
  public logindata: any = {};
  public PolicyInformation: any = {};
  public claimHistory: any = [];
  public tableData: PeriodicElement[];
  public columnHeader: any;

  private subscription = new Subscription();

  constructor(
    private policyService: PolicyService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    private claimjourneyService:ClaimjourneyService,
    private lossService:LossService,
    private router:Router
  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;

  }



  async ngOnInit(): Promise<void> {
    this.subscription = this.claimjourneyService.getpolicyInfo.subscribe(async (event: any) => {
      this.PolicyInformation = event;
      if (event == null) {
         this.claimjourneyService.onGetPolicyDetails(sessionStorage.getItem("PolicyNumber"),'byChassisNo',null);
      }
      if(this.PolicyInformation != null){
        this.AfetrClaimHistory()
      }


    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  AfetrClaimHistory(){
    this.policyService.getClaiminfo.subscribe(async (event: any) => {
      this.columnHeader = [
        { key: "ClaimNo", display: "CLAIM NO" },
        { key: "PoliceReportno", display: "POLICE REPORT.NO" },
        { key: "DateOfIncident", display: "LOSS DATE" },
        { key: "CauseOfLoss", display: "CAUSE OF LOSS" },
        { key: "EstimateAmt", display: "ESTIMATE" },
        { key: "PaidAmt", display: "PAID" },
        { key: "OutstandingAmt", display: "OUTSTANDING" },
        { key: "NoOfPart", display: "NO OF PARTS" },

        {
          key: "action",
          display: "ACTION",
          config: {
            isClaimLossEdit: true,
            actions: ["EDIT"]
          }
        }
      ];
      this.claimHistory = event;
      this.tableData = this.claimHistory;
      if (event == null) {
        this.policyService.onGetClaimHistory(this.PolicyInformation);
      }
    });
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

  onClaimLossEdit(row) {
    sessionStorage.setItem('LossDetails', JSON.stringify(row));
    this.lossService.GetClaimLossDetails(row);

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
