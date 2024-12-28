import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import * as _ from 'lodash';
import { ImageviewModalComponent } from 'src/app/shared/imageview-modal/imageview-modal.component';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
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
@Component({
  selector: 'app-claim-intimate-details',
  templateUrl: './claim-intimate-details.component.html',
  styleUrls: ['./claim-intimate-details.component.scss']
})
export class ClaimIntimateDetailsComponent implements OnInit {

  public tableData1: DataTableElement[];
  title = 'Carproject';
  start:boolean=false;
  next:boolean=false;driverName:any=null;
  third: boolean=false;drivenList:any[]=[];
  //favoriteSeason: string;
  seasons: string[] = ['HYGVCDF', 'HYGVCDF', 'DFGTRE', 'SHA'];
  minDate:any;maxDate:any;checkValidate:any='N';
  effectiveValue:any;incidentDateType:any=null;
  priv:any;drivenBy:any;vehicleType:any;
  fourth: boolean=false;selected:any;
  incidentDate:any;
  categories = [
    {id: 1, name: 'Accessories'},
    {id: 2, name: 'Attempted Theft'},
    {id: 3, name: 'Theft From Vehicle - External'},
    {id: 4, name: 'Hijack'},
    {id: 5, name: 'Theft of Vehicle'}
  ];
  claimSection: boolean=true;searchValue:any=null;
  causeOfLossSection: boolean=false;
  incidentInfoSection: boolean=false;
  locationSection: boolean = false;
  documentSection: boolean=false;
  imageUrl: any;policyNumber:any;
  uploadDocList: any[]=[];logindata: any;
  regNumber: string;
  chassisSection: boolean=false;
  chassisList: any;
  columnHeader4: ({ key: string; display: string; config: { isCheck: boolean; actions: string[]; ChassisNo?: undefined; ProductDesc?: undefined; Vehtype?: undefined; Vehmake?: undefined; Vehmodel?: undefined; }; } | { key: string; display: string; config: { ChassisNo: string; isCheck?: undefined; actions?: undefined; ProductDesc?: undefined; Vehtype?: undefined; Vehmake?: undefined; Vehmodel?: undefined; }; } | { key: string; display: string; config: { ProductDesc: string; isCheck?: undefined; actions?: undefined; ChassisNo?: undefined; Vehtype?: undefined; Vehmake?: undefined; Vehmodel?: undefined; }; } | { key: string; display: string; config: { Vehtype: string; isCheck?: undefined; actions?: undefined; ChassisNo?: undefined; ProductDesc?: undefined; Vehmake?: undefined; Vehmodel?: undefined; }; } | { key: string; display: string; config: { Vehmake: string; isCheck?: undefined; actions?: undefined; ChassisNo?: undefined; ProductDesc?: undefined; Vehtype?: undefined; Vehmodel?: undefined; }; } | { key: string; display: string; config: { Vehmodel: string; isCheck?: undefined; actions?: undefined; ChassisNo?: undefined; ProductDesc?: undefined; Vehtype?: undefined; Vehmake?: undefined; }; })[];
  chassisNo: any;
  lossTypeList: any[];
  causesOfLossList: any[]=[];
  checkAcknowledgeError: boolean=false;
  incidentDateError: boolean;
  incidentTime: any='12:00';
  incidentTimeError: boolean;
  chassisNoError: boolean;
  lossTypeError: boolean;
  lossTypeId: any;
  causeLossId: any;
  causeLossError: boolean;
  claimRefNo: any=null;
  claimAllInformationList: any[];
  assuredName: any;
  MobileCode: any;
  MobileNumber: any;
  policyTo: any;
  policyFrom: any;vehicleTypeList:any[]=[];
  incidentDateBtwnError: boolean;
  claimInformation: any;
  drivenByError: boolean;
  accidentLocationError: boolean;
  vehicleTypeError: boolean;
  accidentAddress: any;
  DocumentImageList: any[]=[];
  AccidentPhotos: any[]=[];
  UploadDocumentList: any;
  viewSection: boolean;
  finalSection: boolean;
  recordSection: boolean=false;
  accidentInfo: any=null;
  message = '';
  placeholder = '';
  listening = false;vehicleUsagePurpose:any=null;
  subscription;emailId:any=null;
  filteredData: any[]=[];
  insuranceId: any;
  selectedTime: any;

