import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommondataService } from '../../services/commondata.service';
import { ErrorService } from '../../services/errors/error.service';
declare var $:any;
@Component({
  selector: 'app-drivers-details',
  templateUrl: './drivers-details.component.html',
  styleUrls: ['./drivers-details.component.css']
})
export class DriversDetailsComponent implements OnInit {

  public createDriverForm: FormGroup;
  @Output() public GetDriverInfo = new EventEmitter<any>();
  @Input() public claimRefNo:any;
  @Input() public claimInformation:any;
  policeReportsYN = 'N';public driverMaxDOB:any={};
  startDate: any;
  driverPassedMaxDate: any;
  mobileCodeList: any;
  GenderTypeList: any;
  loginData: any;
  claimchannelList: any;
  causesOfLossList: any[];
  driverPassedMinDate: Date;
  constructor(private formBuilder:FormBuilder,
    private commondataService:CommondataService,
    private errorService: ErrorService,) { 
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var day = new Date().getDate();
    this.driverMaxDOB = new Date(year-18,month,day);
    this.startDate = { year: year - 18, month: month+1, day: day };
    this.driverPassedMinDate = new Date();
    this.driverPassedMinDate = new Date(this.driverPassedMinDate.setDate(this.driverPassedMinDate.getDate() - 1));

    this.loginData = JSON.parse(sessionStorage.getItem("Userdetails"));
    this.createDriverForm = this.formBuilder.group({
      DriverName: [''],
      DriverOccupation: [{ value: '2', disabled: true }],
      Gender: ['',],
      Dob: ['',],
      Email: [''],
      MobileCode: [''],
      MobileNo: [''],
      LicenseExpiryDate: [''],
      LicenseNo: [''],
      Address: [''],
      Nationality: ['215'],
      RenewalNumber: [''],
      HowLngBeenService: [''],
      HowLngBeenMtrDrvng: [''],
      ApproximateDate: [''],
      IncludingDates: [''],
      DriverFristPassed: [''],
      AddressOfInsurer: [''],
      IsEmpyByYou: ['N'],
      HeDrvgWthYorPrem: ['N'],
      BlameForAccdnt: ['N'],
      HehadAnyPreAccdnt: ['N'],
      HeAnyChargesPendng: ['N'],
      HeHveFulLicnseProvison: ['N'],
      HeOwnMotorVehicle: ['N'],
      HeAdmitLibility: ['N'],
      PoliceReportNo:[''],
      PoliceReportSource:[''],
      ClaimChannel:[''],
      CausesLoss:[''],
      AccidentDescription:['']
    });
    this.getMobileCodeList();
  }

