import { NewPartyModalComponent } from './new-party-modal/new-party-modal.component';

import { LossService } from './loss.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { PolicyService } from '../policy/policy.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DashboardTableService } from '../dashboard-table/dasboard-table.service';
import { ClaimjourneyService } from '../claimjourney/claimjourney.service';
import { Subscription } from 'rxjs';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { ReserveModalComponent } from 'src/app/shared/reserve-modal/reserve-modal.component';

@Component({
  selector: 'app-loss',
  templateUrl: './loss.component.html',
  styleUrls: ['./loss.component.css']
})
export class LossComponent implements OnInit, OnDestroy {
  public panelOpen:boolean=true;
  reserveData:any[]=[];
  public logindata: any = {};
  public claimDetails: any = {};
  public PolicyInformation: any;
  public ClaimSummary: any;
  public getClaimInformation: any;partyList:any[]=[];
  public PartyList: any = [];public coverList:any[]=[];
  public Nationality: any = [];insuranceId:any=null;
  public claimLossTypeList: any=null;currencyCode:any=null;
  public claimIntimateValue: any = {};
  private subscription = new Subscription();
  count:any=0;

  constructor(
    private policyService: PolicyService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    private lossService: LossService,
    public dialog: MatDialog,
    private dashboardTableService: DashboardTableService,
    private commondataService: CommondataService,
    private claimjourneyService: ClaimjourneyService,
    public dialogRef: MatDialogRef<NewPartyModalComponent>,

  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.insuranceId = this.logindata?.InsuranceId;
    if(this.insuranceId=='100002'){ this.currencyCode = 'TZS'}
    else if(this.insuranceId=='100003'){ this.currencyCode = 'UGX'}
  }



  ngOnInit(): void {

    //this.commondataService.onGetNationality();


    this.subscription = this.claimjourneyService.getpolicyInfo.subscribe(async (event: any) => {
      this.PolicyInformation = event;
      if (event != null) {
        await this.onInitialFetchData();
      } else {
        this.claimjourneyService.onGetPolicyDetails(sessionStorage.getItem("PolicyNumber"),'byChassisNo',this.claimDetails?.Claimrefno);
      }

    });
    this.subscription = this.lossService.getPartyList.subscribe(async (event: any) => {
      this.PartyList = event;
    });

    this.subscription = this.commondataService.nationalityList.subscribe((event: any) => {
      this.Nationality = event;
    })
    this.onGetReserveAmountList();
    this.getCoverList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    
    
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
  onGetReserveAmountList(){
    let UrlLink = `api/getallreservedetails`;
    let ReqObj = {
      "ClaimNo": this.claimDetails?.ClaimNo,
      ...this.commonReqObject()
    }
    return this.lossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {
          this.reserveData = data;
    }, (err) => {

      this.handleError(err);
    })
  }
  getCoverList(){
    let UrlLink = `api/getewaycoverdetails`;
    let ReqObj = {
      "ChassisNo": this.claimDetails?.ChassisNo,
      "ClaimNo": this.claimDetails?.ClaimNo,
      "QuotationPolicyNo": this.claimDetails?.PolicyNo,
      "ClaimRefNo": this.claimDetails?.Claimrefno,
      "InsuranceId": this.insuranceId
    }
    return this.lossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {
        if(data){
          if(data.length!=0){
            this.coverList = data.filter(ele=>ele.Suminsured!='0');
          }
        }
    });
  }
  addReserveAmount(){
      const dialogRef = this.dialog.open(ReserveModalComponent,{
        width: '50%',
        panelClass: 'full-screen-modal',
        data:{'ClaimDetails':this.claimDetails}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.reserveData = [];
        this.onGetReserveAmountList();
      });
    }
  async onInitialFetchData() {
    this.count+=1;
    if(this.count==1){
      if(this.ClaimSummary==null || this.ClaimSummary==undefined )await this.onClaimSummaryDetails();
      await this.onViewData();
      this.lossService.onGetPartyList();
      if(this.claimLossTypeList==null || this.claimLossTypeList==undefined) this.claimLossTypeList = await this.lossService.ongetClaimLossType(this.PolicyInformation);
      this.lossService.onGetClaimLossType(this.claimLossTypeList);
      if(this.claimIntimateValue==null || this.claimIntimateValue==undefined ) this.claimIntimateValue = await this.onBindClaimIntimateValue();
      console.log("loss-DriverDetails",this.claimIntimateValue);
      this.lossService.onGetClaimIntimateVal(this.claimIntimateValue);
    }

  }






  async onClaimSummaryDetails() {
    let ReqObj = {
      "ChassisNo": this.PolicyInformation?.VehicleInfo?.ChassisNo,
      "ClaimNo": this.claimDetails.ClaimNo,
      "PolicyNo": this.PolicyInformation?.PolicyInfo?.PolicyNo,
      ...this.commonReqObject()

    }
    console.log(ReqObj)
    let UrlLink = `api/claimdatasheetcount`;
    return (await this.lossService.onClaimSummaryDetails(UrlLink, ReqObj)).subscribe((data: any) => {
      this.ClaimSummary = data;
      this.lossService.onClaimSummaryData(this.ClaimSummary);
      console.log("claimsummary", data);
    }, (err) => {
      this.handleError(err);
    })
  }



  async onViewData() {
    let claimrefNo = "";
    if(this.claimDetails.Claimrefno) claimrefNo = this.claimDetails.Claimrefno;
    else if(this.claimDetails.ClaimRefNo) claimrefNo = this.claimDetails.ClaimRefNo;
    let obj = {
      'Claimrefno': claimrefNo,
      'PolicyNo': this.claimDetails.PolicyNo,
    }
    this.dashboardTableService.onViewClaimIntimation(this.claimDetails);
  }

  // async getClaimLossType() {
  //   let UrlLink = `api/claimlosstype/${this.PolicyInformation?.PolicyInfo?.Product}`;
  //   let response = (await this.lossService.getClaimLossType(UrlLink)).toPromise()
  //     .then(res => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       this.handleError(err)
  //     });
  //   return response;

  // }

  async onBindClaimIntimateValue() {
    let ReqObj = {
      "ClaimNo": this.claimDetails.ClaimNo,
      "PolicyNo": this.claimDetails.PolicyNo,
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

  onViewInfo(){
    this.panelOpen = !this.panelOpen;
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
