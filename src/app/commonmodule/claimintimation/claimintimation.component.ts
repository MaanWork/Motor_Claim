import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { StepperOrientation } from '@angular/cdk/stepper';

@Component({
  selector: 'app-claimintimation',
  templateUrl: './claimintimation.component.html',
  styleUrls: ['./claimintimation.component.css']
})
export class ClaimintimationComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  claimInformation: any;
  createdBy: string = "";
  Claimrefno: any = "";
  loginData: any;
  policyNo: any;
  claimAllInformationList: any;
  assuredName: any;
  chassisNo: string;
  stepperOrientation: Observable<StepperOrientation>;
  private subscription = new Subscription();
  public PolicyInformation: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private commondataService: CommondataService,
    private datePipe: DatePipe,
    private errorService: ErrorService,

  ) {


    let claimno = sessionStorage.getItem('editClaimId');
    this.policyNo = sessionStorage.getItem('editPolicyNo');
    this.chassisNo = sessionStorage.getItem('chassisNo');
    this.loginData = JSON.parse(sessionStorage.getItem("Userdetails"));

    if (!this.chassisNo) {
      this.chassisNo = "";
    }
    if (claimno) {
      if (!this.policyNo) {
        this.policyNo = sessionStorage.getItem('SearchValue');
      }
      this.Claimrefno = claimno;
      this.setEditValues();
    }
    else {
      this.Claimrefno = "";
      this.claimInformation = {};
      this.policyNo = sessionStorage.getItem('SearchValue');
      if (!this.policyNo) {
        this.policyNo = sessionStorage.getItem('editPolicyNo');
      }
      this.getalldetails();

    }

  }

  ngOnInit(): void {


  }





  async getalldetails() {
    let ReqObj = {
      "QuotationPolicyNo": this.policyNo,
      "InsuranceId": this.loginData?.LoginResponse?.InsuranceId
    }
    console.log("Get Info Req", ReqObj);
    let UrlLink = `api/get/policyDetails`;
    let response = (await this.commondataService.onGetClaimList(UrlLink, ReqObj)).toPromise()
      .then(res => {
        if (Array.isArray(res)) {
          this.claimAllInformationList = res;
        }
        else {
          this.claimAllInformationList = [res];
        }

        console.log("All Claim Info Details", this.claimAllInformationList);
        if (this.claimAllInformationList[0].PolicyInfo.Contactpername) {
          this.assuredName = this.claimAllInformationList[0].PolicyInfo.Contactpername;
        }
        else {
          this.assuredName = "";
        }
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;

  }
  onGetCustomerFromGroup(val) {
    console.log(val, this.claimInformation);
    let claimRefNo = val.Claimrefno;
    this.Claimrefno = claimRefNo;
    let loginValue = "";
    if (this.claimInformation.CreatedBy != "" && this.claimInformation.CreatedBy != null) {
      loginValue = this.claimInformation.CreatedBy;
    }
    else {
      loginValue = this.loginData.LoginResponse.LoginId;
    }
    if (!claimRefNo) {
      claimRefNo = "";
    }
    let UrlLink = `api/slide1/claimintimationdetails`;
    let ReqObj = {
      "Claimrefno": claimRefNo,
      "BranchCode": this.loginData.LoginResponse.BranchCode,
      "InsuranceId": this.loginData.LoginResponse.InsuranceId,
      "RegionCode": this.loginData.LoginResponse.RegionCode,
      "Chassissno": this.chassisNo,
      "PolicyNo": this.policyNo,
      "CustMobCode": val.CustMobCode,
      "Assuredaddress": val.Address,
      "Assuredname": val.AssuredName,
      "Contactno": val.ContactNo,
      "Email": val.Email,
      "Faxno": val.FaxNo,
      "Occupation": val.CustomerOccupation,
      "CreatedBy": loginValue,
      "Status": 'Y',
      "ClaimStatus": "Customer Information"
    }
    this.onSaveClaimIntimate(UrlLink, ReqObj);
    // this.goForward();
  }
  onGetAccidentFromGroup(val) {
    console.log(val);
    let UrlLink = `api/slide2/accidentdetails`;
    let ReqObj = {
      "Claimrefno": this.Claimrefno,
      "PolicyNo": this.policyNo,
      "Accidentdate": this.datePipe.transform(val.AccidentDate, "dd/MM/yyyy"),
      "Accidenttime": val.AccidentTime,
      "Accidentreported": val.StationAccidentReport,
      "CodeDesc":val.chooseproducttype,
      "CauseOfLossCode":val.CauseOfLoss,
      "Constablenumberstation": val.ConstableNumberandStation,
      "Driverwarningdescription": val.WarningDriverGiven,
      "Estimatespeedbeforeaccident": val.SpeedofAccident,
      "Policecompliantfiledyn": val.PoliceTakeParticular,
      "Typeofroadsurface": val.RoadSurface,
      "Weatherconditions": val.WeatherCondition,
      "Visibility": val.Visibility,
      "WetOrDry": val.WetOrDry,
      "InsideafricaYn": val.InsideafricaYn,
      "InsuranceId": this.loginData.LoginResponse.InsuranceId,
      "Usesofvehicle": val.useOfVehicle,
      "AccidentPlace": val.AccidentPlace,
      "Losstypeid": val.Losstypeid,
      "ClaimStatus": "Accident Details",
      "Lattitude": String(val.Latitude),
      "Longitude": String(val.Longitude),
      CustGarageyn: val?.allocateGarage,
      GarageId: val?.GarageId

    }
    this.onSaveClaimIntimate(UrlLink, ReqObj);
  }
  onGetStatementFromGroup(val) {
    let UrlLink = `api/slide3/statementinfo`;
    let ReqObj = {
      "Claimrefno": this.Claimrefno,
      "PolicyNo": this.policyNo,
      "OwnerGoods": val.NameOwnerOfGood,
      "Statementbydriver": val.DriverStatement,
      "Statementownerpolicyholder": val.OwnerStatement,
      "Trailerattached": val.TrailerOrAttached,
      "Tonnage": val.WeightOfLoadVeh,
      "VehTrailer": val.WeightOfLoadTral,
      "Typeofvehicle": val.Typeofvehicle,
      "Drivedby": val.Drivedby,
      "ClaimStatus": "Statement Information"
    }
    this.onSaveClaimIntimate(UrlLink, ReqObj);
  }
  onGetDamageFromGroup(val) {
    console.log("Received Damage", val);
    let UrlLink = `api/slide4/documentinfo`;
    let ReqObj = {
      "Claimrefno": this.Claimrefno,
      "PolicyNo": this.policyNo,
      "Vehpartsid": val,
    }
    this.onSaveClaimIntimate(UrlLink, ReqObj);
  }
  onGetReasonFromGroup(val) {
    let UrlLink = `api/slide5/reasonsinfo`;
    let ReqObj = {
      "Claimrefno": this.Claimrefno,
      "PolicyNo": this.policyNo,
      "WhenAndWhere": val.whenAndWhere,
      "DamgVehYn": val.DamgVehYn,
      "DamgPropYn": val.DamgPropYn,
      "DamgPersYn": val.DamgPersYn,
      "DamIndiYn": val.DamIndiYn,
      "DamPassenYn": val.DamPassenYn,
      "Garagenameaddress": val.repairNameAndAdrss,
      "Vehicledamagedescription": val.appartmentDamage,
      "Vehicleinuseyn": val.isTheVehlStillUse,
      "ClaimStatus": "Reasons Information"
    }
    this.onSaveClaimIntimate(UrlLink, ReqObj);
  }
  onGetDriverFromGroup(val) {
    console.log("Driver Form Submit", val);
    let UrlLink = `api/slide6/driverdetails`;

    let ReqObj = {
      "Claimrefno": this.Claimrefno,
      "PolicyNo": this.policyNo,
      "Accidentdescription": val.AccidentDescription,
      "Causeofloss": val.CausesLoss,
      "Claimchannnel": val.ClaimChaneel,
      "Driveraddress": val.Address,
      "Driverdob": this.datePipe.transform(val.Dob, "dd/MM/yyyy"),
      "Driveremailid": val.Email,
      "Driverfaultyn": val.BlameForAccdnt,
      "Drivergender": val.Gender,
      "Drivermobile": val.MobileNo,
      "Mobilecode": val.MobileCode,
      "Drivername": val.DriverName,
      "Driverwarningdescription": "dxgfdcgdrtg",
      "Drivingtestpasseddate": this.datePipe.transform(val.DriverFristPassed, "dd/MM/yyyy"),
      "Employedbyyouyn": val.IsEmpyByYou,
      "Liabilityyn": val.HeAdmitLibility,
      "Licenceexpirydate": this.datePipe.transform(val.LicenseExpiryDate, "dd/MM/yyyy"),
      "Licenseexperience": val.HowLngBeenService,
      "Licenseno": val.LicenseNo,
      "Offencechargespendingyn": val.HeAnyChargesPendng,
      "Ownvehicleyn": val.HeOwnMotorVehicle,
      "Nationality": val.Nationality,
      "Permittedtodriveyn": val.HeDrvgWthYorPrem,
      "Policereportno": val.PoliceReportNo,
      "Policereportsource": val.PoliceReportSource,
      "Provisionallicenseyn": val.HeHveFulLicnseProvison,
      "Previousaccidentyn": val.HehadAnyPreAccdnt,
      "Renewalnumber": val.RenewalNumber,
      "Driverlicensedetails": val.ApproximateDate,
      "Insurernameaddress": val.AddressOfInsurer,
      "Drivingmotorvehicle": val.HowLngBeenMtrDrvng,
      "Offencechargedetails": val.IncludingDates,
      "ClaimStatus": "Driver Details"
    }
    this.onSaveClaimIntimate(UrlLink, ReqObj);
  }
  finalProceed() {
    if (this.Claimrefno != "") {
      let ReqObj = {
          "Claimrefno": this.Claimrefno,
          "ClaimStatus":"Claim Intimated",
          "PolicyNo": this.policyNo
      }
      let UrlLink = `api/slide4/documentinfo`;
      return this.commondataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {

        console.log("saveClaimIntimationDetails", data);
        if (data.IsError) {
          let element = '';
          for (let i = 0; i < data.ErrorMessage.length; i++) {
            let subElement = '';
            let entry = data.ErrorMessage[i].ErrorList
            for (let j = 0; j < entry.length; j++) {
                  subElement = subElement+`
                                  <div class="mt-2 d-flex justify-content-start">
                                      <div>
                                        <i class="far fa-dot-circle text-danger p-1"></i> ${entry[j].Message} 
                                      </div>
                                  </div>`
            }
            element += `<div class="mt-1 d-flex justify-content-center">
                          <div></div>
                          <div>
                            <u><b>${data?.ErrorMessage[i]?.SlideName}</b></u>
                          </div>
                        </div> `+subElement +`
                        `;
  
          }
          Swal.fire(
            'Please Fill Valid Value',
            `${element}`,
            'error',
          )
        }
        else {
          if (data.Message == "Success") {
            Swal.fire(
              'Claim Intimated/Updated Successfully',
              'Claim No -' + this.Claimrefno,
              'success',
            )
            this.router.navigate(['./Home/ClaimIntimate']);
          }
        }
      }, (err) => {
        this.handleError(err);
      })
    }
  }
  onSaveClaimIntimate(UrlLink, ReqObj) {

    return this.commondataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {

      console.log("saveClaimIntimationDetails", data);
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
        if (data.Response == "Success") {
          this.claimInformation['Claimrefno'] = data.Claimrefno;
          if (this.Claimrefno == "" || !this.Claimrefno) {
            //this.claimInformation = null;
            this.claimInformation['Claimrefno'] = data.Claimrefno;
            this.Claimrefno = data.Claimrefno;
            sessionStorage.setItem('editClaimId', this.Claimrefno);
            this.goForward();
            //this.onGetDamageFromGroup([1]);
          }
          else{
            sessionStorage.setItem('editClaimId', this.Claimrefno);
            this.goForward();
          }
          console.log("Claim Ref No",this.Claimrefno, this.claimInformation) 
        }
      }
    }, (err) => {
      this.handleError(err);
    })
  }

  setEditValues() {

    let UrlLink = "api/claimintimationdetailgetbyid";
    let policyNo = this.policyNo;
    let ReqObj = {
      "Claimrefno": this.Claimrefno,
      "PolicyNo": policyNo
    }
    console.log("Edit Values Req", ReqObj);
    return this.commondataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {

      console.log("Edit Values", data);
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
        let productcode=null;
        this.claimInformation = data;
        if (this.claimInformation.CreatedBy != "" && this.claimInformation.CreatedBy != null) {
          sessionStorage.setItem('claimCreatedBy', this.claimInformation.CreatedBy);
        }
        else {
          sessionStorage.removeItem('claimCreatedBy')
        }
        this.assuredName = data.Assuredname;
        console.log('OOOOOOOO',this.claimInformation?.polh_prod_code);
        if(this.claimInformation?.polh_prod_code!=null){
          productcode=this.claimInformation?.polh_prod_code;
          sessionStorage.setItem('newproductid',productcode);
        }
        else{
          sessionStorage.setItem('newproductid',productcode);
        }
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

  goBack() {
    this.myStepper.previous();
  }

  goForward() {
    this.myStepper.next();
  }

}
