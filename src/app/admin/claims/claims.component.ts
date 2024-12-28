declare var $: any;
import { Component } from '@angular/core';
import { AdminService } from '../admin.service';
import *  as  Mydatas from '../../appConfig.json';
import { DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Chart, registerables } from 'chart.js';
//HighCharts Section
import { Chart } from 'highcharts';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
highcharts3D(Highcharts);

// Chart.register(...registerables);

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css'],
})
export class ClaimsComponent {
  public _chart: any;
  public myChart: any;
  public claimlevelMyChart: any;

  public ClaimIntimatedcount: any = [];
  public StatusDescription: any = [];
  public _Status: any = [];

  public _LossCount: any = [];
  public Lossstatus: any = [];
  public Lossstatusdesc: any = [];
  public Losstotalcount: any = [];
  public Lossusertype: any = [];
  lossCountShow: boolean = false;
  ClaimsTruesection: boolean = false;

  public _LossStatusCount: any = [];
  public LossStatusTotalCount: any = [];
  public LossStatusArray: any = [];
  public _ClaimLossData_grid: any = [];
  public ClaimLossLogiIdshow: any = [];
  public lossstatdesc: any = '';
  public UserTypeData: any;
  public _RowData: any;
  public _sStatus: any;

  public ClaimIntimateGrid: any = [];
  public StatusDescData: any = '';


  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public panelOpen: boolean;
  public isPaginator: boolean = false;
  public calimsubcountsection: boolean = false;
  public claimgridtable: boolean = false;
  public Claimstatuscount: any = [];
  public ClaimGridTable: any = [];
  public claimSubStatusCount: any = [];
  public Claimnumberinfo: any = [];
  public logindata: any = {};

  //Claim Table Subsection Data
  Claim_number: any = '';
  Status: any = '';
  StatusDesc: any = '';
  hours: any = '';
  min: any = ''; sec: any = ''; Days: any = ''

