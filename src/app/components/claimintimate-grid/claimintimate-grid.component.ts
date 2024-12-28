import { NgxSpinnerService } from 'ngx-spinner';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { MatDialog } from '@angular/material/dialog';
import { DashboardTableService } from 'src/app/commonmodule/dashboard-table/dasboard-table.service';
import { ModalComponent } from 'src/app/commonmodule/dashboard-table/modal/modal.component';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
export interface DataTableElement {
  CoverInfo: any,
  CustomerInfo: any,
  DriverInfo: any,
  PolicyInfo: {
    AgencyRepair: any;
    Bank: any,
    Branch: any,
    Broker: any,
    BusinessType: any,
    Civilid: any,
    Contactpername: any,
    Customer: any,
    Department: any,
    Divisioncode: any,
    Endtno: any,
    FleetPolicy: any,
    Insured: any,
    PolicyFrom: any,
    PolicyNo: any,
    PolicyTo: any,
    PolicyTypeId: any,
    Producer: any,
    Product: any,
    ProductCode: any,
    ProductDesc: any,
    SourceOfBusiness: any,
    Uwyear: any,
  },
  VehicleInfo: {
    Aaaroadsideassistanceno: any,
    Agencyrepair: any,
    Amountclaimedbefore: any,
    ChassisNo: any,
    Countryofmake: any,
    Couponcodehm: any,
    Couponcodepa: any,
    Couponcodetravel: any,
    Currency: any,
    Dateof1stregistration: any,
    Drivinglicenceissuedon: any,
    Endtno: any,
    Engineno: any,
    Geographicalextension: any,
    Importorigin: any,
    Importvehicleyn: any,
    Indexno: any,
    Insureddriversdob: any,
    Insuredname: any,
    Iterationno: any,
    Manufactureyear: any,
    Mulkiyafromdate: any,
    Mulkiyatodate: any,
    Ncd: any,
    Noofclaims: any,
    Offroadcover: any,
    Orangecardbookid: any,
    Orangecardno: any,
    Orangecardtype: any,
    Orangecardyn: any,
    Platenocharacter: any,
    Praihpremfc: any,
    Praihsifc: any,
    Profession: any,
    Pwserror: any,
    Pwsresponsetype: any,
    Quotationpolicyno: any,
    Registrationformno: any,
    Remarks: any,
    Requestreferenceno: any,
    Responsetime: any,
    Seating: any,
    Seats: any,
    Sectiondata: any,
    Sectionplus: null
    Status: any,
    Suminsured: any,
    Tiraprodcode: any,
    Tiraprodcodedesc: any,
    Tonnage: any,
    Vehbodytype: any,
    Vehiclecategory: any,
    Vehiclecc: any,
    Vehiclemakemodel: any,
    Vehiclemodeldesc: any,
    Vehicletonnagecc: any,
    Vehicletonnageccstr: any,
    Vehicletype: any,
    Vehicletypedesc: any,
    Vehicletypestr: any,
    Vehmake: any,
    Vehmodel: any,
    Vehtype: any,
  },
}
export interface PeriodicElement {
  Accidentdate: any,
  AssignedDate: any,
  Assuredname: any,
  Causeofloss: any,
  ChassisNo: any,
  ClaimNo: any,
  ClaimStatus: any,
  Claimchannnel: any,
  Claimrefno: any,
  Contactno: any,
  Driveremailid: any,
  Drivermobile: any,
  Drivername: any,
  Email: any,
  Entrydate: any,
  PendingDays: any,
  Policereportno: any,
  Policereportsource: any,
  PolicyNo: any,
  Remarks: any,
  Status: any,
}
@Component({
  selector: 'app-claimintimate-grid',
  templateUrl: './claimintimate-grid.component.html',
  styleUrls: ['./claimintimate-grid.component.css']
})
export class ClaimintimateGridComponent implements OnInit {
  public tableData1: DataTableElement[];
  public tableData: PeriodicElement[];
  public columnHeader: any;
  public innerColumnHeader: any;
  public columnHeader1:any;
  public columnHeader2:any;
  public columnHeader3:any;

