import { Component, EventEmitter, NgZone, OnInit, Output, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ClaimStatusTrackingComponent } from 'src/app/commonmodule/loss/claim-status-tracking/claim-status-tracking.component';
import { LossModalComponent } from 'src/app/shared/loss-modal/loss-modal.component';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { NewLossModalComponent } from 'src/app/commonmodule/loss/new-loss-modal/new-loss-modal.component';
import { NewPartyModalComponent } from 'src/app/commonmodule/loss/new-party-modal/new-party-modal.component';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
import { ClaimAllotModalComponent } from '../../modal/claim-allot-modal/claim-allot-modal.component';
import { PaymentComponent } from '../../modal/payment/payment.component';
import { LossReservedTransactionModalComponent } from '../../modal/loss-reserved-transaction-modal/loss-reserved-transaction-modal.component';
import { StatusTrackComponent } from 'src/app/shared/statusTrackComponent/status-track.component';
import { ReserveModalComponent } from 'src/app/shared/reserve-modal/reserve-modal.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ExcessModalComponent } from 'src/app/shared/excess-modal/excess-modal.component';
import { StatusUpdateComponent } from 'src/app/shared/lossinfocomponent/status-update/status-update.component';

export interface PeriodicElement {
  Address: any,
  CategoryDesc: any,
  CategoryId: any,
  ChassisNo: any,
  ClaimNo: any,
  ConsumablesCost: any,
  CreatedBy: any,
  DepriciationAmount: any,
  DriverDob: any,
  DriverEmailId: any,
  DriverGender: any,
  DriverLicenseExpiryDate: any,
  DriverLicenseNo: any,
  DriverMobile: any,
  DriverMobileCode: any,
  DriverName: any,
  DriverNationality: any,
  EntryDate: any,
  FinanceOfficerId: any,
  GarageYn: any,
  IncidentLatitudeLongitude: any,
  IncidentLocationLongitude: any,
  LabourCost: any,
  LessBetterment: any,
  LessExcess: any,
  LossNo: any,
  LosstypeId: any,
  Losstypedescp: any,
  PartyNo: any,
  PerHourLabourCost: any,
  PolicyNo: any,
  Remarks: any,
  SalvageAmount: any,
  SectionIds: any,
  SparepartsCost: any,
  Status: any,
  Statusdescrip: any,
  TotalLabourHour: any,
  TotalPrice: any,
}

@Component({
  selector: 'app-party-detail',
  templateUrl: './party-detail.component.html',
  styleUrls: ['./party-detail.component.css']
})
export class PartyDetailComponent implements OnInit {


  public logindata: any = {};
  public claimDetails: any = {};
  public LossDetails: any;
  public partyList: any = [];
  public claimLossList = [];
  public partyNumber: any = '';
  public partyTypeId: any = '';

  public first = {};
  reserveData:any[]=[];
  public tableData: PeriodicElement[] | any;
  public columnHeader: any;
  public innerColumnHeader: any;

  public tableObj = {};
  private subscription = new Subscription();

