import { find } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { SurveyorService } from './../../../commonmodule/surveyor/surveyor.service';
import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../services/errors/error.service';
import { Location } from '@angular/common'
import Swal from 'sweetalert2';
import { StatusUpdateComponent } from '../../lossinfocomponent/status-update/status-update.component';
import { MatDialog } from '@angular/material/dialog';


export interface PeriodicElement {
  AllottedYN: any,
  BranchCode: any,
  BranchCodeDesc: any,
  CityId: any,
  CityName: any,
  CountryId: any,
  CountryName: any,
  EffectiveDate: any,
  EmailId: any,
  EntryDate: any,
  InsuranceDesc: any,
  InsuranceId: any,
  LoginId: any,
  MobileNo: any,
  NoOfCompletedTask: any,
  NoOfPendingTask: any,
  RegionCode: any,
  RegionCodeDesc: any,
  Remarks: any,
  Response: any,
  StateId: any,
  StateName: any,
  Status: any,
  SurveyorAddress: any,
  SurveyorId: any,
  SurveyorLicenseNo: any,
  SurveyorName: any,
  WilayatId: any,
  WilayatName: any,
}

@Component({
  selector: 'app-surveyor-grid',
  templateUrl: './surveyor-grid.component.html',
  styleUrls: ['./surveyor-grid.component.css']
})
export class SurveyorGridComponent implements OnInit {

  public logindata: any;
  public claimDetails: any;
  public LossDetails: any;
  public GarageList: any = [];
  public ChoosedList: any = [];
  public selectedSurveyor: any;
  public LossStatus: any;

  public tableData: PeriodicElement[];
  public tableData1: PeriodicElement[];

  public columnHeader: any;
  public columnHeader1: any;

  public garageAllotedList: any;
  constructor(
    private surveyorService: SurveyorService,
    private errorService: ErrorService,
    private location: Location,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,

  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.LossDetails = JSON.parse(sessionStorage.getItem('LossDetails'));
    this.LossStatus = this.LossDetails.Status;
    console.log(this.LossDetails)
  }

