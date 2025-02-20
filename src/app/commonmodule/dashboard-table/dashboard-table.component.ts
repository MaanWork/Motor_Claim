import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DashboardTableService } from './dasboard-table.service';
import { Location } from '@angular/common'
import { LossService } from '../loss/loss.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllotedGaragesComponent } from 'src/app/shared/GarageComponent/alloted-garages/alloted-garages.component';
import { StatusTrackComponent } from 'src/app/shared/statusTrackComponent/status-track.component';
import { StatusUpdateComponent } from 'src/app/shared/lossinfocomponent/status-update/status-update.component';
import { Router } from '@angular/router';
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
  NoOfPart: any,
  OutstandingAmt: any,
  PaidAmt: any,
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
  selector: 'app-dashboard-table',
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.css']
})
export class DashboardTableComponent implements OnInit, AfterViewInit {

  public logindata: any = {};
  public StatusData: any = {};
  public claimDataBasedStatus: any = [];
  public tableData: PeriodicElement[];
  public columnHeader: any;
  public innerColumnHeader: any;
  selectedRowData: any=null;




  onActionHandler(event) {
    console.log(event);
  }
  constructor(
    private errorService: ErrorService,
    private dashboardTableService: DashboardTableService,
    private location: Location,
    private lossService: LossService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AllotedGaragesComponent>,
    private router:Router

  ) { }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.StatusData = JSON.parse(sessionStorage.getItem("Status"));
    console.log("Status",this.StatusData);
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

  async ngAfterViewInit() {
    let entryValue = sessionStorage.getItem('reloadOnce');
    if(entryValue){
      sessionStorage.removeItem('reloadOnce');
      window.location.reload();
    }
    else this.onInitialFetchData();

  }

  async onInitialFetchData() {
    this.tableData = [];
    this.claimDataBasedStatus = await this.onGetClaimDetailsBasedStatus();
    this.tableData = this.claimDataBasedStatus;
    let statusCode = this.StatusData?.Statusid;
    if((statusCode=='QAFG') && this.logindata.UserType=='garage'){
      this.columnHeader = [

        {
          key: "more",
          display: "MORE VIEW",
          config: {
            isMoreView: true,
            actions: ["VIEW"]
          }
        },
        { key: "ClaimNo", display: "CLAIM NO" },
        { key: "PolicyNo", display: "POLICY No" },
        { key: "ChassisNo", display: "CHASSIS NO" },
        { key: "SubStatusDesc", display: "CURRENT STATUS"},
        {
          key: "action",
          display: "ACTION",
          config: {
            isGarageAccept: true,
            actions: ["EDIT"]
          }
        }
      ]
    }
    else{
      this.columnHeader = [

        {
          key: "more",
          display: "MORE VIEW",
          config: {
            isMoreView: true,
            actions: ["VIEW"]
          }
        },
        { key: "ClaimNo", display: "CLAIM NO" },
        { key: "PolicyNo", display: "POLICY No" },
        { key: "ChassisNo", display: "CHASSIS NO" },
        { key: "SubStatusDesc", display: "CURRENT STATUS"},
        {
          key: "action",
          display: "ACTION",
          config: {
            isClaimLossEdit: true,
            actions: ["EDIT"]
          }
        }
      ];
    }
    

    this.innerColumnHeader =
    {
      "Claimrefno": "CLAIM REF.NO",
      "losstypedesc": "LOSS TYPE",

    }

    console.log(this.tableData);
  }
  