  ngOnInit(): void {
    console.log("Claim INfo Received is",this.claimInformation)
    if(this.claimInformation){
      if(this.claimInformation.Claimrefno){
        this.setEditValues();
      }
    }
  }
  onDateFormatInEdit(date) {
    console.log(date);
    if (date) {
      let format = date.split('/');
      var NewDate = new Date(new Date(format[2], format[1], format[0]));
      NewDate.setMonth(NewDate.getMonth() - 1);
      console.log(NewDate);
      return NewDate;
    }
  }
  setEditValues(){
    let userData = this.claimInformation;
    if(userData.Policereportno  || userData.Policereportsource || userData.Claimchannnel || userData.Causeofloss || userData.Accidentdescription){
      this.policeReportsYN = 'Y';
    }
    this.createDriverForm.controls['PoliceReportNo'].setValue(userData.Policereportno== null ? "" : userData.Policereportno);
    this.createDriverForm.controls['PoliceReportSource'].setValue(userData.Policereportsource== null ? "" : userData.Policereportsource);
    this.createDriverForm.controls['ClaimChannel'].setValue(userData.Claimchannnel == null ? "" : userData.Claimchannnel);
    this.createDriverForm.controls['CausesLoss'].setValue(userData.Causeofloss == null ? "" : userData.Causeofloss);
    this.createDriverForm.controls['AccidentDescription'].setValue(userData.Accidentdescription == null ? "" : userData.Accidentdescription);
    this.createDriverForm.controls['DriverName'].setValue(userData.Drivername == null ? "" : userData.Drivername);
    this.createDriverForm.controls['Address'].setValue(userData.Driveraddress == null ? "" : userData.Driveraddress);
    this.createDriverForm.controls['Gender'].setValue(userData.Drivergender == null ? "" : userData.Drivergender);
    this.createDriverForm.controls['Dob'].setValue(userData.Driverdob == null ? "" : this.onDateFormatInEdit(userData.Driverdob));

    this.createDriverForm.controls['Email'].setValue(userData.Driveremailid== null ? "" : userData.Driveremailid);
    this.createDriverForm.controls['MobileCode'].setValue(userData.Mobilecode== null ? "" : userData.Mobilecode);
    this.createDriverForm.controls['MobileNo'].setValue(userData.Drivermobile == null ? "" : userData.Drivermobile);

    this.createDriverForm.controls['LicenseExpiryDate'].setValue(userData.Licenceexpirydate == null ? "" : this.onDateFormatInEdit(userData.Licenceexpirydate));
    this.createDriverForm.controls['LicenseNo'].setValue(userData.Licenseno == null ? "" : userData.Licenseno);
    if(userData.Nationality == null || userData.Nationality == ''){
      userData.Nationality = '215';
    }
    this.createDriverForm.controls['Nationality'].setValue(userData.Nationality == null ? "" : userData.Nationality);
    this.createDriverForm.controls['RenewalNumber'].setValue(userData.Renewalnumber == null ? "" : userData.Renewalnumber);
    this.createDriverForm.controls['HowLngBeenService'].setValue(userData.Licenseexperience == null ? "" : userData.Licenseexperience);
    this.createDriverForm.controls['HowLngBeenMtrDrvng'].setValue(userData.Drivingmotorvehicle == null ? "" : userData.Drivingmotorvehicle);
    this.createDriverForm.controls['ApproximateDate'].setValue(userData.Driverlicensedetails == null ? "" : userData.Driverlicensedetails);

    this.createDriverForm.controls['DriverFristPassed'].setValue(userData.Drivingtestpasseddate == null ? "" : this.onDateFormatInEdit(userData.Drivingtestpasseddate));
    this.createDriverForm.controls['AddressOfInsurer'].setValue(userData.Insurernameaddress == null ? "" : userData.Insurernameaddress);
    this.createDriverForm.controls['IsEmpyByYou'].setValue(userData.Employedbyyouyn == null ? "N" :userData.Employedbyyouyn);
    this.createDriverForm.controls['HeDrvgWthYorPrem'].setValue(userData.Permittedtodriveyn == null ? "N" :userData.Permittedtodriveyn);
    if(userData.Driverfaultyn == null){
      userData.Driverfaultyn = 'N';
    }
    this.createDriverForm.controls['BlameForAccdnt'].setValue(userData.Driverfaultyn == null ? "N" :userData.Driverfaultyn);
    this.createDriverForm.controls['HehadAnyPreAccdnt'].setValue(userData.Previousaccidentyn == null ? "N" :userData.Previousaccidentyn);
    this.createDriverForm.controls['HeAnyChargesPendng'].setValue(userData.Offencechargespendingyn == null ? "N" :userData.Offencechargespendingyn);
    this.createDriverForm.controls['HeHveFulLicnseProvison'].setValue(userData.Provisionallicenseyn == null ? "N" : userData.Provisionallicenseyn);
    this.createDriverForm.controls['HeOwnMotorVehicle'].setValue(userData.Ownvehicleyn == null ? "N" :userData.Ownvehicleyn);
    this.createDriverForm.controls['HeAdmitLibility'].setValue(userData.Liabilityyn == null ? "N" :userData.Liabilityyn);
    this.createDriverForm.controls['IncludingDates'].setValue(userData.Offencechargedetails == null ? "N" :userData.Offencechargedetails);
  }
  getMobileCodeList(){
    let UrlLink = `api/mobilecode`;
    return this.commondataService.onGetDropDown(UrlLink).subscribe((data: any) => {

      //this.GenderTypeList = data;
      if(data != null){
        this.mobileCodeList = data;
      }
      this.getGender();
    }, (err) => {
      this.handleError(err);
    })
  }
  getGender() {
    let UrlLink = `api/gender`;
    return this.commondataService.onGetDropDown(UrlLink).subscribe((data: any) => {
      console.log("Gender", data);
      this.GenderTypeList = data;
      this.getClaimChannel();
    }, (err) => {
      this.handleError(err);
    })
  }
  getClaimChannel() {
    let UrlLink = `api/claimchannel`;
    let response = (this.commondataService.onGetDropDown(UrlLink)).toPromise()
      .then(res => {
        console.log("Claim Channel Res",res);
        this.claimchannelList = res;
        //this.getCausesOfLoss();
       
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  getCausesOfLoss() {
    let ReqObj = {
      "Status": "Y",
      "BranchCode": this.loginData.LoginResponse.BranchCode,
      "InsuranceId": this.loginData.LoginResponse.InsuranceId,
      "RegionCode": this.loginData.LoginResponse.RegionCode,
      "CreatedBy": this.loginData.LoginResponse.LoginId
    }

    let UrlLink = `api/motcauseofloss`;
    let response = (this.commondataService.onGetClaimList(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.causesOfLossList = res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;

  }
  onDriverInfoSubmit(){
    this.GetDriverInfo.emit(this.createDriverForm.value);
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
