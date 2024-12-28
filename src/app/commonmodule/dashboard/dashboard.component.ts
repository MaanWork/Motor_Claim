import { Router } from '@angular/router';

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DashboardService } from './dashboard.service';
export interface PeriodicElement {
  BranchCode: any;
  ClaimNo: any;
  Claimrefno: any;
  CreatedBy: any;
  Entrydate: any;
  InsuranceId: any;
  PolicyNo: any;
  RegionCode: any;
  Remarks: any;
  Response: any;
  Status: any;
  Statusdescription: any;
  Trackingid: any;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  public logindata: any = {};
  public panelOpen: boolean;
  public onProcessessGrid: any;
  public quickSummaryDetails: any = [];
  public recentActivities: any = [];
  public NotifiedNumber: any = 5;
  public tableData: PeriodicElement[];
  public tableData1: PeriodicElement[];

  public columnHeader: any;
  public innerColumnHeader: any;

  public columnHeader1: any;
  public innerColumnHeader1: any;
  public barchart = 'bar';
  public piechart = 'pie';

  public accordionchecked: boolean = true;
  // config: zingchart.graphset = {
  //   type: 'line',
  //   series: [{
  //     values: [3, 6, 4, 6, 4, 6, 4, 6]
  //   }],
  // };
  claimStatusList: any[]=[];
  surveyorStatusList: any[]=[];
  garageStatusList: any[]=[];

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.panelOpen = true;
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    console.log(this.logindata)
    this.onInitialFetchData();

  }

  onCollapseToggle() {
    console.log(this.accordionchecked);
    if (this.accordionchecked) {
      this.panelOpen = true;
    } else {
      this.panelOpen = false;

    }

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

  async onInitialFetchData() {
    this.onProcessessGrid = await this.onProcessOfClaims();
    //this.quickSummaryDetails = await this.onQuickSummaryDetails();
    this.recentActivities = await this.onRecentActivityClaims();
    this.tableData = this.recentActivities;
    this.onFilterByDays(3);
    if(this.onProcessessGrid){
      console.log("Dashboard List",this.onProcessessGrid);
      this.setDashBoardGroup();
    }
  }
  setDashBoardGroup(){
    for(let type of this.onProcessessGrid){
        if(type.GroupName){
          if(type.GroupName == 'claimofficer'){
            this.claimStatusList = type.GroupList
          }
          if(type.GroupName == 'surveyor'){
            this.surveyorStatusList = type.GroupList
          }
          if(type.GroupName == 'garage'){
            this.garageStatusList = type.GroupList
          }
        }
    }
  }
  async onProcessOfClaims() {
    let ReObj = {
      "loginId": this.logindata.LoginId,
      "Usertype": this.logindata.UserType,
      "UserId": this.logindata.OaCode,
      ...this.commonReqObject()

    }
    let UrlLink = null;
    if(this.logindata.InsuranceId=='100002') UrlLink = `api/statusmasterbyuserttype`;
    else if(this.logindata.InsuranceId=='100003' || this.logindata.InsuranceId=='100008') UrlLink = `api/statusmasterbyuserttypeV1`;
    let response = (await this.dashboardService.onProcessOfClaims(UrlLink, ReObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  async onQuickSummaryDetails() {
    let ReObj = {
      "RegionCode": this.logindata.RegionCode,
      "UserType": this.logindata.UserType,
      "CreatedBy": this.logindata.LoginId,
      "InsuranceId": this.logindata.InsuranceId,
      "BranchCode": this.logindata.BranchCode,
    }
    let UrlLink = `api/claimquicksummary`;
    let response = (await this.dashboardService.onQuickSummaryDetails(UrlLink, ReObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  async onRecentActivityClaims() {

    this.columnHeader = [
      {
        key: "more",
        display: "MORE VIEW",
        config: {
          isMoreView: true,
          actions: ["VIEW"]
        }
      },
      { key: "Entrydate", display: "DATE MODIFIED" },
      { key: "Claimrefno", display: "CLAIM REF.NO" },
      { key: "ClaimNo", display: "CLAIM NO" },
      { key: "PolicyNo", display: "POLICY NO" },
      {
        key: "Remarks",
        display: "REMARKS",
      }
    ];
    this.innerColumnHeader =
    {
      "Statusdescription": "STATUS",
      "Substatusdescription": "SUB-STATUS",

    }
    let ReObj = {
      "RegionCode": this.logindata.RegionCode,
      "InsuranceId": this.logindata.InsuranceId,
      "BranchCode": this.logindata.BranchCode,
      "CreatedBy": this.logindata.LoginId
    }
    let UrlLink = `api/claimrecentactivitiestracking`;
    let response = (await this.dashboardService.onRecentActivityClaims(UrlLink, ReObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  onDateFormatInEdit(date) {
    if (date) {
      let format = date.split('/');
      var NewDate = new Date(new Date(format[2], format[1], format[0]));
      NewDate.setMonth(NewDate.getMonth() - 1);
      return NewDate;
    }
  }

  onFilterByDays(day) {
    var startDate = new Date();
    var endDate = new Date();
    endDate.setDate(endDate.getDate() - Number(day));
    // endDate.getMonth()+1
    console.log(endDate);
    let result = []
    for (let index = 0; index < this.recentActivities.length; index++) {
      const element = this.recentActivities[index];
      if (this.onDateFormatInEdit(element.Entrydate.slice(0, 10)) >= endDate  && this.onDateFormatInEdit(element.Entrydate.slice(0, 10)) <= startDate) {
        console.log(this.onDateFormatInEdit(element.Entrydate.slice(0, 10)));
        result.push(element);
      }

    }
    this.tableData1 = result;
    this.columnHeader1 = [
      {
        key: "more",
        display: "MORE VIEW",
        config: {
          isMoreView: true,
          actions: ["VIEW"]
        }
      },
      { key: "Entrydate", display: "DATE MODIFIED" },
      { key: "Claimrefno", display: "CLAIM REF.NO" },
      { key: "ClaimNo", display: "CLAIM NO" },
      { key: "PolicyNo", display: "POLICY NO" },
      {
        key: "Remarks",
        display: "REMARKS",
      }
    ];
    this.innerColumnHeader1 =
    {
      "Statusdescription": "STATUS",
      "Substatusdescription": "SUB-STATUS",

    }
    console.log(result);
  }

  onViewClickedClaimData(item) {
    sessionStorage.setItem('reloadOnce','true');
    sessionStorage.setItem("Status", JSON.stringify(item));
    this.router.navigate(['Home/Table']);
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