  async onGetClaimDetailsBasedStatus() {
    let ReObj = {
      "loginId": this.logindata.LoginId,
      "Status": this.StatusData.Statusid,
      "SubStatus": this.StatusData.SubStatus,
      "UserId": this.logindata.OaCode,
      "UserType": this.logindata.UserType,
      ...this.commonReqObject()
    }
     let UrlLink = null;
    if(this.logindata.InsuranceId=='100002') UrlLink = `api/claimdetailslistbystatus`;
    else if(this.logindata.InsuranceId=='100003' || this.logindata.InsuranceId=='100008') UrlLink = `api/claimdetailslistbystatusV1`;
    let response = (await this.dashboardTableService.onGetClaimDetailsBasedStatus(UrlLink, ReObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  updateGarageDetails(rowData,type){
    sessionStorage.setItem('PartyNo',rowData.PartyNo);
    sessionStorage.setItem('Losstypeid',rowData.LosstypeId);
    sessionStorage.setItem('Status',rowData.Status);
    sessionStorage.removeItem('LossDetails');
    sessionStorage.setItem('LossDetails', JSON.stringify(rowData));
    if(this.commonReqObject().InsuranceId!='100002'){
    const dialogRef = this.dialog.open(StatusUpdateComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: rowData
    });
    // dialogRef.afterOpened().subscribe(result => {
      
    // });
    dialogRef.afterClosed().subscribe(result => {
      // sessionStorage.removeItem('LossDetails');
      // sessionStorage.setItem('LossDetails', JSON.stringify(rowData));
      if( result == 'submit'){
    let ReqObj = {
      "ClaimNo": rowData?.ClaimNo,
      "PartyNo": rowData?.PartyNo,
      "LosstypeId": rowData?.LosstypeId,
      "PolicyNo": rowData?.PolicyNo,
      "GarageId": rowData?.GarageId,
      "ApprovedYn": type,
      "ExpectedStartdate": null,
      "LabourCost": null,
      "Noofdays": null,
      "Uploadquatationyn": 'N',
      "GarageRemarks": null,
      "Remarks": "",
      "AllotedYn": 'Y',
      "SaveorSubmit": 'Submit',
      "YoungAgeDriver": null,
      "SparepartsCost": null,
      "VehpartsId": null,
      "ConsumablesCost": null,
      "ClaimofficerRemarks": null,
      "TotalLabourHour": null,
      "PerHourLabourCost": null,
      "SalvageAmount": null,
      "TotalPrice": null,
      ...this.commonReqObject()
    }
    let UrlLink = `api/updategarageapprovaldetail`;
    return this.lossService.onUpdateStatus(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("saveloss", data);
      if (data.Response == "Success") {
          if(type=='A') this.onUpdateStatus(rowData,'QA')
          else  this.onUpdateStatus(rowData,'QR')
        
      }
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);

      }
    }, (err) => {
      this.handleError(err);
    })
  }
});
  }
  else{
      let ReqObj = {
        "ClaimNo": rowData?.ClaimNo,
        "PartyNo": rowData?.PartyNo,
        "LosstypeId": rowData?.LosstypeId,
        "PolicyNo": rowData?.PolicyNo,
        "GarageId": rowData?.GarageId,
        "ApprovedYn": type,
        "ExpectedStartdate": null,
        "LabourCost": null,
        "Noofdays": null,
        "Uploadquatationyn": 'N',
        "GarageRemarks": null,
        "Remarks": "",
        "AllotedYn": 'Y',
        "SaveorSubmit": 'Submit',
        "YoungAgeDriver": null,
        "SparepartsCost": null,
        "VehpartsId": null,
        "ConsumablesCost": null,
        "ClaimofficerRemarks": null,
        "TotalLabourHour": null,
        "PerHourLabourCost": null,
        "SalvageAmount": null,
        "TotalPrice": null,
        ...this.commonReqObject()
      }
      let UrlLink = `api/updategarageapprovaldetail`;
      return this.lossService.onUpdateStatus(UrlLink, ReqObj).subscribe(async (data: any) => {
  
        console.log("saveloss", data);
        if (data.Response == "Success") {
            if(type=='A') this.onUpdateStatus(rowData,'QA')
            else  this.onUpdateStatus(rowData,'QR')
          
        }
        if (data.Errors) {
          this.errorService.showValidateError(data.Errors);
  
        }
      }, (err) => {
        this.handleError(err);
      })
  }
  }
  onUpdateStatus(rowData,status){
    let UrlLink = null;
    if(this.logindata.InsuranceId=='100002') UrlLink = `api/updateclaimstatus`;
    else if(this.logindata.InsuranceId=='100003' || this.logindata.InsuranceId=='100008') UrlLink = `api/updateclaimstatusV1`; 
     
    let ReqObj = {
      "ClaimNo": rowData?.ClaimNo,
      "PolicyNo": rowData?.PolicyNo,
      "InsuranceId": this.logindata.InsuranceId,
      "Status": status,
      "BranchCode": this.logindata.BranchCode,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "GarageId": rowData?.GarageId,
      "Remarks": status== 'QA' ? 'Quote Accepted' : 'Quote Rejected',
      "UserType": this.logindata.UserType,
      "PartyNo": rowData?.PartyNo,
      "Losstypeid": rowData?.LosstypeId,
      "Authcode": sessionStorage.getItem('UserToken')
    }

    return this.lossService.onUpdateStatus(UrlLink, ReqObj).subscribe(async (data: any) => {

      if (data.Response == "Success") {
        if(status=='QA'){
          sessionStorage.removeItem('LossDetails');
          sessionStorage.setItem('LossDetails', JSON.stringify(this.selectedRowData));
          this.lossService.GetClaimLossDetails(this.selectedRowData);
        }
        else this.onInitialFetchData();
      }
      if (data.Errors) {
        console.log(data);
        this.errorService.showValidateError(data.Errors);

      }
    }, (err) => {
      this.handleError(err);
    })
  }
  onGarageReject(rowData){
    
    this.updateGarageDetails(rowData,'R');
    
  }
  onGarageAccept(rowData){
    this.selectedRowData = rowData;
    this.updateGarageDetails(rowData,'A');
  }
  checkHeader(data) {
    if (data == 'studentID') {
      console.log('stud')
      return 'Student ID';
    } else {
      console.log('false')
      return 'INVALID DATA';
    }
  }
  onClaimLossStatusTrack(row){
    sessionStorage.setItem('LossDetails', JSON.stringify(row));
    sessionStorage.setItem('ChassisNumber',row.ChassisNo);
    const dialogRef = this.dialog.open(StatusTrackComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: row
    });
  }
  onClaimLossEdit(row) {
    sessionStorage.removeItem('LossDetails');
    sessionStorage.setItem('LossDetails', JSON.stringify(row));
    this.lossService.GetClaimLossDetails(row);

  }

  onAllotedGarage(row) {
    sessionStorage.setItem('LossDetails', JSON.stringify(row));
    sessionStorage.setItem('ChassisNumber',row.ChassisNo);
    const dialogRef = this.dialog.open(AllotedGaragesComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: row.GarageAllotedDetail
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("Closed Result",result);
      if(result && !sessionStorage.getItem("GarageLossDetails")) this.onApproveGarage(result);
      //this.saveMessage(result);
    });
  }
  onApproveGarage(ReqObj){
    let UrlLink = `api/updategarageapprovaldetail`;
    return this.lossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.ErrorsList) {
        this.errorService.showLossErrorList(data.ErrorsList);
      }
      else {
          this.onStatusUpdate();
      }
    });
  }
  onStatusUpdate() {
    const dialogRef = this.dialog.open(StatusUpdateComponent, {
      width: '100%',
      panelClass: 'full-screen-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.saveMessage(result);
    });

  }



  back(): void {
    this.location.back()
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