  wasClicked = false;
  step = 0;insuranceId:any=null;
  public Nationality: any;currencyCode:any=null;
  public statusApproved: boolean = false;
  public statusRejected: boolean = false;
  public statusPending: boolean = false;
  p: Number = 1;
  count: Number = 20;coverHeader:any;coverData:any[]=[];
  coInsuranceHeader: ({ key: string; display: string; config?: undefined; } | { key: string; display: string; config: { isLossAction: boolean; actions: string[]; }; })[];
  coInsuranceData: any;
  LossCreationYn: any;
  constructor(
    private lossService: LossService,
    private errorService: ErrorService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NewLossModalComponent>,
    private dialogRef2: MatDialogRef<StatusTrackComponent>,
    private ngZone: NgZone,
    private spinner: NgxSpinnerService,
    private commondataService: CommondataService,
    private router: Router,
  ) {

       
   }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.insuranceId = this.logindata?.InsuranceId;
    if(this.insuranceId=='100002'){ this.currencyCode = 'TZS'}
    else if(this.insuranceId=='100003'){ this.currencyCode = 'UGX'}
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.LossDetails = JSON.parse(sessionStorage.getItem("LossDetails"));
    if(this.claimDetails){
      this.LossCreationYn = this.claimDetails.LossCreationYn;
    }
    else this.LossCreationYn = 'N';
     this.onGetCoInsuranceList()
     this.onGetReserveAmountList()
    this.lossService.onGetLossDetails(this.LossDetails);
    this.onInitialFetchData();
    this.coverHeader={
      'checkboxs': 'SELECT',
      'CoverName': 'Cover Name',
      'ExcessAmount': 'Excess Amount',
      'ExcessPercent': 'Excess (%)',
      "SumInsured": "Sum Insured"

    }; 
    this.coverData=[
        {"CoverName":"Base Cover","ExcessAmount":"1500","ExcessPercent":"5","SumInsured":"10,00,000"},
        {"CoverName":"Own Damage","ExcessAmount":"4000","ExcessPercent":"6","SumInsured":"15,00,000"},
        {"CoverName":"Accessories","ExcessAmount":"5000","ExcessPercent":"10","SumInsured":"10,00,000"},
        {"CoverName":"WindScreen","ExcessAmount":"8000","ExcessPercent":"7","SumInsured":"7,50,000"},
    ]
  }

  async onInitialFetchData() {
    //this.Nationality = await this.commondataService.onGetNationality();
    //this.commondataService.getNationality(this.Nationality);
    this.partyList = await this.lossService.onGetPartyList();
    if (this.partyList?.Errors) {
      this.errorService.showValidateError(this.partyList?.Errors);
    } else {
      await this.onGetLossList(this.partyList[0]);
      
    }
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
  addExcessAmount(){
    const dialogRef = this.dialog.open(ExcessModalComponent,{
      width: '50%',
      panelClass: 'full-screen-modal',
      data:{'ClaimDetails':this.claimDetails}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reserveData = [];
      
    });
  }

  setStep(index: number) {
    this.step = index;
  }
  onMakePayment(){
    this.router.navigate(['Home/Payment']);
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
  onGetCoInsuranceList(){
    let UrlLink = `api/get/coinsurancedetails`;
    let ReqObj = {
      "QuotationPolicyNo": this.claimDetails.PolicyNo,
      "ClaimRefNo": this.claimDetails?.Claimrefno,
      
      ...this.commonReqObject()
    }
    return this.lossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {
      this.coInsuranceData = undefined;
    this.coInsuranceData = data;
      this.coInsuranceHeader = [
        { key: "CompanyName", display: "INSURANCE COMPANY" },
        { key: "SumInsured", display: "SUM INSURED" },
        { key: "SharePercent", display: "SHARED (%)" }
      ];
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  async onGetLossList(item) {
    this.tableData = undefined;
    this.tableData = await this.lossService.onGetLossList(item);
    this.columnHeader = [
      {
        key: "more",
        display: "MORE VIEW",
        config: {
          isMoreView: true,
          actions: ["VIEW"]
        }
      },
      { key: "LossNo", display: "LOSS NO" },
      { key: "Losstypedescp", display: "LOSS TYPE" },
      { key: "TotalPrice", display: "TOTAL PRICE" },
      { key: "CreatedBy", display: "CREATED BY" },
      { key: "Statusdescrip", display: "LOSS STATUS" },
      {
        key: "action",
        display: "ACTION",
        config: {
          isLossAction: true,
          actions: ["EDIT"]
        }
      },

    ];
    this.innerColumnHeader =
    {
      "Remarks": "REMARKS",
      "EntryDate": "LOSS CREATED",
    }


  }
  onOpenPartyModal() {
    const dialogRef = this.dialog.open(NewPartyModalComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != null && result != '')
        this.partyList = this.lossService.onGetPartyList();
    });
  }
  onOpenPayment(event) {
    const dialogRef = this.dialog.open(PaymentComponent, {

      width: '100%',
      panelClass: 'full-screen-modal',
      data: event
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  onEditPartyDetials(item) {
    this.lossService.onGetPartyRowDetails(item);

    const dialogRef = this.dialog.open(NewPartyModalComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: item
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result != undefined && result != null && result != '')
        this.partyList = await this.lossService.onGetPartyList();
    });

  }

  onDeletePartyDetials(item) {
    if (item.PartyNo == 1) {
      Swal.fire(
        `Sorry You Can't Delete First Party`,
        `Party No:${item.PartyNo}`,
        'info'
      )
    } else {
      let ReqObj = {
        "ChassisNo": this.claimDetails.ChassisNo,
        "ClaimNo": this.claimDetails.ClaimNo,
        "PartyNo": item.PartyNo,
        "PolicyNo": this.claimDetails.PolicyNo,
        ...this.commonReqObject()
      }
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {

          let UrlLink = `api/deletepartydetails`;
          return this.lossService.onDeletePartyDetials(UrlLink, ReqObj).subscribe(async (data: any) => {

            if (data.Errors) {
              this.errorService.showValidateError(data.Errors);
            }
            else {
              this.partyList = await this.lossService.onGetPartyList();
              Swal.fire(
                'Deleted!',
                'Your Party has been deleted.',
                'success'
              )
            }
          }, (err) => {
            this.handleError(err);
          })

        }
      })
    }
  }
  onSubLossPdf(item){
    let ReqObj = {
      "policyNo": item.PolicyNo,
      "claimNo": item.ClaimNo,
      "partyNo": item.PartyNo,
      "lossTypeId": item.LosstypeId,
      "userType": this.logindata.UserType,
      "userId": this.logindata?.OaCode,
      "createdBy":this.logindata.LoginId
    }
    let UrlLink = `pdf/totalloss`;
    
    return this.lossService.onGetBase64Image(UrlLink, ReqObj).subscribe((data: any) => {

      this.downloadMyFile(data)
    }, (err) => {

      this.handleError(err);
    })
  }
  onCreateNewLoss(item) {
    item['coverData'] = this.coverData;
    const dialogRef = this.dialog.open(NewLossModalComponent, {
      width: '100%',
      data: item,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != null && result != '')
        this.onGetLossList(item);

    });
  }
 
  onLossEdit(item) {
    let ReqObj = {
      "ChassisNo": this.claimDetails.ChassisNo,
      "ClaimNo": this.claimDetails.ClaimNo,
      "PartyNo": item.PartyNo,
      "PolicyNo": this.claimDetails.PolicyNo,
      "LosstypeId": item.LosstypeId,
      "LossNo": item.LossNo,
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": item.CreatedBy,
      "UserType": item.UserType,
      "UserId": this.logindata?.OaCode
    }


    let UrlLink = `api/claimlossdetailsbyid`;
    return this.lossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {

      this.lossService.onGetLossInformation(data);
      this.lossService.onGetLossRowInformation(item);
      sessionStorage.setItem('LossDetails', JSON.stringify(item));
      const dialogRef = this.dialog.open(LossModalComponent, {
        width: '100%',
        panelClass: 'full-screen-modal',
        data: { MylossData: data, hidebtn: false }
      });
      
    }, (err) => {
      this.handleError(err);
    })
  }
  onLossDelete(item) {
    let ReqObj = {
      "ChassisNo": item.ChassisNo,
      "ClaimNo": item.ClaimNo,
      "PolicyNo": item.PolicyNo,
      "PartyNo": item.PartyNo,
      "LosstypeId": item.LosstypeId,
      "LossNo": item.LossNo,
      "CreatedBy": item.CreatedBy,
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "UserType": item.UserType
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {

        let UrlLink = `api/delete/claimlossdetails`;
        return this.lossService.onLossDelete(UrlLink, ReqObj).subscribe((data: any) => {

          if (data.Response == "Successfully Deleted") {
            this.onGetLossList(item);
            Swal.fire(
              'Loss Deleted Succssesfully!',
              `Loss No: ${item.LossNo}`,
              'success'
            )
          } else {
            Swal.fire(
              'Unable to Deleted!',
              `Claimno: ${item.LossNo}`,
              'info'
            )
          }
        }, (err) => {
          this.handleError(err);
        })
      }
    })
  }
  onLossAllote(item) {
    if (item.Status == 'CI' || item.Status == 'Y' || item.Status == 'AS' || item.Status == 'PPC' || item.Status == 'PLC' || item.Status == 'CL' || item.Status == 'PFSS') {
      sessionStorage.setItem('LossDetails', JSON.stringify(item));
      sessionStorage.setItem("ClaimDetails",JSON.stringify(item))
      this.router.navigate(['/Home/Surveyor']);
    }
    else {
      item.Status = 'AS';
      sessionStorage.setItem("ClaimDetails",JSON.stringify(item))
      sessionStorage.setItem('LossDetails', JSON.stringify(item));
      this.router.navigate(['/Home/Surveyor']);
    }
  }
  onLossGarageAllot(item) {
    if (item.Status != 'CI' && item.Status != 'Y' && item.Status != 'AS' && item.Status != 'PPC' && item.Status != 'PLC' && item.Status != 'CL' && item.Status != 'PFSS') {
      sessionStorage.setItem("ClaimDetails",JSON.stringify(item))
      sessionStorage.setItem('LossDetails', JSON.stringify(item));
      this.router.navigate(['/Home/Surveyor']);
    }
    else {
      item['newStatus'] = item.Status;
      item.Status = 'CLG';
      sessionStorage.setItem("ClaimDetails",JSON.stringify(item))
      sessionStorage.setItem('LossDetails', JSON.stringify(item));
      this.router.navigate(['/Home/Surveyor']);
    }
  }
  onLossReservedTransactions(item){
    const dialogRef = this.dialog.open(LossReservedTransactionModalComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: item
    });
  }
  onLossClaimAllot(item) {
    const dialogRef = this.dialog.open(ClaimAllotModalComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: item
    });
  }
  onLossTrack(event) {
    this.lossService.onGetLossRowInformation(event);

    // const dialogRef = this.dialog.open(ClaimStatusTrackingComponent, {
    //   width: '100%',
    //   panelClass: 'full-screen-modal'
    // });
    const dialogRef2 = this.dialog.open(StatusTrackComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: event
    });
    dialogRef2.afterClosed().subscribe(result => {
    });
  }
  onSurveyorApproved(event) {
    if (event.status == 'SA') {
      this.statusApproved = true;
      this.statusRejected = false;
      this.statusPending = false;
      this.onUpdateStatus(event.status, event.element)
      //this.saveLossDetails(event.status, 'Save', event.element);
    }
    if (event.status == 'SR') {
      this.statusApproved = false;
      this.statusRejected = true;
      this.statusPending = false;
      this.onUpdateStatus(event.status, event.element);
      this.onGetLossList(event.element);

    }
    if (event.status == 'AS') {
      this.statusApproved = false;
      this.statusRejected = false;
      this.statusPending = true;
      this.onUpdateStatus(event.status, event.element);
      this.onGetLossList(event.element);


    }
  }

  onUpdateStatus(status, item) {
    let UrlLink = null;
    if(this.logindata.InsuranceId=='100002') UrlLink = `api/updateclaimstatus`;
    else if(this.logindata.InsuranceId=='100003' || this.logindata.InsuranceId=='100008') UrlLink = `api/updateclaimstatusV1`; 
    let GarageId = '';
    if (this.logindata.UserType == 'garage') {
      GarageId = this.logindata.OaCode;
    }
    let ReqObj = {
      "ClaimNo": item.ClaimNo,
      "PolicyNo": item.PolicyNo,
      "InsuranceId": this.logindata.InsuranceId,
      "Status": status,
      "BranchCode": this.logindata.BranchCode,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "Remarks": '',
      "UserType": this.logindata.UserType,
      "PartyNo": item.PartyNo,
      "Losstypeid": item.LosstypeId,
      "Authcode": sessionStorage.getItem('UserToken'),
      "GarageId": GarageId
    }




    return this.lossService.onUpdateStatus(UrlLink, ReqObj).subscribe(async (data: any) => {

      if (data.Response == "Success") {

        if (status == 'SA') {
          Swal.fire(
            'Loss Accepted Successfully',
            'Success',
            'success'
          )
        }
        if (status == 'SR') {
          Swal.fire(
            'Loss Rejected Successfully',
            'Success',
            'success'
          )
        }
        this.onGetLossList(item);
      }
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);

      }
    }, (err) => {
      this.handleError(err);
    })

  }
  onSurveyorLossPdf(event) {
    let UrlLink = "pdf/damageappraisal";
    let ReqObj = {
      "policyNo": event.PolicyNo,
      "claimNo": event.ClaimNo,
      "partyNo": event.PartyNo,
      "lossTypeId": event.LosstypeId,
      "userType": this.logindata?.UserType,
      "paymentType": "",
      "createdBy": event.CreatedBy,
      "garageId": "",
      "userId": this.logindata?.LoginId
    }
    return this.lossService.onGetBase64Image(UrlLink, ReqObj).subscribe((data: any) => {

      this.downloadMyFile(data)
    }, (err) => {

      this.handleError(err);
    })
  }
  downloadMyFile(data) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', data.PdfOutFilePath);
    link.setAttribute('download', data.FileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  saveLossDetails(status, event, item) {
    let ReqObj = {
      "ChassisNo": item.ChassisNo,
      "ClaimNo": item.ClaimNo,
      "Driverdob": item.DriverDob,
      "Driveremailid": item.DriverEmailId,
      "Drivergender": item.DriverGender,
      "Driverlicenseexpirydate": item.DriverLicenseExpiryDate,
      "Driverlicenseno": item.DriverLicenseNo,
      "Drivermobile": item.DriverMobile,
      "Drivername": item.DriverName,
      "Drivernationality": item.DriverNationality,
      "Address": '',
      "DriverMobileCode": '',
      "Entrydate": "",
      "Incidentlatitudelongitude": item.IncidentLatitudeLongitude,
      "Incidentlocationlongitude": item.IncidentLocationLongitude,
      "LossNo": item.LossNo,
      "Partyno": item.PartyNo,
      "PolicyNo": item.PolicyNo,
      "Remarks": '',
      "Status": status,
      "Losstypeid": item.LosstypeId,
      "ConsumablesCost": "",
      "LabourCost": "",
      "SectionIds": item.SectionIds,
      "Claimrefno": this.claimDetails.Claimrefno,
      "SparepartsCost": 0,
      "TotalLabourHour": 0,
      "PerHourLabourCost": 0,
      "LessBetterment": 0,
      "LessExcess": 0,
      "UnderInsurance": 0,
      "SalvageAmount": 0,
      "TotalPrice": 0,
      "SaveorSubmit": event,
      ...this.commonReqObject()
    }



    let UrlLink = `api/save/claimLossDetails`;
    return this.lossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {

      if (data.Response == "SUCCESS") {
        this.onUpdateStatus(status, item)
        this.onGetLossList(item);

      }
      if (data.ErrorsList) {
        this.errorService.showLossErrorList(data.ErrorsList);

      }
    }, (err) => {
      this.handleError(err);
    })
  }
  onInvoiceLossPdf(event) {
    let UrlLink = "pdf/invoicegenerate";
    let ReqObj = {
      "policyNo": event.PolicyNo,
      "claimNo": event.ClaimNo,
      "partyNo": event.PartyNo,
      "lossTypeId": event.LosstypeId,
      "userType": this.logindata?.UserType,
      "paymentType": "",
      "createdBy": event.CreatedBy,
      "garageId": "",
      "userId": this.logindata?.LoginId
    }
    return this.lossService.onGetBase64Image(UrlLink, ReqObj).subscribe((data: any) => {

      this.downloadMyFile(data)
    }, (err) => {

      this.handleError(err);
    })
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