  closeResult: string;
  Surveyor: any;
  grid: any;
  StartDate: any;
  EndedDate: any;
  minDate: Date;
  EntryDate: any;
  EmptyentryDate: any;
  Emptyenddate: any;
  EndDate: any;
  maxDate = new Date();
  constructor(private adminService: AdminService, private datePipe: DatePipe, private modalService: NgbModal) {
    console.log("Entry Date", this.StartDate);
    if (!localStorage.getItem('fooClaims')) {
      localStorage.setItem('fooClaims', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('fooClaims')
    }

    // $("#count").on("click", function () {
    //   alert("Handler for `click` called.");
    // });
  }

  ngOnInit(): void {
    this.panelOpen = true;
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    console.log(this.logindata);
    var d = new Date();
    this.EndDate = d.toLocaleDateString()
    console.log(this.EndDate);
    d.setDate(d.getDate() - 15);
    this.EntryDate = d.toLocaleDateString()
    console.log(this.EntryDate);
    this.IntimationCount();
    $("#count").click(function () {
      alert("Handler for `click` called.");
    });
  }
IntimationCount() {
  let UrlLink = "api/graph/claimintimation";
  this.StartDate = this.datePipe.transform(this.EntryDate, "dd/MM/yyyy")
  this.EndedDate = this.datePipe.transform(this.EndDate, "dd/MM/yyyy")
  let ReqObj = {
    "UserType": this.logindata.UserType,
    "CreatedBy": this.logindata.LoginId,
    "InsCompanyId": this.logindata.InsuranceId,
    "BranchCode": this.logindata.BranchCode,
    "StartDate": this.StartDate,
    "EndDate": this.EndedDate,
  }
  this.adminService.onPostMethod(UrlLink, ReqObj).subscribe((data: any) => {
    console.log("Data", data);
    this.ClaimIntimatedcount = [];
    this.StatusDescription = [];
    this.ClaimIntimatedcount = data;
    $('.datapieone').css('visibility', 'visible');
    if (this.ClaimIntimatedcount != null) {
      for (let i = 0; i < this.ClaimIntimatedcount.length; i++) {
        console.log("this.ClaimIntimatedcount====", this.ClaimIntimatedcount[i]);
        this.StatusDescription.push({ "name": this.ClaimIntimatedcount[i].StatusDesc, "y": Number(this.ClaimIntimatedcount[i].TotalCount), "id": this.ClaimIntimatedcount[i].Status });
        this._Status.push(this.ClaimIntimatedcount[i].Status);
      }

      if (this.ClaimIntimatedcount.length - 1) {
        console.log("Final List", this.StatusDescription)
        console.log("Final List 1", this.StatusDescription[0].name)
        var that = this;
        this._chart = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: true,
            type: 'pie',
            renderTo: 'PieChart',
            options3d: {
              enabled: true,
              alpha: 45,
              beta: 0,
            },
          },
          title: {
            text: 'Initimated Claims'
          },
          tooltip: {
            pointFormat: '{series.name}: {point.y} & {point.percentage:.1f}%'
          },
          accessibility: {
            point: {
              valueSuffix: '%'
            }
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 45,
              size: 180,
              dataLabels: {
                enabled: false,
                format: '{point.name}: {point.y}({point.percentage:.1f} %)'
              }
            }
          },
          series: [{
            name: 'Claim TotalCount & Percentage ',
            colorByPoint: true,
            data: this.StatusDescription,
            point: {
              events: {
                click: function (event) {
                  if (this.id == 'A') {
                    that.LossCount()
                  }
                  else {
                    that.Claimintimatedgrid(this.id, this.name)
                    $('.BarChart').css('display', 'none');
                    $('.LossGridIntitmated').css('display', 'none');
                  }
                },
              }
            }
          }]
        }
        Highcharts.chart('PieChart', this._chart);
      }
    }

  })
}

  public LossCount() {
  let UrlLink = "api/graph/claimloss";
  this.StartDate = this.datePipe.transform(this.EntryDate, "dd/MM/yyyy")
  this.EndedDate = this.datePipe.transform(this.EndDate, "dd/MM/yyyy")
  let ReqObj = {
    "UserType": this.logindata.UserType,
    "CreatedBy": this.logindata.LoginId,
    "InsCompanyId": this.logindata.InsuranceId,
    "BranchCode": this.logindata.BranchCode,
    "StartDate": this.StartDate,
    "EndDate": this.EndedDate,
  }
  this.adminService.onPostMethod(UrlLink, ReqObj).subscribe((data: any) => {
    console.log("Data", data);
    this._LossCount = [];this.Lossstatusdesc=[];this.Lossusertype=[];
    if (this._LossCount != null) {
      this._LossCount = data;
      for (let i = 0; i < this._LossCount.length; i++) {
        console.log("this._LossCount====", this._LossCount[i]);
        this.Lossstatusdesc.push({ "name": this._LossCount[i].StatusDesc, "y": Number(this._LossCount[i].TotalCount), "subId": this._LossCount[i].UserType });
        this.Lossstatus.push(this._LossCount[i].Status);
        this.Lossusertype.push(this._LossCount[i].UserType);
      }
      var self: any = this;
      if (this._LossCount.length - 1) {
        this._chart = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: true,
            type: 'pie',
            renderTo: 'PieChart1',
            options3d: {
              enabled: true,
              alpha: 45,
              beta: 0,
            },
          },
          title: {
            text: 'Claim Approved'
          },
          tooltip: {
            pointFormat: '{series.name}: {point.y} & {point.percentage:.1f}%'
          },
          accessibility: {
            point: {
              valueSuffix: '%'
            }
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 45,
              size: 180,
              dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y}({point.percentage:.1f} %)'
              }
            }
          },
          series: [{
            name: 'Claims Loss TotalCount & Percentage',
            colorByPoint: true,
            data: this.Lossstatusdesc,
            point: {
              events: {
                click: function (event) {
                  if (this.subId) {
                    console.log("SubId", this.subId);
                    self.Lossstatuscount(this.subId)
                    $('.GridIntitmated').css('display', 'none');
                  }
                }
              }
            }
          }]
        }
        Highcharts.chart('PieChart1', this._chart);
        $('.Intitmated').css('display', 'block');
      }
    }

  })
}
//CLAIM INTIMATED GRID
Claimintimatedgrid(rowdata: any, descdata: any) {
  let UrlLink = "api/getallclaimintidetails";
  this.StartDate = this.datePipe.transform(this.EntryDate, "dd/MM/yyyy");
  this.EndedDate = this.datePipe.transform(this.EndDate, "dd/MM/yyyy");
  let ReqObj = {
    "UserType": this.logindata.UserType,
    "CreatedBy": this.logindata.LoginId,
    "InsCompanyId": this.logindata.InsuranceId,
    "BranchCode": this.logindata.BranchCode,
    "StartDate": this.StartDate,
    "EndDate": this.EndedDate,
    "Status": rowdata
  }
  this.adminService.onPostMethod(UrlLink, ReqObj).subscribe((data: any) => {
    if (data) {
      this.ClaimIntimateGrid = data;
      this.StatusDescData = descdata;
      $('.GridIntitmated').css('display', 'block');
    }
  })
}
//LOSS STATUS COUNT
Lossstatuscount(rowData: any) {
  let UrlLink = "api/graph/claimlossstatus";
  this.StartDate = this.datePipe.transform(this.EntryDate, "dd/MM/yyyy");
  this.EndedDate = this.datePipe.transform(this.EndDate, "dd/MM/yyyy");
  let ReqObj = {
    "UserType": this.logindata.UserType,
    "CreatedBy": this.logindata.LoginId,
    "InsCompanyId": this.logindata.InsuranceId,
    "BranchCode": this.logindata.BranchCode,
    "StartDate": this.StartDate,
    "EndDate": this.EndedDate,
    "FilterUserType": rowData
  }
  this.adminService.onPostMethod(UrlLink, ReqObj).subscribe((data: any) => {
    if (this._LossStatusCount != null) {
      this._LossStatusCount = data;
      this.LossStatusArray = [];
      console.log("ClaimLossstatuscountData", data);
      console.log("RowData", rowData);
      for (let i = 0; i < this._LossStatusCount.length; i++) {
        console.log("this.LossStatusTotalCount**", this._LossStatusCount[i])
        this.LossStatusArray.push({ "name": this._LossStatusCount[i].StatusDesc, "y": Number(this._LossStatusCount[i].TotalCount), "sub_Id": this._LossStatusCount[i].UserType, "stat": this._LossStatusCount[i].Status });
      }
      var self: any = this;
      this._chart = {
        chart: {
          type: 'column',
          options3d: {
            enabled: true,
            alpha: 5,
            beta: 5,
            depth: 50,
            viewDistance: 25
          },
        },
        plotOptions: {
          column: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 25,
            dataLabels: {
              enabled: true,
              format: '{point.name}',
            },
          },
        },
        title: {
          text: 'Loss Status Count',
        },
        series: [
          {
            type: 'column',
            name: 'Loss Status Count',
            data: this.LossStatusArray,
            point: {
              events: {
                click: function (event) {
                  if (this.sub_Id) {
                    console.log("user", this.sub_Id);
                    self.claimLossGrid(this.sub_Id, this.stat, this.name);
                    self.claimcountbasedgrid(this.sub_Id, this.stat);
                  }
                }
              }
            }
          },
        ],
      };
      Highcharts.chart('container', this._chart);
      $('.BarChart').css('display', 'block');
    }
  })
}
//CLAIM LOSS GRID
claimLossGrid(row_Data: any, status: any, descdata: any){
  console.log("ROW**", row_Data)
  console.log("status**", status)
  let UrlLink = "api/getallclaimlossdetails";
  this.StartDate = this.datePipe.transform(this.EntryDate, "dd/MM/yyyy");
  this.EndedDate = this.datePipe.transform(this.EndDate, "dd/MM/yyyy");
  let ReqObj = {
    "UserType": this.logindata.UserType,
    "CreatedBy": this.logindata.LoginId,
    "InsCompanyId": this.logindata.InsuranceId,
    "BranchCode": this.logindata.BranchCode,
    "StartDate": this.StartDate,
    "EndDate": this.EndedDate,
    "Status": status,
    "FilterUserType": row_Data
  }
  this.adminService.onPostMethod(UrlLink, ReqObj).subscribe((data: any) => {
    console.log("Data", data);
    this.lossstatdesc = descdata;
    this.ClaimLossLogiIdshow = data;
    $('.LossGridIntitmated').css('display', 'block');
    $('.countbasedgrid').css('display', 'none');
  })
}
//Loss Based Count Show Grid
checkOnChangecountBasedGrid(row_Data:any,status:any){
  if(this.ClaimLossLogiIdshow.length!=0){
        this._sStatus = status;
        this._ClaimLossData_grid = row_Data.ClaimLossList;
  }
}
claimcountbasedgrid(row_Data: any, status: any){
  this._sStatus = status;
  this._RowData = row_Data;
  console.log(" this._RowData=", this._RowData)
  console.log(" this._sStatus=", this._sStatus)
  let UrlLink = "api/getallclaimlossdetails";
  this.StartDate = this.datePipe.transform(this.EntryDate, "dd/MM/yyyy");
  this.EndedDate = this.datePipe.transform(this.EndDate, "dd/MM/yyyy");
  let ReqObj = {
    "UserType": this.logindata.UserType,
    "CreatedBy": this.logindata.LoginId,
    "InsCompanyId": this.logindata.InsuranceId,
    "BranchCode": this.logindata.BranchCode,
    "StartDate": this.StartDate,
    "EndDate": this.EndedDate,
    "Status": this._sStatus,
    "FilterUserType": this._RowData
  }
  this.adminService.onPostMethod(UrlLink, ReqObj).subscribe((data: any) => {
    console.log("Data", data);
    this._ClaimLossData_grid = data[0]?.ClaimLossList;
    $(".btn-primary").click(function () {
      var buttons = $('.btn-primary');
      buttons.toggleClass("active");
      $('.countbasedgrid').css('display', 'block');
    });
  })
}
open(content: any, data: any) {
  this.modalService.open(content, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

  private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}



}
