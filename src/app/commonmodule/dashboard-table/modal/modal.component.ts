import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DashboardTableService } from '../dasboard-table.service';
import Swal from 'sweetalert2';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { Router } from '@angular/router';
import { LossService } from '../../loss/loss.service';
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
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  public tableData: PeriodicElement[];
  public columnHeader: any;
  public OfficerApproveGarageYn:any='P';
  public OfficerGarageRemarks:any;
  public isStatusUpdate:boolean=false;
  userType: string;intimatingSection = false;
  claimStatusList:any[]=[];ClaimPartyTypeList:any=[];
  claimStatusValue:any="";FaultCategoryList:any=[];
  claimRemarks:any="";public policyInformation:any={};
  private subscription = new Subscription();
  loginData: any;coInsuranceData:any;
  policyAllInfo: any;coInsuranceHeader:any;
  policyInfo: any;PartyType:any=null;
  vehicleInfo: any;FaultCategory:any=null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dashboardTableService:DashboardTableService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    private commondataService: CommondataService,
    private lossService: LossService,
    private router:Router,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) {
    this.userType = JSON.parse(sessionStorage.getItem("UserType"));
    this.claimStatusList = [
      { Code: 'Y',CodeDesc:'Notified'},
      { Code: 'A',CodeDesc:'Approved'},
      { Code: 'R',CodeDesc:'Rejected'},
      { Code: 'C',CodeDesc:'Clarification Required'},
    ]
  }

  async ngOnInit(): Promise<void> {
    this.loginData = JSON.parse(sessionStorage.getItem("Userdetails"));
    console.log("Received Data",this.data);
    if(this.data.statusUpdate == 'statusUpdate'){
       this.isStatusUpdate=false;
    }
    if(this.data.statusUpdate == 'notstatusUpdate'){
      this.isStatusUpdate=true;
    }
    this.onGetClaimInformation();
    this.onGetGarageList();
    
    this.getPolicyInfoByChassisNo();
    this.FaultCategoryList = await this.getFaultCategory();
    this.ClaimPartyTypeList = await this.getClaimPartyType();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  onGetCoInsuranceList(){
    let UrlLink = `api/get/coinsurancedetails`;
    let ReqObj = {
      "ClaimRefNo":this.policyInformation.Claimrefno,
      "InsuranceId": this.loginData?.LoginResponse?.InsuranceId,
      "QuotationPolicyNo": this.policyInfo.PolicyNo
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
  async getFaultCategory() {
    let UrlLink = `api/faultcategory`;
    let response = (await this.lossService.getFaultCategory(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  async getClaimPartyType() {
    let ReqObj = {
      //"Policytypeid": this.policyAllInfo?.PolicyInfo?.Product,
      "CreatedBy": this.loginData.LoginResponse.LoginId,
      "InsuranceId":this.loginData.LoginResponse.InsuranceId
    }
    console.log(ReqObj)
    let UrlLink = `api/claimpartytype`;
    let response = (await this.lossService.getClaimPartyType(UrlLink, ReqObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;

  }
  async getPolicyInfoByChassisNo(){
    if(this.data.ViewClaimData){
      let ReqObj = {
        "QuotationPolicyNo": this.data.ViewClaimData?.PolicyNo,
        "ChassisNo":this.data.ViewClaimData?.ChassisNo,
        "ClaimRefNo":this.policyInformation.Claimrefno,
        "InsuranceId": this.loginData?.LoginResponse?.InsuranceId,
  
      }
      let UrlLink = "";
        UrlLink = `api/get/policydetailsbychassissno`;
        (await this.dashboardTableService.viewClaimIntimation(UrlLink, ReqObj)).toPromise()
        .then(async res => {
          if(res){
            this.policyAllInfo = res;
            this.policyInfo = this.policyAllInfo?.PolicyInfo;
            this.vehicleInfo = this.policyAllInfo?.VehicleInfo;
            this.onGetCoInsuranceList();
           
          }
        }, (err) => {
          console.log("Received Error",err);
          this.handleError(err);
        })
    }
  }
  onGetClaimInformation(){
    this.subscription=this.dashboardTableService.rowClaimInfo.subscribe((event: any) => {
      this.policyInformation = event;
      console.log("Policy Infoooooo",this.policyInformation)
      if(this.policyInformation){
        this.claimStatusValue = this.policyInformation.Status;
        this.claimRemarks = this.policyInformation.Remarks;
      }
    });
  }
  onClaimConversion() {

    let convertReq = {};
    let token = sessionStorage.getItem('UserToken');
      console.log("Policy Info",this.policyInformation);
      convertReq = {
        "InsuranceId": this.loginData.LoginResponse.InsuranceId,
        "BranchCode": this.loginData.LoginResponse.BranchCode,
        "ProductId": "66",
        "CustomerId": "56",
        "GarageId": "54",
        "FaultCategoryId": this.FaultCategory,
        "PartyTypeId": this.PartyType,
        "RegionCode": this.loginData.LoginResponse.RegionCode,
        "CreatedBy": this.loginData.LoginResponse.LoginId,
        "Claimrefno": this.policyInformation.Claimrefno,
        "PolicyNo": this.policyInformation.PolicyNo,
        "Assuredname": this.policyInformation.Assuredname,
        "Assuresaddress": this.policyInformation.Assuredaddress,
        "Contactno": this.policyInformation.Contactno,
        "Email": this.policyInformation.Email,
        "Drivername": this.policyInformation.Drivername,
        "Driveraddress": this.policyInformation.Driveraddress,
        "Drivermobile": this.policyInformation.Drivermobile,
        "Drivergender": this.policyInformation.Drivergender,
        "Driveremailid": this.policyInformation.Driveremailid,
        "Driverdob": this.policyInformation.Driverdob,
        "Licenceexpirydate": this.policyInformation.Licenceexpirydate,
        "Licenseno": this.policyInformation.Licenseno,
        "Nationality": this.policyInformation.Nationality,
        "Mobilecode": this.policyInformation.Mobilecode,
        "AssignedDate": this.policyInformation.AssignedDate,
        "Claimchannnel": this.policyInformation.Claimchannnel,
        "Policereportno": this.policyInformation.Policereportno,
        "Policereportsource": this.policyInformation.Policereportsource,
        "Causeofloss": this.policyInformation.Causeofloss,
        "ChassisNo": this.policyInformation.ChassisNo,
        "Accidentdate": this.policyInformation.Accidentdate,
        "Vehpartsid": this.policyInformation.Vehpartsid,
        "Status": this.claimStatusValue,
        "Remarks": this.claimRemarks,
        "InsideafricaYn": this.policyInformation.InsideafricaYn,
        "CustMobCode": this.data.ViewClaimData.CustMobCode,
        "Lattitude": this.policyInformation.Lattitude,
        "Longitude": this.policyInformation.Longitude,
        "Authcode": token,
        OfficerApproveGarageYn:this.OfficerApproveGarageYn,
        OfficerGarageRemarks:this.OfficerGarageRemarks,
      }
      if (this.policyInformation.ClaimNo = '') {
        convertReq['Claimo'] = this.policyInformation.ClaimNo;
      }
    let UrlLink = null;
    if(this.loginData.LoginResponse.InsuranceId=='100002') UrlLink = `api/createclaimfromclaimref`;
    else if(this.loginData.LoginResponse.InsuranceId=='100003' || this.loginData.LoginResponse.InsuranceId=='100008') UrlLink = `api/createclaimfromclaimrefV1`;
    if (this.policyInformation.AssignedDate == null) {
      this.policyInformation.AssignedDate = "";
    }
    if (this.policyInformation.Causeofloss == null) {
      this.policyInformation.Causeofloss = "";
    }
    if (this.policyInformation.ChassisNo == null) {
      this.policyInformation.ChassisNo = "";
    }
    if (this.policyInformation.Claimchannnel == null) {
      this.policyInformation.Claimchannnel = "";
    }
    if (this.policyInformation.Policereportno == null) {
      this.policyInformation.Policereportno = "";
    }
    if (this.policyInformation.Policereportsource == null) {
      this.policyInformation.Policereportsource = "";
    }

    console.log("Caim Conversion Req", convertReq);
    return this.commondataService.onGetClaimList(UrlLink, convertReq).subscribe((data: any) => {
      console.log("Req Hitted",data);
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

        this.dialogRef.close(true);
        console.log("Caim Conversion Response", data);
        if(this.claimStatusValue == 'A'){
          this.router.navigate(['./Home/Dashboard']);
          Swal.fire(
            'Claim No - ' + data.Response,
            'success',
          )
        }
        else{
         Swal.fire(
            'Claim Status Updated Successfully',
            'success',
          )
        }
      }
    }, (err) => {
      console.log("Received Error",err);
      this.handleError(err);
    })
  }

  onGetGarageList() {

    let ReqObj = {
      "Claimrefno": this.policyInformation.Claimrefno,
      "PolicyNo": this.policyInformation.PolicyNo,
      "BranchCode": this.loginData?.LoginResponse?.BranchCode,
      "InsuranceId": this.loginData?.LoginResponse?.InsuranceId,
      "RegionCode": this.loginData?.LoginResponse?.RegionCode,
      "CreatedBy": this.loginData?.LoginResponse?.LoginId,
      "UserType": this.loginData?.LoginResponse?.UserType,
      "UserId": this.loginData?.LoginResponse?.OaCode
    }
    let UrlLink = `api/customerallotedgarage`;
    return this.commondataService.onPostMethodSync(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("GarageDetails", data);

      this.columnHeader = [

        { key: "GarageId", display: "GARAGE ID" },
        { key: "GarageName", display: "GARAGE NAME" },
        { key: "MobileNo", display: "MOBILE NUMBER" },
      ];
      this.tableData = data;

    }, (err) => {
      this.handleError(err);
    })
  }

  onEditClaimData(){
    this.dialogRef.close();
    let rowData = this.data.ViewClaimData;
    sessionStorage.setItem('editClaimId', rowData?.Claimrefno);
    sessionStorage.setItem('chassisNo',rowData?.ChassisNo);
    sessionStorage.setItem('productNo',rowData?.Product);
    sessionStorage.setItem('SearchValue', rowData?.PolicyNo);
    sessionStorage.setItem('editPolicyNo', rowData?.PolicyNo);
    this.router.navigate(['./Home/Claimforms']);
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
