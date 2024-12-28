import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { PolicyService } from 'src/app/commonmodule/policy/policy.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { ClaimjourneyService } from '../../claimjourney.service';
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
  selector: 'app-info-about-policy',
  templateUrl: './info-about-policy.component.html',
  styleUrls: ['./info-about-policy.component.css']
})
export class InfoAboutPolicyComponent implements OnInit, OnDestroy {
  public logindata:any;
  public PolicyInformation: any;
  private subscription = new Subscription();
  public tableData: PeriodicElement[];
  public columnHeader: any;
  public claimHistory: any
  public claimLossTypeList:any;
  public claimIntimateValue:any;
  public demo1TabIndex = 0;

  constructor(
    private claimjourneyService: ClaimjourneyService,
    private policyService: PolicyService,
    private lossService: LossService,
    private errorService:ErrorService

  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    
    this.claimjourneyService.onGetPolicyDetails(sessionStorage.getItem("PolicyNumber"), 'notbyChassisNo',null);

    this.subscription = this.claimjourneyService.getpolicyInfo.subscribe(async (event: any) => {
      if (event != null) {
        this.PolicyInformation = event[0];
        this.onGetAllClaims();
      }
    });
  }

  ngOnInit(): void {

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

 async onClaimLossEdit(row) {
    this.claimIntimateValue = await this.onBindClaimIntimateValue(row);
    console.log("loss-DriverDetails",this.claimIntimateValue);
    this.lossService.onGetClaimIntimateVal(this.claimIntimateValue);
    sessionStorage.setItem('LossDetails', JSON.stringify(row));
    this.lossService.viewClaimLossDetails(row);
    this.demo1BtnClick()
  }
  onTabBack(){
    const tabCount = 3;
    this.demo1TabIndex = 1;
    this.demo1TabIndex = (this.demo1TabIndex - 1) % tabCount;
  }
  public demo1BtnClick() {
    const tabCount = 3;
    this.demo1TabIndex = (this.demo1TabIndex + 1) % tabCount;
 }

  async onGetAllClaims() {
    this.claimHistory = await this.policyService.onGetClaimHistory(this.PolicyInformation);
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
    this.tableData = this.claimHistory;
    this.claimLossTypeList = await this.lossService.ongetClaimLossType(this.PolicyInformation);
    this.lossService.onGetClaimLossType(this.claimLossTypeList);

  }

  async onBindClaimIntimateValue(row) {
    let ReqObj = {
      "ClaimNo": row.ClaimNo,
      "PolicyNo": row.PolicyNo,
      ...this.commonReqObject()
    }
    let UrlLink = `api/cliamdriverdetailbycalimno`;

    let response = (await this.lossService.onBindClaimIntimateValue(UrlLink, ReqObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;

  }


  ngOnDestroy() {
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
