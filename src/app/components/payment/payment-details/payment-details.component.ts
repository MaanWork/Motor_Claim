import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ClaimjourneyService } from 'src/app/commonmodule/claimjourney/claimjourney.service';
import { DashboardTableService } from 'src/app/commonmodule/dashboard-table/dasboard-table.service';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { PolicyService } from 'src/app/commonmodule/policy/policy.service';
import { ReserveModalComponent } from 'src/app/shared/reserve-modal/reserve-modal.component';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent {
  public panelOpen:boolean=true;
  public logindata: any = {};
  public claimDetails: any = {};
  public PolicyInformation: any;
  public ClaimSummary: any;
  public getClaimInformation: any;
  public PartyList: any = [];
  public Nationality: any = [];
  public claimLossTypeList: any = {};
  public claimIntimateValue: any = {};
  private subscription = new Subscription();
  historyHeader:any;reserveData:any[]=[];
  historyData: any[];partyList:any[]=[];payMode:any='C';
  innerHeader: any[];payTypeList:any[]=[];lossList:any[]=[];
  innerTableData: any[]=[];payToTypeList:any[]=[];
  paySection: boolean;payType:any;payToType:any;
  p: Number = 1;payRowDetails:any;
  count: Number = 20;
  payDate: null;
  payAmount: any=null;
  AccNo: null;
  AccHolderName: null;
  BankName: null;bankList:any[]=[];
  ChequeNo: null;
  ChequeDate: null;
  payRemarks: null;receiverName:any;
  receiverTypeList: any[]=[];recordsSection:boolean;
  receiverType: any=null;lossRecordsSection:boolean=false;
  lossHistoryData: any[];insuranceId:any=null;currencyCode:any=null;
  lossHeader: ({ key: string; display: string; config?: undefined; } | { key: string; display: string; config: { isPayView: boolean; isPayAction: boolean; actions: string[]; }; })[];
  subHeader: any[];
  constructor(
    private policyService: PolicyService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    private lossService: LossService,
    public dialog: MatDialog,
    private router:Router,
    private dashboardTableService: DashboardTableService,
    private commondataService: CommondataService,
    private claimjourneyService: ClaimjourneyService,
    private datePipe:DatePipe

  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.insuranceId = this.logindata?.InsuranceId;
    if(this.insuranceId=='100002'){ this.currencyCode = 'TZS'}
    else if(this.insuranceId=='100003'){ this.currencyCode = 'UGX'}
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.partyList = [{"Code":"01","CodeDesc":"Samilla"},{"Code":"02","CodeDesc":"Kalimullah"},]
    this.lossList = [{"Code":"01","CodeDesc":"Own Damage"},{"Code":"02","CodeDesc":"Towage Charge"},]
    this.payToTypeList = [{"Code":"01","CodeDesc":"ClaimOfficer"},{"Code":"02","CodeDesc":"Assessor"},{"Code":"03","CodeDesc":"Garage"},{"Code":"04","CodeDesc":"Advocate"},{"Code":"04","CodeDesc":"Towage Company"}]
    //this.payTypeList = [{"Code":"01","CodeDesc":"Cash"},{"Code":"02","CodeDesc":"Cheque"},{"Code":"03","CodeDesc":"Card/Online"},]
  }
  ngOnInit(): void {

    //this.commondataService.onGetNationality();
    this.onGetReserveAmountList();
    //this.getPayeeRoles();
    this.getBankList();
    this.getPaymentTypes();

    this.getPaymentRecords();
    this.historyHeader = [
      {
        key: "more",
        display: "MORE VIEW",
        config: {
          isMoreView: true,
          actions: ["VIEW"]
        }
      },
      { key: "PartyNo", display: "PARTY NO" },
      {key: "FaultCategory", display: "PARTY NAME"},
      { key: "Amount", display: "TOTAL AMOUNT" },
      { key: "PaidAmount", display: "PAID AMOUNT" },
      { key: "PaidDate", display: "PAID DATE" },
      {
        key: "action",
        display: "ACTION",
        config: {
          isPayView: true,
          actions: ["VIEW"]
        }
      },
    ];
    // this.historyData = [
    //   {
    //     "PartyNo":"1",
    //     "FaultCategory": "Samilla - At Fault",
    //     "Amount":"50,000",
    //     "PaidAmount":"30,000",
    //     "PaidDate":"25/04/2023",
    //     "Loss":[
    //       { "LossId":"1","LossName":"Own Damage","ReceiverName":"N/A","Amount":"30,000","PaidDate":"25/04/2023","PaidAmount":"20,000"},
    //       { "LossId":"2","LossName":"Towage Charge","ReceiverName":"Alliance Ltd","Amount":"20,000","PaidDate":"25/04/2023","PaidAmount":"10,000"},
    //     ]
    //   }
    // ]
    
   
    this.subscription = this.claimjourneyService.getpolicyInfo.subscribe(async (event: any) => {
      this.PolicyInformation = event;
      if (event != null) {

      } else {
        this.claimjourneyService.onGetPolicyDetails(sessionStorage.getItem("PolicyNumber"),'byChassisNo',null);
      }

    });
    this.subscription = this.lossService.getPartyList.subscribe(async (event: any) => {
      this.PartyList = event;
    });

    this.subscription = this.commondataService.nationalityList.subscribe((event: any) => {
      this.Nationality = event;
    })

  }
  omit_special_char(event){   
		var k;  
		k = event.charCode;  //         k = event.keyCode;  (Both can be used)
		return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
	}
  alphaOnly(event) {
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || key == 8);
  };
  getBankList(){
    let ReqObj = {
      "InscompanyId": this.logindata.InsuranceId
    }
    let UrlLink = `api/listofbank`;
    return this.lossService.onLossEdit(UrlLink,ReqObj).subscribe((data: any) => {
            if(data){
              this.bankList = data;
            }
    }, (err) => {

      this.handleError(err);
    })
  }
  getPaymentTypes(){
    let UrlLink = `api/paymenttypes`;
    return this.lossService.getGender(UrlLink).subscribe((data: any) => {
            if(data){
              this.payTypeList = data;
            }
    }, (err) => {

      this.handleError(err);
    })
  }
  getPayeeRoles(){
    let UrlLink = `api/payeeroles`;
    let ReqObj = {
      "PartyNo": this.payRowDetails?.PartyNo,
      "LossTypeId": this.payRowDetails?.LossTypeId
    }
    return this.lossService.onLossEdit(UrlLink,ReqObj).subscribe((data: any) => {
            if(data){
              this.receiverTypeList = data;
            }
    }, (err) => {

      this.handleError(err);
    })
  }
  getPaymentRecords(){
    this.historyData = [];
    let UrlLink = `api/getallpaymentdetails`;
    let ReqObj = {
      "ClaimNo": this.claimDetails?.ClaimNo,
      ...this.commonReqObject()
    }
    return this.lossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {
      this.innerHeader = [
        { key: "LossNo", display: "LOSS NO" },
        { key: "LossTypeDesc", display: "LOSS NAME" },
        { key: "LossAmount", display: "TOTAL" },
        { key: "LossPaidAmount", display: "PAID" },
        { key: "LossPendingAmount", display: "PENDING" },
        { key: "ExchangeRate", display: "EXCHANGE RATE" },
        { key: "LossAmountFc", display: "TOTAL FC" },
        { key: "LossPaidAmountFc", display: "PAID FC" },
        { key: "LossPendingAmountFc", display: "PENDING FC" },
        {
          key: "action",
          display: "ACTION",
          config: {
            isPayView: true,
            isPayAction: true,
            actions: ["VIEW"]
          }
        },
      ];
      this.historyData = data;
      this.recordsSection = true;
      this.lossRecordsSection = false;
    }, (err) => {

      this.handleError(err);
    })
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
  commonReqObject() {
    return {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId": this.logindata?.OaCode,

    }
  }
  onMakePayment(rowData){
    this.payRowDetails = rowData;
    console.log("Pay Row Details",this.payRowDetails);
    this.payType = null;this.payDate = null;
    this.payAmount = null;this.AccNo = null;
    this.AccHolderName = null;this.BankName = null;
    this.ChequeNo = null;this.ChequeDate = null;this.receiverType = null;
    this.payRemarks = null;this.receiverName=null;
    this.getPayeeRoles();
    this.paySection = true;
  }
  onPayAmountChange(args){
    if (args.key === 'e' || args.key === '+' || args.key === '-') {
      return false;
    } else {
      return true;
    }
  }
  CommaFormatted(){
    if (this.payAmount) {
      this.payAmount = this.payAmount.replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     }
  }
  onProceedPayment(){
    let UrlLink = `api/insertpaymentdetails`;
    let ChequeDate=null,payDate=null,amount=null;
    if(this.payAmount!=null && this.payAmount!=''){
      const regEx = new RegExp(',', "g");
      amount = this.payAmount.replace(regEx,'');
    }
    if(this.payDate!=null && this.payDate!=''){
      payDate = this.datePipe.transform(this.payDate, "dd/MM/yyyy")
    }
    if(this.ChequeDate!=null && this.ChequeDate!=''){
      ChequeDate = this.datePipe.transform(this.ChequeDate, "dd/MM/yyyy")
    }
    let ReqObj = {
      "ClaimNo": this.claimDetails?.ClaimNo,
      "AccountHolderName": this.AccHolderName,
      "AccountNumber": this.AccNo,
      "BankShortCode": this.BankName,
      "ChequeDate": ChequeDate,
      "ChequeNumber": this.ChequeNo,
      "LossNo": this.payRowDetails?.LossNo,
      "LossTypeId": this.payRowDetails?.LossTypeId,
      "PaidAmount": amount,
      "PaidDate": payDate,
      "PayeeRoleId": this.receiverType,
      "PaidTo": this.receiverName,
      "PartyNo": this.payRowDetails?.PartyNo,
      "PaymentTypeId": this.payType,
      "Remarks": this.payRemarks,
      "ChargeOrRefund" :this.payMode,
      "InscompanyId":this.logindata.InsuranceId,
      ...this.commonReqObject()
    }
    return this.lossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {
         if(data?.Response=='Success'){
              this.paySection = false;
              this.getPaymentRecords();
         }
         else if (data.Errors) {
          this.errorService.showValidateError(data.Errors);

        }
    }, (err) => {

      this.handleError(err);
    })
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
  onGetLossList(rowData){
    this.innerTableData = rowData.Loss;
  }
  getLossBasedPaymentList(rowData){
    this.lossHistoryData = [];
    let UrlLink = `api/viewlosspayment`;
    let ReqObj = {
      "ClaimNo": this.claimDetails?.ClaimNo,
      "PartyNo": rowData.PartyNo,
      "LossTypeId": rowData.LossTypeId
    }
    return this.lossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {
      this.lossHeader = [
        { key: "PayeeRole", display: "RECEIVER TYPE" },
        { key: "PaidTo", display: "RECEIVER NAME" },
        { key: "PayeeName", display: "RECEIVER NAME" },
        { key: "ChargeOrRefundDesc", display: "PAYMENT MODE" },
        { key: "PaymentTypeId", display: "PAYMENT TYPE" },
        { key: "PaidAmount", display: "PAID AMOUNT" },
        { key: "PaidDate", display: "PAID DATE" },
      ]
      this.lossHistoryData = data;
      this.recordsSection = false;
      this.lossRecordsSection = true;
    }, (err) => {

      this.handleError(err);
    })
  }
  getBack(){
    this.router.navigate(['Home/Loss']);
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
