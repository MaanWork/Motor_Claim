import { CommondataService } from 'src/app/shared/services/commondata.service';
import { ClaimintimationService } from './../../../commonmodule/claimintimation/claimintimation.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from '../../services/errors/error.service';
import { ClaimjourneyService } from 'src/app/commonmodule/claimjourney/claimjourney.service';
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
  selector: 'app-accident-details',
  templateUrl: './accident-details.component.html',
  styleUrls: ['./accident-details.component.css']
})
export class AccidentDetailsComponent implements OnInit {


  public tableData: PeriodicElement[];
  public columnHeader: any;

  public createAccidentDetails: FormGroup;
  @Output() public GetAccidentInfo = new EventEmitter<any>();

  @Input() public createCustomerInfoForm: FormGroup;
  @Input() public claimInformation: any;
  @Input() public claimRefNo: any;
  accidentMaxDate: Date;
  typesOfSurfaceList: any[] = [];
  policeParticularList: any[] = [];
  weatherList: any[] = [];
  visibilityList: any[] = [];
  lossTypeList: any[] = [];
  startDate: any = {};
  lossTypeId: any = "";
  public PolicyInformation: any;
  logindata: any;
  causeOfLossList: any[]=[];
  productList:any[]=[];
  constructor(private formBuilder: FormBuilder,
    private commonDataService: CommondataService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    private claimIntimateService: ClaimintimationService,
    private claimjourneyService: ClaimjourneyService,
  ) {
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var day = new Date().getDate();
    this.accidentMaxDate = new Date();
    //this.accidentMaxDate = new Date(this.accidentMaxDate.setDate(this.accidentMaxDate.getDate() - 1));
    this.startDate = { year: year, month: month + 1, day: day };
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.createAccidentDetails = this.formBuilder.group({
      Drivedby: ['', Validators.required],
      Typeofvehicle: ['', Validators.required],
      AccidentDate: ['', Validators.required],
      AccidentTime: ['', Validators.required],
      RoadSurface: ['', Validators.required],
      Visibility: ['', Validators.required],
      WetOrDry: ['Dry', Validators.required],
      WarningDriverGiven: [''],
      WeatherCondition: ['', Validators.required],
      SpeedofAccident: [''],
      ConstableNumberandStation: ['', Validators.required],
      PoliceTakeParticular: ['2', Validators.required],
      StationAccidentReport: ['', Validators.required],
      AccidentPlace: ['', Validators.required],
      Losstypeid: [[], Validators.required],
      CauseOfLoss: ['',Validators.required],
      useOfVehicle: ['', Validators.required],
      InsideafricaYn: ['N', Validators.required],
      allocateGarage: ['N'],
      GarageId: [''],
      Latitude: ['', [Validators.maxLength(50)]],
      Longitude: ['', [Validators.maxLength(50)]],
      //chooseproducttype:['',[Validators.maxLength(50)]]
    })
    this.getTypeOfSurfaceList();
    //this.getCauseOfLossList();
    //this.getproducttype();
    this.onGetGarageList();
    this.productcauseofloss();
  }