  constructor(private _formBuilder: FormBuilder,private errorService: ErrorService,private router:Router,
    private datePipe: DatePipe,public dialog: MatDialog,
    private commondataService: CommondataService,private atp: AmazingTimePickerService) {
    this.minDate=new Date();
    this.maxDate = new Date();
    // this.service.init()
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    if(this.logindata){
      this.MobileCode = this.logindata?.MobileCode
      this.MobileNumber = this.logindata?.MobileNumber
      this.insuranceId = this.logindata?.InsuranceId
    }
    this.drivenList = [
      {"Code":"Driver","CodeDesc":"Driver"},
      {"Code":"Owner","CodeDesc":"Owner"}
    ];
    this.vehicleTypeList = [
      {"Code":"Private","CodeDesc":"Private"},
      {"Code":"Commercial","CodeDesc":"Commercial"}
    ]
    sessionStorage.removeItem('claimCreatedBy')
    sessionStorage.removeItem("ClaimDetails");
    let userType = this.logindata.UserType;
    console.log("LoginData", this.logindata)
    if (userType == 'user') {
      this.policyNumber = sessionStorage.getItem('SearchValue');
      this.clearChassisSection();
      let polNo = sessionStorage.getItem('SearchValue');
      let regNo = sessionStorage.getItem('RegNumber');
      this.policyNumber = polNo;
      this.regNumber = regNo;
      if (this.policyNumber != null) {
        this.onPolicySearchExist('Policy');
        this.getalldetails();
      }
      if (this.regNumber != null) {
        this.onPolicySearchExist('Registration');
  
      }
    }
    let entry = {
      "PartyNo": null,
      "LosstypeId": null
    }
    let claimRefNo = sessionStorage.getItem('editClaimId');
    if(claimRefNo!=null && claimRefNo!=undefined){
      this.claimRefNo = sessionStorage.getItem('editClaimId');
      this.getClaimDetails(null);
      this.onGetDocumentList(entry);
    }
  }
  openTimePicker(): void {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedTime = time; // Set the selected time
      console.log('Selected Time:', time);
    });
  }
  getClaimDetails(type) {
    let UrlLink = "api/claimintimationdetailgetbyid";
    let policyNo = this.policyNumber;
    let ReqObj = {
      "Claimrefno": this.claimRefNo,
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
        this.claimInformation = data;
        this.claimInformation['ClaimRefNo'] = this.claimInformation.Claimrefno;
        this.claimInformation['CreatedBy'] = this.claimInformation.CreatedBy;
        this.checkValidate = "Y";
        this.incidentTime = this.claimInformation.Accidenttime;
        this.incidentDate =  this.onDateFormatInEdit(this.claimInformation.Accidentdate);
        this.onAccidentDateChange();
        this.chassisNo = this.claimInformation?.ChassisNo;
        this.lossTypeId = this.claimInformation.Losstypeid[0];
        this.causeLossId = this.claimInformation.CauseOfLossCode;
        this.accidentAddress = this.claimInformation.Accidentplace;
        this.drivenBy = this.claimInformation.Drivedby;
        this.driverName = this.claimInformation.OwnerGoods;
        this.accidentInfo = this.claimInformation.Statementbydriver;
        this.vehicleUsagePurpose = this.claimInformation.Usesofvehicle;
        this.vehicleType = this.claimInformation.Typeofvehicle;
        this.emailId = this.claimInformation.Email;
        if(type=='documentInfo'){
          this.locationSection=false; this.documentSection = true;
        }
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  ngOnInit(){
        this.getLossTypeList();
       
  }
  
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
    priv:['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  clearChassisSection() {
    this.chassisSection = false;
  }
  
  getCauseOfLossList(){
    let ReqObj = {
      "InscompanyId":this.logindata.InsuranceId,
      "CclProdCode":sessionStorage.getItem('newproductid'),
      "Status": "Y",
      "BranchCode": this.logindata.BranchCode,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId
    }

    let UrlLink = `api/causeoflossdropdown`;
    let response = (this.commondataService.onGetClaimList(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.causesOfLossList = res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  onSearchData(){
    if(this.searchValue!=''){
      this.filteredData = this.tableData1.filter(
        x => (String(x.VehicleInfo?.Vehiclemakemodel).includes(this.searchValue) || String(x.VehicleInfo?.Vehiclemodeldesc).includes(this.searchValue) || String(x.VehicleInfo?.Platenocharacter).includes(this.searchValue))  // the comparison 
      );
    }
    else{this.filteredData=this.tableData1}
  }
  getLossTypeList(){
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
    return this.commondataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("Loss Type", data);
      //this.GenderTypeList = data;
      if (data != null) {
        this.lossTypeList = [];
        this.lossTypeList = this.lossTypeList.concat(data.Primary);
        //this.lossTypeList = this.lossTypeList.concat(data.Secondary);
      }
      console.log("Loss Type List", this.lossTypeList);
    }, (err) => {
      this.handleError(err);
    })
  }
  async getalldetails() {
    let ReqObj = {
      "QuotationPolicyNo": this.policyNumber,
      "InsuranceId": this.logindata?.InsuranceId
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
          this.policyFrom =  this.claimAllInformationList[0].PolicyInfo.PolicyFrom;
          this.policyTo =  this.claimAllInformationList[0].PolicyInfo.PolicyTo;
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
                sessionStorage.setItem('chassisNo', data[0].VehicleInfo.ChassisNo);
                sessionStorage.setItem('productNo', data[0].PolicyInfo.Product);
                sessionStorage.setItem('newproductid', data[0].PolicyInfo.ProductCode);
                sessionStorage.setItem('SearchValue', data[0].PolicyInfo.PolicyNo);
                this.columnHeader4 = [
                  {
                    key: "action",
                    display: "SELECT",
                    config: {
                      isCheck: true,
                      actions: ["SELECT"]
                    }
                  },
                  // {
                  //   key: "PolicyInfo", display: "POLICY NO",
                  //   config: {
                  //     isPolicyInfo: 'PolicyNo',
                  //   }
                  // },
                  // { key: "PolicyFrom", display: "POLICY PERIOD",
                  //   config: {
                  //     PolicyFrom: 'PolicyFrom',
                  //   } 
                  // },
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
                this.filteredData = this.chassisList;
                this.getCauseOfLossList();
            }
          }
        }

      }, (err) => {

        this.handleError(err);
      })
    } catch (error) {

    }
  }
  onProceed(type:any){
    this.claimSection = false;this.causeOfLossSection = false;this.documentSection = false;
    this.incidentInfoSection = false;this.locationSection = false;this.finalSection = false;
    if(type=='claim'){
      this.claimSection = true;
    }
    else if(type=='causeOfLoss'){
      this.causeOfLossSection = true;
    } 
    else if(type=='incidentInfo'){
        this.incidentInfoSection = true;
    }
    else if(type=='locationInfo'){
      this.locationSection = true;
    }
    else if(type=='documentInfo'){
      this.documentSection = true;
    }
    else if(type=='finalInfo'){
     this.updateClaimStatus();
    }
    else if(type=='final' || type=='back'){
      sessionStorage.removeItem('editClaimId');
      this.router.navigate(['Login/IntimatedList']);
    }
  }
  updateClaimStatus(){
    let UrlLink = `api/slide4/documentinfo`;
    let ReqObj = {
      "Claimrefno": this.claimRefNo,
      "ClaimStatus":"Claim Intimated",
      "PolicyNo": this.policyNumber
  }
    this.onSaveApiDetails(UrlLink, ReqObj,'finalSection');
  }
  onSaveAccidentInfo(){
    let i=0;
    this.checkAcknowledgeError = false;this.incidentDateError = false;
    this.chassisNoError = false;this.incidentTimeError = false;this.incidentDateBtwnError = false;
    if(this.checkValidate=="N"){this.checkAcknowledgeError = true; i+=1;};
    if(this.incidentDate==null || this.incidentDate=='' || this.incidentDate==undefined){this.incidentDateError=true;i+=1}
    else{
      var fromDate = this.policyFrom.split("/");
      var toDate = this.policyTo.split('/');
      // month is 0-based, that's why we need dataParts[1] - 1
      var dateObject = new Date(+fromDate[2], fromDate[1] - 1, +fromDate[0]); 
      var toDateObj = new Date(+toDate[2], toDate[1] - 1, +toDate[0]); 
      let startDate = new Date(this.policyFrom),endDate = new Date(this.policyTo),date = new Date(this.datePipe.transform(this.incidentDate, "dd/MM/yyyy"))
      console.log("Date",dateObject,toDateObj,date,this.incidentDate,this.policyFrom,this.policyTo,new Date(this.policyFrom))
      if(this.incidentDate<dateObject || this.incidentDate>toDateObj){this.incidentDateBtwnError=true;i+=1;}
    }
    if(this.incidentTime==null || this.incidentTime=='' || this.incidentTime == undefined){this.incidentTimeError=true;i+=1}
    if(this.chassisNo==null || this.chassisNo=='' || this.chassisNo == undefined){this.chassisNoError=true;i+=1}
    if(i==0) this.onProceed('causeOfLoss');
  }
  onSaveLossTypeInfo(){
    let i=0;
    this.lossTypeError = false;
    if(this.lossTypeId=='' || this.lossTypeId==null || this.lossTypeId==undefined){this.lossTypeError=true;i+=1}
    if(i==0) this.onProceed('incidentInfo');
  }
  onSaveCauseInfo(){
    let i=0;
    this.causeLossError = false;
    if(this.causeLossId=='' || this.causeLossId==null || this.causeLossId==undefined){this.causeLossError=true;i+=1}
    if(i==0){
      this.onProceed('locationInfo');
    }
  }
  onSaveLocationDetails(){
    let i=0;
    this.drivenByError = false;this.accidentLocationError = false;this.vehicleTypeError = false;
    if(this.accidentAddress=='' || this.accidentAddress==null || this.accidentAddress==undefined){this.accidentLocationError=true;i+=1}
    if(this.drivenBy=='' || this.drivenBy==null || this.drivenBy==undefined){this.drivenByError=true;i+=1}
    // if(this.vehicleType=='' || this.vehicleType==null || this.vehicleType==undefined){this.vehicleTypeError=true;i+=1}
    if(i==0){
      if(this.claimRefNo==null || this.claimRefNo==undefined) this.onSaveClaimDetails();
      else this.saveAccidentDetails();
    }
  }
  onSaveClaimDetails(){
    let emailId=null;
    if(this.emailId!='' && this.emailId!=null && this.emailId!=undefined) emailId = this.emailId;
    let ReqObj = {
      "Claimrefno": this.claimRefNo,
      "Chassissno": this.chassisNo,
      "PolicyNo": this.policyNumber,
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CustMobCode": this.MobileCode,
      "Assuredname": this.assuredName,
      "Email": emailId,
      "Contactno": this.MobileNumber,
      "CreatedBy": this.logindata.LoginId,
      "Status": "Y",
      "ClaimStatus": "Customer Information"   
    }
    let UrlLink = `api/slide1/claimintimationdetails`;
    this.onSaveApiDetails(UrlLink,ReqObj,'accident');
  }
  saveAccidentDetails(){
    let ReqObj = {
      "Claimrefno": this.claimRefNo,
     "PolicyNo": this.policyNumber,
      "Accidentdate": this.datePipe.transform(this.incidentDate, "dd/MM/yyyy"),
      "Accidenttime": this.incidentTime,
      "Accidentreported": "",
      "CauseOfLossCode": this.causeLossId,
      "Constablenumberstation": "",
      "Driverwarningdescription": "",
      "Estimatespeedbeforeaccident": "",
      "Policecompliantfiledyn": "",
      "Typeofroadsurface": "",
      "Weatherconditions": "",
      "Visibility": "",
      "WetOrDry": "",
      "InsideafricaYn": "N",
      "InsuranceId": this.logindata.InsuranceId,
      "Usesofvehicle": this.vehicleUsagePurpose,
      "AccidentPlace": this.accidentAddress,
      "Losstypeid": [
          this.lossTypeId
      ],
      "ClaimStatus": "Accident Details",
      "CustGarageyn": "N",
      "GarageId": ""
    }
    let UrlLink = `api/slide2/accidentdetails`;
    this.onSaveApiDetails(UrlLink,ReqObj,'locationInfo');
  }
  saveVehicleTypeDetails(){
    if(this.vehicleType==null || this.vehicleType=='') this.vehicleType = 'Private';
    let ReqObj = {
      "Claimrefno": this.claimRefNo,
      "PolicyNo": this.policyNumber,
      "OwnerGoods": this.driverName,
      "Statementbydriver": this.accidentInfo,
      "Statementownerpolicyholder": this.vehicleUsagePurpose,
      "Typeofvehicle": this.vehicleType,
      "Drivedby": this.drivenBy,
      "ClaimStatus": "Damage Details"
    }
    let UrlLink = `api/slide3/statementinfo`;
    this.onSaveApiDetails(UrlLink,ReqObj,'documentInfo');
  }
  onSaveApiDetails(UrlLink,ReqObj,type){
    this.commondataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {
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
          if(this.claimRefNo==null || this.claimRefNo == undefined){
            this.claimRefNo = data.Claimrefno;
            
            sessionStorage.setItem('editClaimId', this.claimRefNo);
            let entry = {
              "PartyNo": null,
              "LosstypeId": null
            }
            // this.onGetDocumentList(entry);
          }
          if(type=='accident') this.saveAccidentDetails();
          else if(type=='locationInfo') this.saveVehicleTypeDetails();
          else if(type=='documentInfo') {
            if(this.claimInformation==null || this.claimInformation==undefined) this.getClaimDetails(type);
            else{ this.locationSection=false; this.documentSection = true;}
          }
          else if(type=='finalSection') this.finalSection = true;
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  
  onSelectLossType(rowData){
    this.lossTypeId = rowData.Code;
  }
  onSelectCauseLossType(rowData){
    this.causeLossId = rowData.CclCauseLossCode;
  }
  onSelectValue(event){
    if(event){
        this.checkValidate = "Y";
        this.checkAcknowledgeError = false;
    }
    else this.checkValidate = 'N';
  }
  onUploadDocuments(target:any,fileType:any,type:any){
    console.log("Event ",target);
    let event:any = target.target.files;

    let fileList = event;
    for (let index = 0; index < fileList.length; index++) {
      const element = fileList[index];
      var reader:any = new FileReader();
      reader.readAsDataURL(element);
        var filename = element.name;

        let imageUrl: any;
        reader.onload = (res: { target: { result: any; }; }) => {
          imageUrl = res.target.result;
          this.imageUrl = imageUrl;
          this.uploadDocList.push({ 'url': element,'DocTypeId':'','filename':element.name, 'JsonString': {} });

        }

    }
  }
  async onDeleteStaticDocument(item) {
    //(<HTMLInputElement> document.getElementById('#accidentfileInput')).value = null;
    // const foo = document.querySelector('#container')
    // foo.addEventListener('click', (event) => {
    //   event.preventDefault();
    // });
    let index = this.AccidentPhotos.findIndex((ele: any) => ele.JsonString.DocumentUploadDetails[0].Documentref == item.JsonString.DocumentUploadDetails[0].Documentref);
    this.AccidentPhotos.splice(index, 1);
    //this.onSelectAccidentPhotos(null);
  }

  onIncidentTypeChange(val:any){
    this.incidentDateType = val;
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
  
    if(this.incidentDateType=='T') this.incidentDate = new Date();
    else if(this.incidentDateType=='Y') this.incidentDate = new Date(year,month,day-1);
    else if(this.incidentDateType=='O') this.incidentDate = null;
  }
  onUploadFiles() {
    // if (this.isEditImagelgnth > 0 && this.AccidentPhotos.length!=0) {
    //   console.log("Edit Accident Entered")
    //   this.AccidentPhotos.splice(0, this.isEditImagelgnth);
    // }
    console.log("On Upload Files",this.AccidentPhotos.length)
    if (this.AccidentPhotos.length != 0) {

      for (let index = 0; index < this.AccidentPhotos.length; index++) {
        const element = this.AccidentPhotos[index];
        let i = this.UploadDocumentList.findIndex((ele: any) => (ele.FileName == element.JsonString.DocumentUploadDetails[0].FileName && ele.Doctypeid == element.JsonString.DocumentUploadDetails[0].DocId));
        if (i < 0) {
            element.JsonString['ClaimNo'] = this.claimRefNo;
          var formData = new FormData();
          formData.append(`file`, element.file,);
          formData.append(`showImage`, element.showImage,);
          formData.append(`JsonString`, JSON.stringify(element.JsonString));
          delete element.JsonString['Documentref'];
          element.JsonString['file'] = element.url;
          let UrlLink = `upload`;
          this.commondataService.onUploadFiles(UrlLink, element.JsonString).subscribe((data: any) => {
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
              if (index == (this.AccidentPhotos.length - 1)) {
                  // Swal.fire(
                  //   'Accidental Photos Uploaded Succssesfully!',
                  //   `Claimno: ${this.claimRefNo}`,
                  //   'success'
                  // )
                  this.onProceed('finalInfo')

              }
            }

          }, (err) => {

            this.handleError(err);
          })
        }
        else {
          if (index == (this.AccidentPhotos.length - 1)) {
            this.onProceed('finalInfo')
          }
        }

      }
    }
    else {
      this.viewSection = true;
      this.onProceed('finalInfo')
    }
  }
  onAccidentDateChange(){
    if(this.incidentDate){
      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();
      let date3 = formatDate(new Date(year, month, day-1),'yyyy-MM-dd','en_US');
      let date1 = formatDate(new Date(),'yyyy-MM-dd','en_US');
      let date2 = formatDate(this.incidentDate,'yyyy-MM-dd','en_US');
        console.log("Incident Date",date1,this.incidentDate)
        if(date1==date2){
              this.incidentDateType = 'T';
        }
        else if(date3 == date2){
          this.incidentDateType = 'Y';
        }
        else this.incidentDateType = 'O';
    }
  }
  onSelectChassisNo(rowData){
    this.chassisNo = rowData.VehicleInfo.ChassisNo;
    sessionStorage.setItem('chassisNo', rowData.VehicleInfo.ChassisNo);
      sessionStorage.setItem('productNo', rowData.PolicyInfo.Product);
      sessionStorage.setItem('SearchValue', this.policyNumber);
  }
  checkChassisSelection(rowData){
    return this.chassisNo==rowData.VehicleInfo.ChassisNo;
  }
  thirds(value:any){
    if(value=='third'){
      this.start=false;
      this.next=false;
      this.third=false;
      this.fourth=true;
    }
    else{
      this.start=true;
        this.next=true;
        this.third=false;
    }
   
  }
  onGetDocumentList(lossInfo) {
    let lossTypeId = [];
    this.DocumentImageList = [];
    this.AccidentPhotos = [];
    let ReqObj: any;
    let UrlLink = "";
      UrlLink = `api/getclaimdocmaster`;
      ReqObj = {
        "InsuranceId": this.logindata.InsuranceId,
        "Status": "Y",
        "Docapplicable": "CLAIM-ACC"
      }
    

    return this.commondataService.onGetDocumentList(UrlLink, ReqObj).subscribe((data: any) => {
      this.DocumentImageList = data;
      this.onGetUploadedDocuments(lossInfo);

    }, (err) => {
      this.handleError(err);
    })
  }
  onGetUploadedDocuments(event) {
    let claimRefNo = "";
    let createdBy = [];
    this.UploadDocumentList = [];
    this.AccidentPhotos = [];
    this.viewSection = false;
      claimRefNo = this.claimRefNo
      if (sessionStorage.getItem('claimCreatedBy')) {
        let name = sessionStorage.getItem('claimCreatedBy');
        let Exist = createdBy.some((ele: any) => ele == name);
        if (!Exist) {
          createdBy.push(sessionStorage.getItem('claimCreatedBy'));
        }
        let logExist = createdBy.some((ele: any) => ele == this.logindata.LoginId);
        if (!logExist) {
          createdBy.push(this.logindata.LoginId);
        }
      }
      else {
        let Exist = createdBy.some((ele: any) => ele == this.logindata.LoginId);
        if (!Exist) {
          createdBy.push(this.logindata.LoginId);
        }
      }
    // let ReqObj = {
    //   "Claimno": claimRefNo,
    //   "PartyNo": event.PartyNo,
    //   "LossId": event.LosstypeId,
    //   "CreatedBy": event.CreatedBy,
    // }
    let accYN = 'N';
      accYN = 'Y'
    let ReqObj = {
      "Claimno": claimRefNo,
      "PartyNo": event.PartyNo,
      "LossId": event.LosstypeId,
      "Accimage": accYN,
      "Insid": this.logindata.InsuranceId,
      "CreatedBy": createdBy,
      "LoginId": this.logindata.LoginId
    }
    let UrlLink = `getdoclist`;
    return this.commondataService.onGetUploadedDocuments(UrlLink, ReqObj).subscribe((data: any) => {
      this.UploadDocumentList = data;
      if (data) {
        let Img108 = data.filter((ele: any) => ele.docApplicable == "CLAIM-ACC");

        if (Img108.length > 0) {
          let arr = [];
          for (let index = 0; index < Img108.length; index++) {

            const element = Img108[index];

            this.onGetImageFile(element);
            if (index == Img108.length - 1) {
              // forkJoin(arr).subscribe(responses => {
              //     for (let index = 0; index < responses.length; index++) {
              //       const element:any = responses[index];
              //        let file = this.onBase64dataURLtoFile(element.IMG_URL, element.FileName);
              //        this.onSelectAccidentPhotos([file], Img108[index], 'indirect');
              //        if(index==responses.length-1){
              //         this.AccidentPhotos = _.uniqBy(this.AccidentPhotos, 'FileName');
              //        }
              //     }
              // });
              this.viewSection = true;
            }
          }
        }
        else {
          this.viewSection = true;
        }
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  onGetImageFile(list: any) {
    let UrlLink = "getimagefile";
    let claimRefNo = "";
    let ReqObj = {
      "ClaimNo": this.claimRefNo,
      "ReqRefNo": list.Documentref,
      "DocTypeId": list.documentId,
      "ProductId": list.ProductId,
      "InsId": list.companyId
    }
    return this.commondataService.onGetBase64Image(UrlLink, ReqObj).subscribe((data: any) => {
      let file = this.onBase64dataURLtoFile(data.IMG_URL, list.FileName);
      this.onSelectAccidentPhotos([file], list, 'indirect');
    }, (err) => {

      this.handleError(err);
    })

  }
  onBase64dataURLtoFile(dataurl, filename) {
    if (dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }

  }
  onSelectAccidentPhotos(event: any, fileType, type) {
    let partyNo = "";
    let lossId = "";
    let fileList = event;
    var JsonObj = {};
    let item = this.DocumentImageList.find((ele: any) => ele.docApplicable == "CLAIM-ACC");
    for (let index = 0; index < fileList.length; index++) {
      const element = fileList[index];

      var reader = new FileReader();
      reader.readAsDataURL(element);
      if ((element.size / 1024 / 1024 <= 4) || type != 'direct') {
        var filename = element.name;
        if(filename){
          let typeList:any[] = filename.split('.');
          if(typeList.length!=0){
            let type = typeList[1];
            fileList[index]['fileType'] = type;
          }
        }
        let imageUrl: any;
        reader.onload = (event) => {
          imageUrl = event.target.result;
          this.imageUrl = imageUrl;
          let refNo = "";
          if (fileType != null) {
            refNo = fileType.Documentref;
          }
          let loginValue = this.logindata.LoginId;
          if (sessionStorage.getItem('claimCreatedBy')) {
            loginValue = sessionStorage.getItem('claimCreatedBy');
          }
          else {
            loginValue = this.logindata.LoginId;
          }
          let deleteYN = 'Y'; let param2 = "";
          if (type != 'direct') {
            deleteYN = fileType.Delete;
            if (fileType.Param2) {
              param2 = fileType.Param2;
            }
          }

          JsonObj = {
            "ProductId": item.ProductId,

            "DocumentUploadDetails": [
              {
                "DocTypeId": item.documentId,
                "FilePathName": "",
                "Delete": deleteYN,
                "Description": item.documentDesc,
                "ProductId": item.ProductId,
                "FileName": filename,
                "OpRemarks": item.remarks,
                "UploadType": item.docApplicable,
                "Documentref": refNo,
                "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
                "Param2": param2,
                "DocId": item.documentId,
                "InsId": item.companyId,
                "CreatedBy": loginValue,
                "LossId": lossId,
                "PartyNo": partyNo,
              }
            ]

          }
          let Exist = this.AccidentPhotos.some((ele: any) => ele.JsonString.DocumentUploadDetails[0].FileName == filename);
          let Index = this.AccidentPhotos.findIndex((ele: any) => ele.JsonString.DocumentUploadDetails[0].FileName == filename);

          if (!Exist) {
            this.AccidentPhotos.push({ 'url': this.imageUrl,"fileName":filename, "FileType":fileList[index]['fileType'], 'JsonString': JsonObj });

          }
          else if (type == 'direct') {
            Swal.fire(
              `Selected File ${element.name} Already Exist`,
              'Invalid Document'
            )
          }
          //this.AccidentPhotos.push({ 'url': this.imageUrl, 'JsonString': JsonObj, 'FileName':filename });
          if (index == fileList.length - 1) {
            //this.AccidentPhotos = _.uniqBy(this.AccidentPhotos, 'FileName');
          }

        }
      }
      else {
        if (type == 'direct') {
          if (element.size / 1024 / 1024 >= 4) {
            Swal.fire(
              `Selected File ${element.name} Size Exceeds More Than 4 Mb`,
              'Invalid Document'
            )
          }
          // else {
          //   Swal.fire(
          //     `Selected File ${element.name} Size Should be More Than 800kb`,
          //     'Invalid Document'
          //   )
          // }
        }

      }


    }
    console.log("Acccccc", this.AccidentPhotos);
  }
  checkUploadimg(item, index) {
    let file = item.JsonString.DocumentUploadDetails[0];
    if (this.UploadDocumentList.length != 0 && file != undefined) {
      let i = this.UploadDocumentList.findIndex((ele: any) => ele.FileName == file.FileName);
      if (i != null && i != undefined && i >= 0) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  onViewImage(item) {
    // this.ViewImages = item;
    this.commondataService.onGetImageUrl(item);
    const dialogRef = this.dialog.open(ImageviewModalComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  async onDeleteDocument(item) {
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
        const foo = document.querySelector('#container')
        foo.addEventListener('click', (event) => {
          event.preventDefault();
        });

        let onDelete = this.UploadDocumentList.find((ele: any) => ele.Documentref == item.JsonString.DocumentUploadDetails[0].Documentref);
        let UrlLink = "deletedoc";
        
        let reqObj = {
          "Claimno": this.claimRefNo,
          "Documentref": onDelete.Documentref,
          "Doctypeid": onDelete.Doctypeid,
          "Filepathname": onDelete.FilePathName
        }

        return this.commondataService.onGetImage(UrlLink, reqObj).subscribe((data: any) => {

          Swal.fire(
            data.Messeage,
            'success'
          )
          let entry = {
            "PartyNo": null,
            "LosstypeId": null
          }
          this.onGetDocumentList(entry);
        }, (err) => {
          this.handleError(err);
        })
      }
    });
  }
  onDownloadImage(docData) {
    let item = docData.JsonString.DocumentUploadDetails[0];
    let fileType = docData.FileType;
    let UrlLink = "getimagefilehigh";
    let ReqObj = {
      "ClaimNo": this.claimRefNo,
      "ReqRefNo": item.Documentref,
      "DocTypeId": item.DocTypeId,
      "ProductId": docData.JsonString.ProductId,
      "InsId": item.InsId
    }
    return this.commondataService.onGetUploadedDocuments(UrlLink, ReqObj).subscribe((data: any) => {

      var a = document.createElement("a");
      a.href = data.IMG_URL;
      a.download = item.FileName;
      // start download
      a.click();
    }, (err) => {

      this.handleError(err);
    })

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
  onLogOut(){
    sessionStorage.clear();
    this.router.navigate(['/Login'])
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
