import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LossModalComponent } from 'src/app/shared/loss-modal/loss-modal.component';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { Subscription } from 'rxjs';
export interface PeriodicElement {
  Address: any,
  ChassisNo: any,
  ClaimNo: any,
  CountryId: any,
  CreatedBy: any,
  Dob: any,
  Email: any,
  EntryDate: any,
  FaultCategory: any,
  FaultCategoryId: any,
  LossCount: any,
  Mobile: any,
  MobileCode: any,
  Nationality: any,
  PartyInsDes: any,
  PartyInsId: any,
  PartyName: any,
  PartyNo: any,
  PartyType: any,
  PartyTypeId: any,
  PolicyNo: any,
  RecoveryAmount: any,
  RegistrationNo: any,
  Remarks: any,
  SettledAmount: any,
  SettledOn: any,
  SettledTo: any,
  Status: any,
}
export interface LossData {
  Address: any,
  CategoryDesc: any,
  CategoryId: any,
  ChassisNo: any,
  ClaimNo: any,
  ClaimRefNo: any,
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
  PartyName: any,
  PartyNo: any,
  PerHourLabourCost: any,
  PolicyNo: any,
  Remarks: any,
  SalvageAmount: any,
  SectionIds: any,
  SparepartsCost: any,
  Status: any,
  Statusdescrip: any,
  TheftCrDairyno: any,
  TheftDate: any,
  TheftDiscovredBy: any,
  TheftEstReplace: any,
  TheftPlace: any,
  TheftReportedTo: any,
  TheftReportedWhen: any,
  TheftReportedWhich: any,
  TheftStolen: any,
  TheftTime: any,
  TotalLabourHour: any,
  TotalPrice: any,
  UnderInsurance: any,
  UserType: any,
  VictAddress: any,
  VictAge: any,
  VictAnnualIncome: any,
  VictBreadWinner: any,
  VictComAddress: any,
  VictComDesignation: any,
  VictComName: any,
  VictComPoBox: any,
  VictDependAddre: any,
  VictDependName: any,
  VictDependYn: any,
  VictEmpType: any,
  VictGender: any,
  VictLossDesc: any,
  VictMedAtten: any,
  VictName: any,
  VictNameAddr: any,
  VictOccupation: any,
  VictPoBox: any,
  VictmMonthIncome: any,
}
@Component({
  selector: 'app-info-about-claim',
  templateUrl: './info-about-claim.component.html',
  styleUrls: ['./info-about-claim.component.css']
})
export class InfoAboutClaimComponent implements OnInit,OnChanges,OnDestroy {
  public claimDetails:any;
  public logindata:any;
  public partyList: any;
  public tableData: PeriodicElement[] | any;
  public columnHeader: any;
  public innerTableData: LossData[] | any;
  public innerColumnHeader: any;
  private subscription = new Subscription();

  constructor(
    private lossService: LossService,
    private errorService: ErrorService,
    public dialog: MatDialog,
    private spinner:NgxSpinnerService

  ) {
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;


   }

  ngOnInit(): void {
    this.onInitialFetchData();
    this.subscription = this.lossService.getClaimIntimateval.subscribe((ele:any)=>{
    this.onInitialFetchData();

    })

  }

  ngOnChanges(){

  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  async onInitialFetchData() {
    this.partyList = await this.lossService.onGetPartyList();
    console.log(this.partyList);
    this.columnHeader = [
      {
        key: "more",
        display: "MORE VIEW",
        config: {
          isMoreView: true,
          actions: ["VIEW"]
        }
      },
      { key: "PartyName", display: "PARTY NAME" },
      { key: "PartyInsDes", display: "PARTY DESCRIPTION" },
      { key: "LossCount", display: "TOTAL LOSS" },
    ]
    this.tableData = this.partyList;
    console.log(this.partyList);
    this.onGetLossList(this.partyList[0]);



  }





  async onGetLossList(item) {
    console.log(item)
    this.innerTableData = await this.lossService.onGetLossList(item);
    console.log(this.innerTableData)
    this.innerColumnHeader = [
      { key: "LossNo", display: "LOSS NO" },
      { key: "Losstypedescp", display: "LOSS TYPE" },
      { key: "TotalPrice", display: "TOTAL PRICE" },
      { key: "Statusdescrip", display: "LOSS STATUS" },
      { key: "EntryDate", display: "LOSS CREATED" },
      { key: "CreatedBy", display: "CREATED BY" },
      {
        key: "action",
        display: "VIEW",
        config: {
          isLossAction: true,
          actions: ["VIEW"]
        }
      }
    ];
  }

  onLossListView(item) {

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

    console.log(ReqObj);

    let UrlLink = `api/claimlossdetailsbyid`;
    return this.lossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {

      this.lossService.onGetLossInformation(data);
      this.lossService.onGetLossRowInformation(item);
      sessionStorage.setItem('LossDetails', JSON.stringify(item));
      const dialogRef = this.dialog.open(LossModalComponent, {
        width: '100%',
        panelClass: 'full-screen-modal',
        data: {MylossData:data,hidebtn:true}
      });

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