  public innerColumnHeader1:any;
  public innerColumnHeader2:any;
  public innerColumnHeader3:any;



  public columnHeader4: any;
  panelOpenState = false;
  policyNumber: any = "";
  public regNumber:any;
  public logindata: any;
  public statusKey: any;
  public claimStatusKey: any;
  public NotifiedClaims: any[]=[];
  public ApprovedClaims: any[]=[];
  public RejectedClaims: any[]=[];
  public ClarificationClaims: any[]=[];
  chassisSection: boolean = false;
  chassisList: any[] = [];
  constructor(
    private commondataService: CommondataService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private router: Router,
    public dialog: MatDialog,
    private dashboardTableService: DashboardTableService,
    private lossService: LossService,


  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    sessionStorage.removeItem('claimCreatedBy')
    sessionStorage.removeItem("ClaimDetails");
    this.claimStatusKey = [
      'Y',
      'A',
      'R',
      'C',
    ]
    let userType = this.logindata.UserType;
    console.log("LoginData", this.logindata)
    if (userType == 'user') {
      this.policyNumber = sessionStorage.getItem('SearchValue');
    }
  }

  ngOnInit(): void {

    for (let index = 0; index < this.claimStatusKey.length; index++) {
      const element = this.claimStatusKey[index];
      this.onGetClaimList(element);

    }
  }
  onGetClaimList(key) {
    this.statusKey = key;
    let UrlLink = '';
    let ReqObj: any;
    let userType = this.logindata.UserType;
    console.log("UserType", userType);
    if (userType == 'user' || userType == 'garage') {
      UrlLink = "api/getallclaimintimationbyusertype";
      ReqObj = {
        "CreatedBy": this.logindata.LoginId,
        "BranchCode": this.logindata.BranchCode,
        "RegionCode": this.logindata.RegionCode,
        "InsuranceId": this.logindata.InsuranceId,
        "Status": this.statusKey
      }
    }
    else {
      if (this.statusKey == 'Y') {
        UrlLink = "api/getallclaimintimationdetails";
      }
      else {
        UrlLink = "api/claimintimationbyclaimofficer";
      }
      ReqObj = {
        "Claimofficerid": this.logindata.LoginId,
        "BranchCode": this.logindata.BranchCode,
        "RegionCode": this.logindata.RegionCode,
        "InsuranceId": this.logindata.InsuranceId,
        "Status": this.statusKey
      }
    }

    this.commondataService.onGetClaimList(UrlLink, ReqObj).subscribe(data => {

      if (data) {
        if (data.length > 0) {
          for (let entry of data) {
            if (entry.ClaimStatus == 'Driver Details') {
              entry.ClaimStatus = 'Claim Intimated';
            }
            let dateSplit = entry.Entrydate.split('/');
            let dateFormat = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2];
            const date1: any = new Date(dateFormat);
            const date2: any = new Date();
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            entry['PendingDays'] = diffDays - 1;
            if (entry['PendingDays'] == 0) {
              entry['PendingDays'] = "Today";
            }
          }
        }
        this.onSetGridList(key, data);

      }
    },
      error => {
        this.handleError(error);
      });
  }
  addNewClaimIntimations(rowData, status) {
    if (status == 'new') {
      sessionStorage.removeItem('editClaimId');


    }
    else {
      sessionStorage.setItem('editClaimId', rowData.Claimrefno)
      sessionStorage.setItem('SearchValue', rowData.PolicyNo);
      sessionStorage.setItem('editPolicyNo', rowData.PolicyNo);

    }
  }
  onSetGridList(statusKey, List: any[]) {
    console.log(statusKey, List);
    if (statusKey == 'Y') {
      this.NotifiedClaims = List;


      this.columnHeader =  [
        {
          key: "more",
          display: "MORE VIEW",
          config: {
            isMoreView: true,
            actions: ["VIEW"]
          }
        },
        { key: "PolicyNo", display: "POLICY No"},
        { key: "Assuredname", display: "ASSURED NAME"},
        { key: "ClaimStatus", display: "CLAIM STATUS"},
        { key: "PendingDays", display: "NO OF DAYS"},

        {
          key: "action",
          display: "ACTION",
          config: {
            isClaimIntimate: true,
            actions: ["EDIT"]
          }
        }
      ]

      this.innerColumnHeader =
      {
        "Claimrefno": "CLAIM REF.NO",
        "Contactno": "CONTACT NO",
      }

    }
    if (statusKey == 'A') {
      this.ApprovedClaims = List;
      console.log(
        this.ApprovedClaims,
      )
      this.columnHeader1 = [
        {
          key: "more",
          display: "MORE VIEW",
          config: {
            isMoreView: true,
            actions: ["VIEW"]
          }
        },
        { key: "PolicyNo", display: "POLICY No"},
        { key: "Assuredname", display: "ASSURED NAME"},
        { key: "ClaimStatus", display: "CLAIM STATUS"},
        { key: "PendingDays", display: "NO OF DAYS"},

        {
          key: "action",
          display: "ACTION",
          config: {
            isClaimIntimate: true,
            actions: ["EDIT"]
          }
        }
      ]
      this.innerColumnHeader1 =
      {
        "Claimrefno": "CLAIM REF.NO",
        "Contactno": "CONTACT NO",
      }
    }
    if (statusKey == 'R') {
      this.RejectedClaims = List;
      console.log(
        this.RejectedClaims,
      )
      this.columnHeader2 =  [
        {
          key: "more",
          display: "MORE VIEW",
          config: {
            isMoreView: true,
            actions: ["VIEW"]
          }
        },
        { key: "PolicyNo", display: "POLICY No"},
        { key: "Assuredname", display: "ASSURED NAME"},
        { key: "ClaimStatus", display: "CLAIM STATUS"},
        { key: "PendingDays", display: "NO OF DAYS"},

        {
          key: "action",
          display: "ACTION",
          config: {
            isClaimIntimate: true,
            actions: ["EDIT"]
          }
        }
      ]
      this.innerColumnHeader2 =
      {
        "Claimrefno": "CLAIM REF.NO",
        "Contactno": "CONTACT NO",
      }
    }
    if (statusKey == 'C') {
      this.ClarificationClaims = List;
      console.log(
        this.ClarificationClaims,
      )
      this.columnHeader3 =  [
        {
          key: "more",
          display: "MORE VIEW",
          config: {
            isMoreView: true,
            actions: ["VIEW"]
          }
        },
        { key: "PolicyNo", display: "POLICY No"},
        { key: "Assuredname", display: "ASSURED NAME"},
        { key: "ClaimStatus", display: "CLAIM STATUS"},
        { key: "PendingDays", display: "NO OF DAYS"},

        {
          key: "action",
          display: "ACTION",
          config: {
            isClaimIntimate: true,
            actions: ["EDIT"]
          }
        }
      ]
      this.innerColumnHeader3 =
      {
        "Claimrefno": "CLAIM REF.NO",
        "Contactno": "CONTACT NO",
      }
      console.log(this.ClarificationClaims.length,
        this.RejectedClaims.length,
        this.ApprovedClaims.length,
        this.NotifiedClaims.length)

      if(this.ClarificationClaims.length == 0 && this.RejectedClaims.length == 0 && this.ApprovedClaims.length == 0 && this.NotifiedClaims.length == 0){
        this.clearChassisSection();
        let polNo = sessionStorage.getItem('SearchValue');
        let regNo = sessionStorage.getItem('RegNumber');
        this.policyNumber = polNo;
        this.regNumber = regNo;
        if (this.policyNumber != null) {
          this.onPolicySearchExist('Policy');
        }
        if (this.regNumber != null) {
          this.onPolicySearchExist('Registration');

        }
      }
    }

  }
  onActionHandler(action) {
    console.log("Event Received Is ", action);
    if (action.event.checked == true) {
      sessionStorage.setItem('chassisNo', action.element.VehicleInfo.ChassisNo);
      sessionStorage.setItem('productNo', action.element.PolicyInfo.Product);
      sessionStorage.setItem('SearchValue', this.policyNumber);
      sessionStorage.removeItem('editClaimId');
      this.router.navigate(['./Home/Claimforms']);
    }
  }
  onPolicySearchExist(SearchType) {

    let ReqObj={};
    let UrlLink='';

    if(SearchType == 'Policy'){
      ReqObj = {
        "EndtNo": "",
        "QuotationPolicyNo": this.policyNumber,
        "BranchCode": this.logindata.BranchCode,
        "InsuranceId": this.logindata.InsuranceId,
        "RegionCode": this.logindata.RegionCode,
        "CreatedBy": this.logindata.LoginId
      }
      UrlLink = `api/get/policyDetails`;
    }
    if(SearchType == 'Registration'){
      ReqObj = {
        ChassisNo:this.regNumber,
        "InsuranceId": this.logindata.InsuranceId,

      }
      UrlLink = `api/get/policydetailsbyregno`;
    }

    try {
      this.commondataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {
        console.log("Policy Search Response", data)
        if (data.Errors) {
          let element = '';
          for (let i = 0; i < data.Errors.length; i++) {
            element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data.Errors[i].Message + "</div>";
          }

          Swal.fire(
            'Please Fill Valid Value',
            `${element}`,
            'error',
          )
        }
        else {

          if (data) {
            this.chassisSection = true;
            if (data.length != 0) {
              this.chassisList = data;
              sessionStorage.setItem('SearchValue', this.policyNumber);
              sessionStorage.removeItem('editClaimId');
                sessionStorage.setItem('chassisNo', data[0].VehicleInfo.ChassisNo);
                sessionStorage.setItem('productNo', data[0].PolicyInfo.Product);
                sessionStorage.setItem('SearchValue', data[0].PolicyInfo.PolicyNo);
                sessionStorage.setItem('newproductid', data[0].PolicyInfo.ProductCode);
                sessionStorage.removeItem('editClaimId');
                this.columnHeader4 = [
                  {
                    key: "action",
                    display: "SELECT",
                    config: {
                      isCheck: true,
                      actions: ["SELECT"]
                    }
                  },
                  {
                    key: "PolicyInfo", display: "POLICY NO",
                    config: {
                      isPolicyInfo: 'PolicyNo',
                    }
                  },
                  { key: "PolicyFrom", display: "POLICY PERIOD",
                    config: {
                      PolicyFrom: 'PolicyFrom',
                    } 
                  },
                  {
                    key: "VehicleInfo", display: "REGISTRATION",
                    config: {
                      ChassisNo: 'ChassisNo',
                    }
                  },
                  {
                    key: "ProductDesc", display: "PRODUCT",
                    config: {
                      ProductDesc: 'ProductDesc',
                    }
                  },
                  {
                    key: "Vehbodytype", display: "COVERTYPE",
                    config: {
                      Vehtype: 'Vehtype',
                    }
                  },
                  { key: "Vehmake", display: "VEHICLE MAKE",
                    config: {
                      Vehmake: 'Vehmake',
                    } 
                  },
                  { key: "Vehmodel", display: "VEHICLE MODEL",
                    config: {
                      Vehmodel: 'Vehmodel',
                    } 
                  }
                  
                ];
                this.tableData1 = this.chassisList;
            }
          }
        }

      }, (err) => {

        this.handleError(err);
      })
    } catch (error) {

    }
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
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
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
    console.log('PPPPPPPPPPP',rowData);

    console.log("Edit Claim Data",rowData);
    sessionStorage.setItem('editClaimId', rowData.Claimrefno);

    if(rowData.ChassisNo){
      sessionStorage.setItem('chassisNo',rowData.ChassisNo);
    }
    sessionStorage.setItem('productNo',rowData.Product);
    sessionStorage.setItem('SearchValue', rowData.PolicyNo);
    sessionStorage.setItem('editPolicyNo', rowData.PolicyNo);
    this.router.navigate(['./Home/Claimforms']);
  }

  onGeneratePdf(rowData) {
    console.log("Row Data",rowData);

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

  clearChassisSection() {
    console.log("Falseeeeeeeeee")
    this.chassisSection = false;
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