  ngOnInit(): void {

    this.onReCallSurveyorList(this.LossDetails);
    this.onReCallGarageList(this.LossDetails);
    console.log("Loss Statussssss", this.LossStatus);
    this.surveyorService.getSurveyorList.subscribe((event: any) => {
      console.log(event);
      this.columnHeader = {
        'checkboxs': 'SELECT',
        'SurveyorId': 'SURVEYOR ID',
        'SurveyorName': 'SURVEYOR NAME',
        'NoOfPendingTask': 'NO.OF.PENDING TASK',
        "LoginDetails": "LOGIN DETAILS"

      };
      this.tableData = event;

      if (event != null) {
        let selectedSurveyor = event.find((ele: any) => ele.AllottedYN == "Y");
        this.onGetSurveyorId(selectedSurveyor);

      }

    });
    this.surveyorService.getGarageList.subscribe((event: any) => {
      this.columnHeader1 = {
        'Select': 'SELECTS',
        'GarageId': 'GARAGE ID',
        'GarageName': 'GARAGE NAME',
        'GarageCode': 'GARAGE CODE',
        'PendingJobs': 'PENDING JOBS',
        'LoginDetails': 'Login Details',
        'QuoteProcessedBy': 'Quote Processed By'
      };
      this.GarageList = event;
      
      console.log("garage", event);
      if (this.GarageList != undefined) {
        let allotegaragelist: any = [];
        for (let index = 0; index < this.GarageList.length; index++) {
          const element = this.GarageList[index];
          if(element?.QuoteProcessedBy==null || element?.QuoteProcessedBy==undefined || element.QuoteProcessedBy==''){
            element['QuoteProcessedBy'] = 'Garage';
          }
          if (element.AllottedYN == 'Y') {
            allotegaragelist.push(element.GarageId);

          }
          if(index==this.GarageList.length-1){
           
            this.tableData1 = this.GarageList;
            console.log("Final Garage List",allotegaragelist,this.tableData1);
            this.garageAllotedList = allotegaragelist;
          }
        }
        
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
      "UserId": this.logindata?.OaCode

    }
  }


  onReCallGarageList(LossDetails) {
    this.surveyorService.onGetGarageList(LossDetails);
  }
  onReCallSurveyorList(LossDetails) {
    this.surveyorService.onGetSurveyorList(LossDetails);
  }

  onGetSurveyorId(surveyor) {
    this.selectedSurveyor = surveyor;
    console.log(surveyor);
  }

  onAssignSurveyor() {

    let ReqObj = {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "CreatedBy": this.logindata.LoginId,
      "ClaimNo": this.claimDetails.ClaimNo,
      "PolicyNo": this.claimDetails.PolicyNo,
      "ChassisNo": this.claimDetails.ChassisNo,
      "SurveyorId": this.selectedSurveyor.SurveyorId,
      "RegionId": this.selectedSurveyor.RegionCode,
      "ProductId": "66",
      "SurveyorName": this.selectedSurveyor.SurveyorName,
      "Entrydate": this.selectedSurveyor.EntryDate,
      "AllotedYn": "Y",
      "ApprovedYn": "N",
      "LosstypeId": this.LossDetails.LosstypeId,
      "PartyNo": this.LossDetails.PartyNo,

    }
    console.log(ReqObj)
    Swal.fire({
      title: 'Are you sure?',
      text: "You want assign this Surveyor!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {


        let UrlLink = `api/insertsurveyorapprovaldetail`;
        this.surveyorService.onAssignSurveyor(UrlLink, ReqObj).subscribe((data: any) => {

          console.log("surveyor", data)
          if (data.Response == "Sucess") {
            this.onReCallSurveyorList(this.LossDetails);
            this.onStatusUpdate();

          }

        }, (err) => {
          this.handleError(err);
        })
      }

    })
  }
  onChooseSurveyorSubmit(event){
    let entry = this.GarageList.find(ele=>ele.GarageId=event.GarageId);
    if(entry) entry['QuoteProcessedBy'] = event.QuoteProcessedBy;
    let entry2 = this.ChoosedList.find(ele=>ele.GarageId=event.GarageId);
    if(entry2) entry2['QuoteProcessedBy'] = event.QuoteProcessedBy;
  }
  onGetGarageIDs(event) {
    console.log(event);
    this.ChoosedList = [];
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      let flterList = this.GarageList.find((ele: any) => ele.GarageId == element);
      this.ChoosedList.push({
        "CreatedBy": this.logindata.LoginId,
        "GarageId": flterList.GarageId,
        "GarageName": flterList.GarageName,
        "QuoteProcessedBy": flterList.QuoteProcessedBy
      })
    }
  }

  onAllotedToGarages() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Allot Garages!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.ChoosedList.length==0){
            let entry = this.GarageList.filter(ele=>ele.AllottedYN=='Y');
            if(entry.length!=0){
              let i=0;
              for(let garage of entry){
                this.ChoosedList.push({
                  "CreatedBy": this.logindata.LoginId,
                  "GarageId": garage.GarageId,
                  "GarageName": garage.GarageName,
                  "QuoteProcessedBy": garage?.QuoteProcessedBy
                })
                i+=1;
                if(i==entry.length) this.finalAllotSubmit();
              }
            }
        }
        else this.finalAllotSubmit();
      }
    });

  }
  finalAllotSubmit(){
    let ReqObj = {
      "ChassisNo": this.claimDetails.ChassisNo,
      "ClaimNo": this.claimDetails.ClaimNo,
      "Garages": this.ChoosedList,
      "PolicyNo": this.claimDetails.PolicyNo,
      "ProductId": 66,
      "LosstypeId": this.LossDetails.LosstypeId,
      "PartyNo": this.LossDetails.PartyNo,
      ...this.commonReqObject()
    }


    let UrlLink = "api/insertgarageapprovaldetails";
    return this.surveyorService.onAllotedToGarages(UrlLink, ReqObj).subscribe((data: any) => {

      if (data.Response == "Success") {
        this.onReCallGarageList(this.LossDetails);
        this.onStatusUpdate();
      }
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      if (data.Response == "Sucess") {
        Swal.fire(
          'Garage Assigned Successfully',
          'success',
        )
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  onStatusUpdate() {
    const dialogRef = this.dialog.open(StatusUpdateComponent, {
      width: '100%',
      panelClass: 'full-screen-modal'
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