  onGetGarageList() {

    let ReqObj = {
      "ClaimNo": '',
      "PartyNo": '',
      "LosstypeId": '',
      "PolicyNo": '',
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId": this.logindata?.OaCode
    }
    let UrlLink = `api/allotedgaragedetails`;
    return this.commonDataService.onPostMethodSync(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("GarageDetails", data);

      this.columnHeader = [
        {
          key: "action",
          display: "CHOOSE",
          config: {
            isRadio: true,
          }
        },
        { key: "GarageId", display: "GARAGE ID" },
        { key: "GarageName", display: "GARAGE NAME" },
        { key: "GarageCode", display: "GARAGE CODE" },
        { key: "PendingJobs", display: "PENDING JOBS" }
      ];
      this.tableData = data;

    }, (err) => {
      this.handleError(err);
    })
  }

  onGetChoosedId(event: any) {
    console.log(event)
    this.createAccidentDetails.controls['GarageId'].setValue(event)
  }
  // getCauseOfLossList(){
  //   let UrlLink = "api/causeofloss";
  //   let ReqObj = {
  //     "InsuranceId": this.logindata.InsuranceId
  //   }
  //   let token = sessionStorage.getItem('UserToken')
  //   return this.commonDataService.onGetClaimList(UrlLink,ReqObj).subscribe((data: any) => {
  //     //this.causeOfLossList = data;
  //   }, (err) => {

  //     this.handleError(err);
  //   })
  // }

  productcauseofloss(){
    console.log('OOOOOOO')
    let UrlLink = "api/causeoflossdropdown";
    let ReqObj = {
      "InscompanyId":this.logindata.InsuranceId,
      "CclProdCode":sessionStorage.getItem('newproductid')
    }
    let token = sessionStorage.getItem('UserToken');
    console.log('OOOOOOOOOOO',sessionStorage.getItem('newproductid'));
    console.log('PPPPPPPPPPPPPPPPP',this.causeOfLossList)
    return this.commonDataService.onGetClaimList(UrlLink,ReqObj).subscribe((data: any) => {
      //this.causeOfLossList = data;
      this.productList=data;
    }, (err) => {

      this.handleError(err);
    })
  }

  // getproducttype(){
  //   let UrlLink = "api/searchproductcode";
  //   let token = sessionStorage.getItem('UserToken')
  //   return this.commonDataService.onGetDropDown(UrlLink).subscribe((data: any) => {

  //     console.log("Road Surface", data);
  //     this.causeOfLossList = data;
  //     //this.getVisibilityList();
  //   }, (err) => {

  //     this.handleError(err);
  //   })
  // }
  getTypeOfSurfaceList() {
    let UrlLink = "api/typesofroadsurface";
    let token = sessionStorage.getItem('UserToken')
    return this.commonDataService.onGetDropDown(UrlLink).subscribe((data: any) => {

      console.log("Road Surface", data);
      this.typesOfSurfaceList = data;
      this.getVisibilityList();
    }, (err) => {

      this.handleError(err);
    })
  }
  getVisibilityList() {
    let UrlLink = "api/visibility";
    let token = sessionStorage.getItem('UserToken')
    return this.commonDataService.onGetDropDown(UrlLink).subscribe((data: any) => {

      console.log("Visibility List", data);
      this.visibilityList = data;
      this.getweatherList();
    }, (err) => {

      this.handleError(err);
    })
  }
  getweatherList() {
    let UrlLink = "api/weathercondition";
    let token = sessionStorage.getItem('UserToken')
    return this.commonDataService.onGetDropDown(UrlLink).subscribe((data: any) => {

      console.log("Weather List", data);
      this.weatherList = data;
      this.getPolicetakeParticularList();
    }, (err) => {

      this.handleError(err);
    })
  }
  getPolicetakeParticularList() {
    let UrlLink = "api/policetakeparticular";
    let token = sessionStorage.getItem('UserToken')
    return this.commonDataService.onGetDropDown(UrlLink).subscribe((data: any) => {

      console.log("Police Take Particular List", data);
      this.policeParticularList = data;
      this.getLossTypeList();
    }, (err) => {

      this.handleError(err);
    })
  }
  getLossTypeList() {
    let UrlLink = `api/claimlosstype`;
    let product = sessionStorage.getItem('productNo');
    if (!product || product != undefined) {
      product = "01";
    }
    let ReqObj = {
      "InsuranceId": this.logindata.InsuranceId,
      "PolicytypeId": product,
      "Status": 'Y'
    }
    return this.commonDataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("Loss Type", data);
      //this.GenderTypeList = data;
      if (data != null) {
        this.lossTypeList = [];
        this.lossTypeList = this.lossTypeList.concat(data.Primary);
        this.lossTypeList = this.lossTypeList.concat(data.Secondary);
      }
      console.log("Loss Type List", this.lossTypeList);
    }, (err) => {
      this.handleError(err);
    })
  }
  setPoliceTakeParticular() {
    let val = this.createAccidentDetails.controls['PoliceTakeParticular'].value;
    if (val == '1') {
      this.createAccidentDetails.controls['ConstableNumberandStation'].setValue('');
      this.createAccidentDetails.controls['StationAccidentReport'].setValue('');
    }
  }
  ngOnInit(): void {
    if (this.claimInformation) {
      console.log("claim informationnnnnnnnnnnnnnnnnn", this.claimInformation)
      if (this.claimInformation.Claimrefno) {
        this.setEditValues();
      }
      else{
        this.createAccidentDetails.controls['PoliceTakeParticular'].setValue('2');
      }
    }
  }
  onDateFormatInEdit(date) {
    console.log(date);
    if (date) {
      let format = date.split('/');
      var NewDate = new Date(new Date(format[2], format[1], format[0]));
      NewDate.setMonth(NewDate.getMonth() - 1);
      return NewDate;
    }
  }
  setEditValues() {
    console.log('RRRRRRRRRRR',this.claimInformation);
    this.createAccidentDetails.controls['AccidentDate'].setValue(this.claimInformation.Accidentdate == null ? '' : this.onDateFormatInEdit(this.claimInformation.Accidentdate));
    this.createAccidentDetails.controls['useOfVehicle'].setValue(this.claimInformation.Usesofvehicle);
    
    this.createAccidentDetails.controls['Latitude'].setValue(this.claimInformation.Lattitude);
    this.createAccidentDetails.controls['Longitude'].setValue(this.claimInformation.Longitude);
    this.createAccidentDetails.controls['AccidentPlace'].setValue(this.claimInformation.Accidentplace == null ? "" : this.claimInformation.Accidentplace);
    this.createAccidentDetails.controls['Losstypeid'].setValue(this.claimInformation.Losstypeid == null ? [] : this.claimInformation.Losstypeid);
    // this.createAccidentDetails.controls['Losstypeid'].setValue(this.claimInformation.Losstypeid)
    this.createAccidentDetails.controls['CauseOfLoss'].setValue(this.claimInformation.CauseOfLossCode == null ? "" : this.claimInformation.CauseOfLossCode);
    //this.createAccidentDetails.controls['chooseproducttype'].setValue(this.claimInformation.CodeDesc == null ? "" : this.claimInformation.CodeDesc);
    this.createAccidentDetails.controls['AccidentTime'].setValue(this.claimInformation.Accidenttime == null ? "" : this.claimInformation.Accidenttime);
    this.createAccidentDetails.controls['RoadSurface'].setValue(this.claimInformation.Typeofroadsurface == null ? "" : this.claimInformation.Typeofroadsurface);
    this.createAccidentDetails.controls['Visibility'].setValue(this.claimInformation.Visibility == null ? "" : this.claimInformation.Visibility);
    this.createAccidentDetails.controls['WetOrDry'].setValue(this.claimInformation.WetOrDry == null ? "Wet" : this.claimInformation.WetOrDry);
    this.createAccidentDetails.controls['InsideafricaYn'].setValue(this.claimInformation.InsideafricaYn == null ? "N" : this.claimInformation.InsideafricaYn);
    this.createAccidentDetails.controls['WarningDriverGiven'].setValue(this.claimInformation.Driverwarningdescription == null ? "" : this.claimInformation.Driverwarningdescription);
    this.createAccidentDetails.controls['WeatherCondition'].setValue(this.claimInformation.Weatherconditions == null ? "" : this.claimInformation.Weatherconditions);
    this.createAccidentDetails.controls['SpeedofAccident'].setValue(this.claimInformation.Estimatespeedbeforeaccident == null ? "" : this.claimInformation.Estimatespeedbeforeaccident);
    this.createAccidentDetails.controls['ConstableNumberandStation'].setValue(this.claimInformation.Constablenumberstation == null ? "" : this.claimInformation.Constablenumberstation);
    this.createAccidentDetails.controls['PoliceTakeParticular'].setValue(this.claimInformation.Policecompliantfiledyn == null ? "2" : this.claimInformation.Policecompliantfiledyn);
    this.createAccidentDetails.controls['StationAccidentReport'].setValue(this.claimInformation.Accidentreported == null ? "" : this.claimInformation.Accidentreported);
    this.createAccidentDetails.controls['allocateGarage'].setValue(this.claimInformation.CustGarageyn == null ? "" : this.claimInformation.CustGarageyn);
    this.createAccidentDetails.controls['GarageId'].setValue(this.claimInformation.GarageId == null ? "" : this.claimInformation.GarageId);
    


  }
  onAccidentInfoSubmit() {
    if (this.lossTypeId != "") {
    }
    this.GetAccidentInfo.emit(this.createAccidentDetails.value);
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
