import { AllotedGaragesComponent } from './../../shared/GarageComponent/alloted-garages/alloted-garages.component';
import { LossService } from './../../commonmodule/loss/loss.service';
import { DashboardTableService } from './../../commonmodule/dashboard-table/dasboard-table.service';
import { ModalComponent } from '../../commonmodule/dashboard-table/modal/modal.component';
import { Component, OnInit, ViewChild, Input, AfterViewInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LossModalComponent } from 'src/app/shared/loss-modal/loss-modal.component';
import Swal from 'sweetalert2';
import { ClaimjourneyService } from 'src/app/commonmodule/claimjourney/claimjourney.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tableData;
  @Input() columnHeader;
  @Input() garageAllotedList

  @Output() public GetLossListById = new EventEmitter<any>();
  @Output() public GetSurveyorListById = new EventEmitter<any>();
  @Output() public GetClaimLossDetails = new EventEmitter<any>();
  @Output() public GetClaimApproverAllotDetails = new EventEmitter<any>();
  @Output() public onLossEdit = new EventEmitter<any>();
  @Output() public onLossStatus = new EventEmitter<any>();
  @Output() public onGetGarageIDs = new EventEmitter<any>();
  @Output() public SurveyorSubmitYn = new EventEmitter<any>();
  // @Output() public onGetGarageIDs = new EventEmitter<any>();



  public GarageIdArray: any = [];
  public claimDetails: any;

  public statusApproved: boolean = false;
  public statusRejected: boolean = false;
  public statusPending: boolean = false;
  objectKeys = Object.keys;

  dataSource;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public logindata: any = {};

  public GarageId = {};
  centered = false;
  disabled = false;
  unbounded = false;

  radius: number;
  color: string;
  constructor(
    public dialog: MatDialog,
    private dashboardTableService: DashboardTableService,
    private errorService: ErrorService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private lossService: LossService,
    private claimjourneyService: ClaimjourneyService,
    public dialogRef: MatDialogRef<AllotedGaragesComponent>,

  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    console.log(this.claimDetails,this.logindata.UserType);

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

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }
  onSelectQuoteProcessed(rowData,value){
    console.log("Row Data",rowData);
    rowData['QuoteProcessedBy'] = value;
    this.SurveyorSubmitYn.emit(rowData);
  }
  onGeneratePdf(rowData) {
    

    let UrlLink = "pdf/accidentform";
    let reqObj = {
      "policyNo": rowData.PolicyNo,
      "claimNo": rowData.Claimrefno
    }
    return this.lossService.onGetBase64Image(UrlLink, reqObj).subscribe((data: any) => {
      console.log("108Data", data);

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
  ngOnInit() {
    console.log(this.tableData);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.GarageIdArray = this.garageAllotedList;

  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async onViewData(rowData) {
    console.log(rowData);
    let claimrefNo = "";
    if(rowData.Claimrefno) claimrefNo = rowData.Claimrefno;
    else if(rowData.ClaimRefNo) claimrefNo = rowData.ClaimRefNo;
    let obj = {
      'Claimrefno': claimrefNo,
      'PolicyNo': rowData.PolicyNo,
    }
     let claimData = await this.dashboardTableService.onViewClaimIntimation(rowData);
     console.log("View Claim Data",claimData)
    if(claimData){
      const dialogRef = this.dialog.open(ModalComponent,{
        width: '100%',
        panelClass: 'full-screen-modal',
        data:{statusUpdate:'statusUpdate',ViewClaimData:claimData}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }
  onEditClaimData(rowData){
    console.log("Edit Claim Data",rowData);
    sessionStorage.setItem('editClaimId', rowData.Claimrefno);
    if(rowData.ChassisNo){
      sessionStorage.setItem('chassisNo',rowData.ChassisNo);
    }
    sessionStorage.setItem('SearchValue', rowData.PolicyNo);
    sessionStorage.setItem('editPolicyNo', rowData.PolicyNo);
    this.router.navigate(['./Home/Claimforms']);
  }
  onGetClaimLossDetails(row) {
    console.log(row);
    sessionStorage.setItem('LossDetails', JSON.stringify(row));
    this.GetClaimLossDetails.emit(row);
  }

  onMoveToGarageSheet(row) {
    sessionStorage.setItem("GarageLossDetails", JSON.stringify(row));
    this.router.navigate(['/Home/Garage']);
    this.dialogRef.close();
  }
  onMoveToLOPSheet(row){
    sessionStorage.setItem("GarageLossDetails", JSON.stringify(row));
    this.router.navigate(['/Home/PendingAuthLetter']);
    this.dialogRef.close();
  }
  onViewGarageList(row) {
    sessionStorage.setItem('LossDetails', JSON.stringify(row));
    const dialogRef = this.dialog.open(AllotedGaragesComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: row.GarageAllotedDetail
    });

  }

  onLossModalView(row) {
    this.onLossEdit.emit(row);

  }

  onLossStatusView(row) {
    this.onLossStatus.emit(row);
  }

  garageSet(allote, id) {
    if (allote == 'Y') {
      return true;

    }
    // console.log(allote,id)
  }

  onGarageChange(event, id) {
    console.log(event.checked, id);
    if (event.checked === true) {
      this.GarageIdArray.push(id);
    }
    if (event.checked === false) {
      var index: number = this.GarageIdArray.indexOf(id);
      this.GarageIdArray.splice(index, 1);
    }

    this.onGetGarageIDs.emit(this.GarageIdArray);
    console.log(this.GarageIdArray);
  }

  onLossDelete(item) {
    let ReqObj = {
      "ChassisNo": item.ChassisNo,
      "ClaimNo": item.ClaimNo,
      "PolicyNo": item.PolicyNo,
      "PartyNo": item.PartyNo,
      "LosstypeId": item.LosstypeId,
      "LossNo": item.LossNo,
      "CreatedBy": this.logindata.LoginId,
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "UserType":item.UserType
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

          console.log("LossDelete", data);
          if (data.Response == "Successfully Deleted") {
            this.GetLossListById.emit(item);
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

  onAssignToSurveyor(event) {
    sessionStorage.setItem('LossDetails', JSON.stringify(event));
    this.router.navigate(['/Home/Surveyor']);
  }

  onSurveyorSelection(surveyor) {
    this.GetSurveyorListById.emit(surveyor);
    console.log(surveyor);
  }
  onClaimSelection(claim) {
    this.GetClaimApproverAllotDetails.emit(claim);
    console.log(claim);
  }
  onsurveyorApproverStatus(status, item) {
    if (status == 'SA') {
      this.statusApproved = true;
      this.statusRejected = false;
      this.statusPending = false;
        this.saveLossDetails(status,'Save',item);
    }
    if (status == 'SR') {
      this.statusApproved = false;
      this.statusRejected = true;
      this.statusPending = false;
     this.onUpdateStatus(status,item);
            this.GetLossListById.emit(item);


    }
    if (status == 'AS') {
      this.statusApproved = false;
      this.statusRejected = false;
      this.statusPending = true;
     this.onUpdateStatus(status,item);
            this.GetLossListById.emit(item);


    }
    console.log(status, item);
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



    console.log(ReqObj)

    return this.lossService.onUpdateStatus(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("saveloss", data);
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
      }
      if (data.Errors) {
        console.log(data);
        this.errorService.showValidateError(data.Errors);

      }
    }, (err) => {
      this.handleError(err);
    })

  }

   saveLossDetails(status,event,item) {


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
      "Status": "",
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


    console.log(ReqObj)

    let UrlLink = `api/save/claimLossDetails`;
    return this.lossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("saveloss", data);
      if (data.Response == "SUCCESS") {
        this.onUpdateStatus(status,item)
        this.GetLossListById.emit(item);

      }
      if (data.ErrorsList) {
        this.errorService.showLossErrorList(data.ErrorsList);

      }
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
