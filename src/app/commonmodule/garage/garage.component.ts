import { GarageService } from './garage.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { ClaimjourneyService } from '../claimjourney/claimjourney.service';
import { DashboardTableService } from '../dashboard-table/dasboard-table.service';
import { LossService } from '../loss/loss.service';
import { PolicyService } from '../policy/policy.service';
import { DatePipe, Location } from '@angular/common'
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusUpdateComponent } from 'src/app/shared/lossinfocomponent/status-update/status-update.component';
import { GarageTermsConditionsComponent } from './modal/garage-terms-conditions/garage-terms-conditions.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.css']
})
export class GarageComponent implements OnInit, OnDestroy {
  public logindata: any;
  public claimDetails: any;
  public GarageLoss: any;
  public LossDetails: any;
  public GarageEdit: any;
  public DamagePoints: any=[];
  public LossInformation: any;
  public documentDetails:any;
  public PolicyInformation: any = {};
  public damageComponent: any;
  private subscription = new Subscription();
  garageForms: FormGroup;surveyorForms: FormGroup;
  WhoView:any=null;
  imageUrl: any;
  approvalSection: boolean = true;
  claimApproveSection: boolean = false;
  filename: any="";
  surveyorLoginId: any;
  documentAltDetails: any;
  userType: any;
  insuranceId: any;
  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    private lossService: LossService,
    public dialog: MatDialog,
    private dashboardTableService: DashboardTableService,
    private commondataService: CommondataService,
    private claimjourneyService: ClaimjourneyService,
    private location: Location,
    private garageService: GarageService,
    private datePipe: DatePipe,
    private router:Router
  ) {
    //this.commondataService.onGetNationality();
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.userType = this.logindata.UserType;
    this.insuranceId = this.logindata.InsuranceId;
    this.GarageLoss = JSON.parse(sessionStorage.getItem("GarageLossDetails"));
    this.LossDetails = JSON.parse(sessionStorage.getItem("LossDetails"));
    console.log("Info",this.LossInformation,this.claimDetails)
    console.log("All Edit",this.GarageLoss, this.LossDetails);
    if(this.logindata.UserType=='garage'){
      this.WhoView = 'GarageSide';
    }
    else this.WhoView = 'Surveyor';
  } 

  ngOnInit(): void {
    //this.onCreateFromControls();
    this.onFetchGarageDetails();

    this.subscription = this.claimjourneyService.getpolicyInfo.subscribe(async (event: any) => {
      this.PolicyInformation = event;
      if (this.PolicyInformation == null) {
        this.claimjourneyService.onGetPolicyDetails(this.GarageLoss.PolicyNo,'byChassisNo',this.LossDetails.Claimrefno);
      }
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCreateFromControls() {
    this.garageForms = this.fb.group({
      YoungAgeDriver: [{ value: 0, disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required, Validators.maxLength(50)]],
      SparePartsCost: [{ value: 0, disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required, Validators.maxLength(50)]],
      Consumables: [{ value: 0, disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required, Validators.maxLength(50)]],
      TotalLabourHours: [{ value: 0, disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required, Validators.maxLength(50)]],
      LabourCostPerHour: [{ value: 0, disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required, Validators.maxLength(50)]],
      LabourCost: [{ value: 0, disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required, Validators.maxLength(50)]],
      LessBetterment: [{ value: 0, disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required, Validators.maxLength(50)]],
      LessExcess: [{ value: 0, disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required, Validators.maxLength(50)]],
      UnderInsurance: [{ value: 0, disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required, Validators.maxLength(50)]],
      SalvageAmount: [{ value: 0, disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required, Validators.maxLength(50)]],
      GarageStatus: [{ value: '', disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required]],
      ExpectedStartsDate: [{ value: '', disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [ Validators.maxLength(50)]],
      NoOfDays: [{ value: 0, disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [ Validators.maxLength(50)]],
      GarageRemarks: [{ value: '', disabled: this.checkGarageDisable()}, [Validators.required, Validators.maxLength(50)]],
      UploadQuotation: [{ value: '', disabled: this.checkGarageDisable() && this.checkGarageDisable2() },],
      claimOfficerStatus: [{ value: '', disabled: this.checkClaimDisable() && this.checkGarageDisable2() }, [Validators.required,]],
      claimOfficerRemarks: [{ value: '', disabled: this.checkClaimDisable() && this.checkGarageDisable2() }, [Validators.required,]],
      garageApproveStatus: [{ value: '', disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required,]],
      garageApproveRemarks: [{ value: '', disabled: this.checkGarageDisable() && this.checkGarageDisable2() }, [Validators.required,]],
    });
    this.surveyorForms = this.fb.group({
      YoungAgeDriver: [{ value: 0, disabled: this.checkClaimDisable() }, [Validators.required, Validators.maxLength(50)]],
      SparePartsCost: [{ value: 0, disabled: this.checkClaimDisable() }, [Validators.required, Validators.maxLength(50)]],
      Consumables: [{ value: 0, disabled: this.checkClaimDisable() }, [Validators.required, Validators.maxLength(50)]],
      TotalLabourHours: [{ value: 0, disabled: this.checkClaimDisable() }, [Validators.required, Validators.maxLength(50)]],
      LabourCostPerHour: [{ value: 0, disabled: this.checkClaimDisable() }, [Validators.required, Validators.maxLength(50)]],
      LabourCost: [{ value: 0, disabled: this.checkClaimDisable() }, [Validators.required, Validators.maxLength(50)]],
      LessBetterment: [{ value: 0, disabled: this.checkClaimDisable() }, [Validators.required, Validators.maxLength(50)]],
      LessExcess: [{ value: 0, disabled: this.checkClaimDisable() }, [Validators.required, Validators.maxLength(50)]],
      UnderInsurance: [{ value: 0, disabled: this.checkClaimDisable() }, [Validators.required, Validators.maxLength(50)]],
      SalvageAmount: [{ value: 0, disabled: this.checkClaimDisable() }, [Validators.required, Validators.maxLength(50)]],
      GarageStatus: [{ value: '', disabled: this.checkClaimDisable() }, [Validators.required]],
      ExpectedStartsDate: [{ value: '', disabled: this.checkClaimDisable() }, [ Validators.maxLength(50)]],
      NoOfDays: [{ value: 0, disabled: this.checkClaimDisable() }, [ Validators.maxLength(50)]],
      GarageRemarks: [{ value: '', disabled: this.checkClaimDisable() }, [Validators.required, Validators.maxLength(50)]],
      UploadQuotation: [{ value: '', disabled: this.checkClaimDisable() },],
      claimOfficerStatus: [{ value: '', disabled: this.checkClaimDisable() }, [Validators.required,]],
      claimOfficerRemarks: [{ value: '', disabled: this.checkClaimDisable() }, [Validators.required,]],
    })
    this.setGarageValue();
  }
  setGarageValue(){
    if(this.GarageEdit.GarageRemarks == null){
      this.claimApproveSection = false;
    }
    else{
      this.claimApproveSection = true;
    }
    if (this.GarageEdit) {
      this.garageForms.controls['GarageStatus'].setValue(this.GarageEdit.ApprovedYn == ''?'Y':this.GarageEdit.ApprovedYn);
      //if(this.GarageEdit.SubStatus == 'QAFG' || this.GarageEdit.SubStatus == 'QS' || this.GarageEdit.SubStatus == 'SA' ){
        this.garageForms.controls['GarageStatus'].setValue('Y');
        this.approvalSection = false;
        this.garageForms.controls['YoungAgeDriver'].setValue(this.GarageEdit.YoungAgeDriver);
        this.garageForms.controls['SparePartsCost'].setValue(this.GarageEdit.SparepartsCost);
        this.garageForms.controls['Consumables'].setValue(this.GarageEdit.ConsumablesCost);
        this.garageForms.controls['TotalLabourHours'].setValue(this.GarageEdit.TotalLabourHour);
        this.garageForms.controls['LabourCostPerHour'].setValue(this.GarageEdit.PerHourLabourCost);
        this.garageForms.controls['LabourCost'].setValue(this.GarageEdit.LabourCost);
        this.garageForms.controls['LessBetterment'].setValue(0);
        this.garageForms.controls['LessExcess'].setValue(0);
        this.garageForms.controls['UnderInsurance'].setValue(0);
        this.garageForms.controls['SalvageAmount'].setValue(this.GarageEdit.SalvageAmount);
        console.log("Change",this.garageForms.value);
      //}
      this.approvalSection = true;
          if(this.GarageEdit.ApprovedYn!='N'){
            
            this.getClaimLossDetails();
          }
     
      this.garageForms.controls['ExpectedStartsDate'].setValue(this.GarageEdit.ExpectedStartdate == null ? '' : this.onDateFormatInEdit(this.GarageEdit.ExpectedStartdate));
      this.garageForms.controls['NoOfDays'].setValue(this.GarageEdit.Noofdays);
      this.garageForms.controls['GarageRemarks'].setValue(this.GarageEdit.GarageRemarks);
      if(this.GarageLoss.SubStatus == 'CLG' || this.GarageLoss.SubStatus == 'QAFG' || this.GarageLoss.SubStatus == 'QS' || this.GarageLoss.SubStatus == 'CLS') this.garageForms.controls['garageApproveRemarks'].setValue(this.GarageEdit.GarageRemarks);
      this.garageForms.controls['UploadQuotation'].setValue(this.GarageEdit.Uploadquatationyn)
      if(this.GarageEdit.AllotedYn){
        
        this.garageForms.controls['claimOfficerStatus'].setValue(this.GarageEdit.AllotedYn);
      }
      else{
        this.garageForms.controls['claimOfficerStatus'].setValue('');
      }
      if(this.GarageEdit.ClaimofficerRemarks) this.garageForms.controls['claimOfficerRemarks'].setValue(this.GarageEdit.ClaimofficerRemarks);
      this.DamagePoints = this.GarageEdit.VehpartsId == null ?[]:this.GarageEdit.VehpartsId;
      this.LossInformation = this.GarageLoss;
      this.onGetUploadedDocuments();
    }
  }
  checkClaimDisable() {
    return (this.logindata.UserType == 'garage' || this.logindata.UserType == 'claimofficer');
  }
  checkGarageDisable() {
    return ((this.logindata.UserType != 'garage' && this.GarageEdit.ApprovedYn!='A' && this.GarageEdit.ApprovedYn!='N'));
  }
  checkGarageDisable2(){
    return (this.GarageLoss.SubStatus == 'GQA' || this.logindata.UserType != 'garage')
  }
  checkGarageStatus(){
    if(this.logindata.UserType=='garage'){
      return ((this.surveyorLoginId!=null && this.GarageLoss.SubStatus != 'QAFG'))
    }
    else return true;
  }
  commonReqObject() {
    return {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId": this.logindata?.OaCode,
    }
  }
  getStatusName(){
    if(this.garageForms.controls['claimOfficerStatus'].value=='CL') return 'Clarification Required'
    else if(this.garageForms.controls['claimOfficerStatus'].value=='CA') return 'Accepted'
    else if(this.garageForms.controls['claimOfficerStatus'].value=='CR') return 'Rejected'
    else return '';
  }
  onQuotationDocuments(event) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    var filename = event.target.files[0].name;
    this.filename = filename;
    let imageUrl: any;
    reader.onload = (event) => {
      imageUrl = event.target.result;
      let partyNo = "";
      let lossId = "";
      let productId = "";let insuranceId = "";
      let claimno = "";
      if(this.GarageLoss){
        partyNo =  this.GarageLoss.PartyNo;
        lossId = this.GarageLoss.LosstypeId;
        productId = this.GarageLoss.ProductId;
        insuranceId = this.GarageLoss.InsuranceId;
        claimno = this.GarageLoss.Claimrefno;
      }
      else if(this.LossDetails){
        partyNo =  this.LossDetails.PartyNo;
        lossId = this.LossDetails.LosstypeId;
        insuranceId = this.LossDetails.InsuranceId;
        claimno = this.LossDetails.Claimrefno;
      }
      this.onSetBackGroundImage(imageUrl);
      var JsonObj = {
        "ProductId": productId,
        'ClaimNo':claimno,
        "DocumentUploadDetails": [
          {
            "DocTypeId": "111",
            "FilePathName": "",
            "Description": "Garage Quotation",
            "ProductId": productId,
            "FileName": filename,
            "OpRemarks": "",
            "UploadType": "CLAIM-GARAGE",
            "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
            "DocId": "111",
            "InsId": insuranceId,
            "CreatedBy": this.logindata.LoginId,
            "LossId": lossId,
            "PartyNo": partyNo,
            "Devicefrom":"WebApplication"
          }
        ]
      }
      this.documentDetails = { 'url':imageUrl, 'JsonString': JsonObj }

      var formData = new FormData();
      formData.append(`file`, this.documentDetails.url);
      formData.append(`JsonString`, JSON.stringify(this.documentDetails.JsonString));
      let UrlLink = `upload`;
      this.documentDetails.JsonString['file']=this.documentDetails.url;
      this.lossService.onUploadFiles(UrlLink, this.documentDetails.JsonString).subscribe((data: any) => {
        console.log("DocumentsFiles", data);
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
          Swal.fire(
            'Document Uploaded Succssesfully!',
            'success'
          );
          this.filename = null;
          this.onGetUploadedDocuments();
        }
      }, (err) => {

        let element = '';
        if (err.statusText) {
           this.errorService.showValidateError(err.statusText)
        }
      })
    }
  }
  async onDeleteDocument() {
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

        let item = this.documentAltDetails;
          let UrlLink = "deletedoc";
          let claimRefNo = "";
          let reqObj = {
            "Claimno":  this.LossDetails.Claimrefno,
            "Documentref": item.Documentref,
            "Doctypeid": item.DocTypeId,
            "Filepathname": item.FilePathName
          }

          return this.lossService.onDeleteDocument(UrlLink, reqObj).subscribe((data: any) => {


            Swal.fire(
              data.Messeage,
              'Delete'
            )
              const element = this.documentAltDetails;
              this.documentAltDetails = null;
              this.filename = null;
              this.imageUrl = null;
             window.location.reload();

          }, (err) => {

            this.handleError(err);
          })
        }
      
    });
  }
  onDownloadImage() {
    let item = this.documentAltDetails;
    let UrlLink = "getimagefilehigh";
    let claimRefNo = "";
    // else if (this.claimInfo && this.claimInfo != undefined) {
    //   claimRefNo = this.claimInfo.ClaimRefNo
    // }
    let ReqObj = {
      "ClaimNo": this.LossDetails.Claimrefno,
      "ReqRefNo": item.Documentref,
      "DocTypeId": item.DocTypeId,
      "ProductId": item.ProductId,
      "InsId": item.InsId
    }
    return this.lossService.onGetUploadedDocuments(UrlLink, ReqObj).subscribe((data: any) => {

      var a = document.createElement("a");
      a.href = data.IMG_URL;
      this.imageUrl = data.IMG_URL;
      a.download = data.FileName;
      // start download
      a.click();
    }, (err) => {

      this.handleError(err);
    })

  }
  onGetUploadedDocuments() {
    let partyNo = "";
      let lossId = "";
      let productId = "";let insuranceId = "";
      let claimno = "";let createdBy = [];
      if(this.GarageLoss){
        partyNo =  this.GarageLoss.PartyNo;
        lossId = this.GarageLoss.LosstypeId;
        productId = this.GarageLoss.ProductId;
        insuranceId = this.GarageLoss.InsuranceId;
        claimno = this.GarageLoss.Claimrefno;
        console.log("Garage Losssss",this.GarageLoss);
      }
      else if(this.LossDetails){
        partyNo =  this.LossDetails.PartyNo;
        lossId = this.LossDetails.LosstypeId;
        insuranceId = this.LossDetails.InsuranceId;
        claimno = this.LossDetails.Claimrefno;
        console.log("Losssss Details",this.LossDetails);
      }
      if(this.logindata.UserType == 'garage'){
          createdBy = [this.logindata.LoginId];
      }
      else{
        if(this.GarageEdit){
          createdBy.push(this.GarageEdit.GarageLoginId);
        }
      }
    let ReqObj = {
      "Claimno": claimno,
      "PartyNo": partyNo,
      "LossId": lossId,
      "Accimage": 'N',
      "Insid":this.logindata.InsuranceId,
      "CreatedBy": createdBy,
      "LoginId":this.logindata.LoginId
    }
    let UrlLink = `getdoclist`;
    return this.lossService.onGetUploadedDocuments(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("Uploaded Document Req",ReqObj);
      let LossDocumentFile = data.filter((ele: any) => ele.documentId == "111");
      if (LossDocumentFile.length > 0) {
        for (let index = 0; index < LossDocumentFile.length; index++) {
          const element = LossDocumentFile[index];
          this.onGetBase64Image(element);
        }
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  onGetBase64Image(list) {
    console.log("Received List", list);
    let UrlLink = "getimagefile";
    let partyNo = "";
      let lossId = "";
      let productId = "";let insuranceId = "";
      let claimno = "";let createdBy = "";
      if(this.GarageLoss){
        partyNo =  this.GarageLoss.PartyNo;
        lossId = this.GarageLoss.LosstypeId;
        productId = this.GarageLoss.ProductId;
        insuranceId = this.GarageLoss.InsuranceId;
        claimno = this.GarageLoss.Claimrefno;

      }
      else if(this.LossDetails){
        partyNo =  this.LossDetails.PartyNo;
        lossId = this.LossDetails.LosstypeId;
        insuranceId = this.LossDetails.InsuranceId;
        claimno = this.LossDetails.Claimrefno;
      }
    let reqObj = {
      "ClaimNo": claimno,
      "ReqRefNo": list.Documentref,
      "DocTypeId": list.Doctypeid,
      "ProductId": list.ProductId,
      "InsId": list.companyId
    }
    console.log("Received List Req", reqObj);
    return this.lossService.onGetBase64Image(UrlLink, reqObj).subscribe((data: any) => {
      console.log('imageedit', data)
      this.filename = data.FileName;
      this.documentAltDetails = data;
      this.OnEditAccidentPhotos(list,data);
    }, (err) => {

      this.handleError(err);
    })
  }
  OnEditAccidentPhotos(item,data) {
    console.log("Event Receivedddddddddddddd",item,data);
    this.filename = data.FileName;
    this.imageUrl = data.IMG_URL;
    let image = (<HTMLInputElement>document.getElementById(`Image_Quotation`));
      image.style.backgroundImage = "url(" + this.imageUrl + ")";

  }
  onSetBackGroundImage(imageUrl) {
    console.log("Image Url",imageUrl)
    if (imageUrl) {
      let image = (<HTMLInputElement>document.getElementById(`Image_Quotation`));
      image.style.backgroundImage = "url(" + imageUrl + ")";
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

  ConvertToInt(val) {
    if (val == '' || val == null) {
      return 0;
    }
    return parseInt(val);
  }

  onFetchGarageDetails() {


    let ReqObj = {
      "ChassisNo": this.GarageLoss.ChassisNo,
      "ClaimNo": this.GarageLoss.ClaimNo,
      "GarageId": this.GarageLoss.GarageId,
      "InsuranceId": this.GarageLoss.InsuranceId,
      "PolicyNo": this.GarageLoss.PolicyNo,
      "ProductId": this.GarageLoss.ProductId,
      "RegionCode": this.GarageLoss.RegionCode == null ? this.LossDetails.RegionCode : this.GarageLoss.RegionCode,
      "BranchCode": this.GarageLoss.BranchCode,
      "CreatedBy": this.logindata.LoginId,
      "PartyNo": this.GarageLoss.PartyNo,
      "LosstypeId": this.GarageLoss.LosstypeId
    }
    console.log("FinalReq", ReqObj);
    let UrlLink = "api/viewgaragequotedetails";
    return this.garageService.onFetchGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {

      console.log("Edit Res", data);
      this.GarageEdit = data;
      this.onCreateFromControls();

    }, (err) => {
      this.handleError(err);
    })
  }
  getClaimLossDetails(){
    console.log("LInfo",this.LossInformation,this.LossDetails)
    let ReqObj = {
      "ChassisNo": this.LossDetails.ChassisNo,
      "ClaimNo": this.LossDetails.ClaimNo,
      "PartyNo": this.LossDetails.PartyNo,
      "PolicyNo": this.LossDetails.PolicyNo,
      "LosstypeId": this.LossDetails.LosstypeId,
      "LossNo": null,
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy":this.LossDetails.CreatedBy,
      "UserType": "garage",
      "UserId": this.LossDetails?.OaCode
    }

    console.log(ReqObj);

    let UrlLink = `api/claimlossdetailsbyid`;
    return this.lossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {
        this.surveyorLoginId = data?.SurveyorLoginId;
        if(this.surveyorLoginId!=null){
          this.getBasicCostDetaIls();
        }
       
    }, (err) => {
      this.handleError(err);
    })
  }
  getBasicCostDetaIls(){
    let ReqObj = {
      "ChassisNo": this.LossDetails.ChassisNo,
      "ClaimNo": this.LossDetails.ClaimNo,
      "PartyNo": this.LossDetails.PartyNo,
      "PolicyNo": this.LossDetails.PolicyNo,
      "LosstypeId": this.LossDetails.LosstypeId,
      "LossNo": null,
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy":this.surveyorLoginId,
      "UserType": "surveyor",
      "UserId": this.LossDetails?.OaCode
    }

    console.log(ReqObj);

    let UrlLink = `api/claimlossdetailsbyid`;
    return this.lossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {
      let res:any = data;
      this.surveyorForms.controls['YoungAgeDriver'].setValue(res?.YoungAgeDriver);
      this.surveyorForms.controls['SparePartsCost'].setValue(res?.SparepartsCost);
      this.surveyorForms.controls['Consumables'].setValue(res?.ConsumablesCost);
      this.surveyorForms.controls['TotalLabourHours'].setValue(res?.TotalLabourHour);
      this.surveyorForms.controls['LabourCostPerHour'].setValue(res?.PerHourLabourCost);
      this.surveyorForms.controls['LabourCost'].setValue(res?.LabourCost);
      this.surveyorForms.controls['LessBetterment'].setValue(res?.LessBetterment);
      this.surveyorForms.controls['LessExcess'].setValue(res?.LessExcess);
      this.surveyorForms.controls['UnderInsurance'].setValue(res?.UnderInsurance);
      this.surveyorForms.controls['SalvageAmount'].setValue(res?.SalvageAmount);
    }, (err) => {
      this.handleError(err);
    })
  }
  getGarageStatus(){
    let data = {
      garageLoss : this.GarageLoss,
      lossDetails : this.LossDetails
    }

    const dialogRef = this.dialog.open(GarageTermsConditionsComponent, {
      width: '100%',
      data: data
    });
  }
  getDamageListValues(event) {
    this.garageForms.controls['LessBetterment'].setValue(event.TotalLessBetterment);
    this.garageForms.controls['SparePartsCost'].setValue(event.TotalSparePartsCost);
    this.garageForms.controls['TotalLabourHours'].setValue(event.TotalNoOfHours);
    this.garageForms.controls['SalvageAmount'].setValue(event.TotalSalvageAmount);
  }

  saveGarageDetails(save) {
    let ReqObj: any = {};
    if(this.logindata.UserType == 'garage' || this.logindata.UserType == 'surveyor'){
      if (this.logindata.UserType == 'garage' || (this.logindata.UserType == 'surveyor' && (this.GarageEdit.ApprovedYn=='A' || this.GarageEdit.ApprovedYn=='N'))) {
        if(this.garageForms.controls['SparePartsCost'].value){
          this.garageForms.controls['SparePartsCost'].setValue(String(this.garageForms.controls['SparePartsCost'].value.replace(/,/g, '')));
        }
        if(this.garageForms.controls['SalvageAmount'].value){
          this.garageForms.controls['SalvageAmount'].setValue(String(this.garageForms.controls['SalvageAmount'].value.replace(/,/g, '')));
        }
        if(this.garageForms.controls['YoungAgeDriver'].value){
          this.garageForms.controls['YoungAgeDriver'].setValue(String(this.garageForms.controls['YoungAgeDriver'].value.replace(/,/g, '')));
        }
        let status = null;
        if(this.garageForms.controls['claimOfficerStatus'].value=='CL'){
          status = 'CL'
        }
        else status = this.garageForms.controls['GarageStatus'].value
        let TotalPrice = (this.ConvertToInt(this.garageForms.controls['SparePartsCost'].value) + this.ConvertToInt(this.garageForms.controls['YoungAgeDriver'].value) + this.ConvertToInt(this.garageForms.controls['Consumables'].value) + (this.ConvertToInt(this.garageForms.controls['TotalLabourHours'].value) * this.ConvertToInt(this.garageForms.controls['LabourCostPerHour'].value))) -
          (this.ConvertToInt(this.garageForms.controls['LessBetterment'].value) + this.ConvertToInt(this.garageForms.controls['LessExcess'].value) + this.ConvertToInt(this.garageForms.controls['UnderInsurance'].value))
        if(this.GarageLoss.SubStatus == 'CLG' || (this.GarageEdit.ApprovedYn!='N' && this.GarageEdit.ApprovedYn!='A')) this.garageForms.controls['GarageRemarks'].setValue(this.garageForms.controls['garageApproveRemarks'].value)
        ReqObj = {
          "ClaimNo": this.GarageLoss.ClaimNo,
          "PartyNo": this.GarageLoss.PartyNo,
          "LosstypeId": this.GarageLoss.LosstypeId,
          "PolicyNo": this.GarageLoss.PolicyNo,
          "GarageId": this.GarageLoss.GarageId,
          "ApprovedYn": status,
          "ExpectedStartdate": this.datePipe.transform(this.garageForms.controls['ExpectedStartsDate'].value, "dd/MM/yyyy"),
          "LabourCost": this.ConvertToInt(this.garageForms.controls['TotalLabourHours'].value) * this.ConvertToInt(this.garageForms.controls['LabourCostPerHour'].value),
          "Noofdays": this.garageForms.controls['NoOfDays'].value,
          "Uploadquatationyn": this.garageForms.controls['UploadQuotation'].value != '' ? 'Y' : 'N',
          "GarageRemarks": this.garageForms.controls['GarageRemarks'].value,
          "Remarks": "",
          "AllotedYn": this.garageForms.controls['claimOfficerStatus'].value,
          "SaveorSubmit": save,
          "YoungAgeDriver": this.garageForms.controls['YoungAgeDriver'].value,
          "SparepartsCost": this.garageForms.controls['SparePartsCost'].value,
          "VehpartsId": this.DamagePoints,
          "ConsumablesCost": this.garageForms.controls['Consumables'].value,
          "ClaimofficerRemarks": this.garageForms.controls['claimOfficerRemarks'].value,
          "TotalLabourHour": this.garageForms.controls['TotalLabourHours'].value,
          "PerHourLabourCost": this.garageForms.controls['LabourCostPerHour'].value,
          "SalvageAmount": this.garageForms.controls['SalvageAmount'].value,
          "TotalPrice": TotalPrice,
          ...this.commonReqObject()
        }
      }
      if (this.logindata.UserType == 'surveyor' && (this.GarageEdit.ApprovedYn!='A' && this.GarageEdit.ApprovedYn!='N')) {

        ReqObj = {
          "ClaimNo": this.GarageLoss.ClaimNo,
          "Chassissno": this.GarageLoss.ChassisNo,
          "PartyNo": this.GarageLoss.PartyNo,
          "LosstypeId": this.GarageLoss.LosstypeId,
          "Productid": this.GarageEdit.ProductId,
          "PolicyNo": this.GarageLoss.PolicyNo,
          "GarageId": this.GarageLoss.GarageId,
          "SaveorSubmit": save,
          "AllotedYn": this.garageForms.controls['claimOfficerStatus'].value,
          "ClaimofficerRemarks": this.garageForms.controls['claimOfficerRemarks'].value,
          ...this.commonReqObject()
        }
        console.log(ReqObj)
      }
      let UrlLink = `api/updategarageapprovaldetail`;
      console.log("Final Submit Req", ReqObj);
      return this.garageService.saveGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {

        console.log("Final Submit", data);
        if (data.Response == "Success") {
          if (this.logindata.UserType == 'surveyor') {
              //if(this.GarageLoss.SubStatus == 'CLG' || this.GarageLoss.SubStatus == 'SD' || this.GarageLoss.SubStatus == 'CLS'){
                this.onStatusUpdate()
              // }
              // else{
              //   Swal.fire(
              //     'Quotation Details Saved Successfully',
              //     'success',
              //     'success'
              //   )
              //   this.router.navigate(['./Home/Dashboard']);
              // }


          } else {
            if(this.GarageEdit.ApprovedYn!='N'){
              this.onStatusUpdate()
            }
            else{
              Swal.fire(
                'Quotation Details Saved Successfully',
                'success',
                'success'
              )
              this.router.navigate(['./Home/Dashboard']);
            }
          }

        }
        if (data.Errors) {
          this.errorService.showValidateError(data.Errors);

        }
      }, (err) => {
        this.handleError(err);
      })
    }
    else{
      this.onStatusUpdate()
    }
  }

  onStatusUpdate() {
    const dialogRef = this.dialog.open(StatusUpdateComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data:{garageId:this.GarageLoss.GarageId}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(this.logindata.UserType != 'garage' && this.garageForms.controls['claimOfficerStatus'].value == 'CA'){
          
      }
      this.router.navigate(['./Home/Dashboard'])
      //this.saveMessage(result);
    });
  }

  onUpdateStatus(event) {
    let UrlLink = null;
    if(this.logindata.InsuranceId=='100002') UrlLink = `api/updateclaimstatus`;
    else if(this.logindata.InsuranceId=='100003' || this.logindata.InsuranceId=='100008') UrlLink = `api/updateclaimstatusV1`; 
    let GarageId = '';
    let lossId = "";
    let productId = "";let insuranceId = "";
    let claimno = "";let createdBy = "";let partyNo = "";
    if(this.GarageLoss){
      partyNo =  this.GarageLoss.PartyNo;
      lossId = this.GarageLoss.LosstypeId;
      productId = this.GarageLoss.ProductId;

    }
    else if(this.LossDetails){
      partyNo =  this.LossDetails.PartyNo;
      lossId = this.LossDetails.LosstypeId;
    }
    if (this.logindata.UserType == 'garage') {
      GarageId = this.logindata.OaCode;
    }
    console.log("Garage",this.GarageLoss,"Loss Details",this.LossDetails);
    let ReqObj = {
      "ClaimNo": this.GarageLoss.ClaimNo,
      "PolicyNo": this.GarageLoss.PolicyNo,
      "InsuranceId": this.logindata.InsuranceId,
      "Status": event,
      "BranchCode": this.logindata.BranchCode,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "Remarks": '',
      "UserType": this.logindata.UserType,
      "PartyNo": partyNo,
      "Losstypeid": lossId,
      "Authcode": sessionStorage.getItem('UserToken'),
      "GarageId": GarageId
    }



    console.log(ReqObj)

    return this.lossService.onUpdateStatus(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Response == "Success") {
        Swal.fire(
          `Loss Status Updated Successfully`,
          'success'
        )
        this.router.navigate(['./Home/Dashboard']);
      }
      if (data.Errors) {
        console.log(data);
        this.errorService.showValidateError(data.Errors);

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





  back(): void {
    this.location.back()
  }

}
