import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClaimjourneyService } from 'src/app/commonmodule/claimjourney/claimjourney.service';
import { DatePipe, Location } from '@angular/common'
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { GarageService } from '../../garage/garage.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { StatusUpdateComponent } from 'src/app/shared/lossinfocomponent/status-update/status-update.component';
import { MatDialog } from '@angular/material/dialog';
import { LossService } from '../../loss/loss.service';
import { PeriodicElement } from 'src/app/shared/surveyorcomponent/surveyor-grid/surveyor-grid.component';

@Component({
  selector: 'app-pending-auth-letter',
  templateUrl: './pending-auth-letter.component.html',
  styleUrls: ['./pending-auth-letter.component.css']
})
export class PendingAuthLetterComponent implements OnInit {
  public logindata: any;
  public claimDetails: any;
  public GarageLoss: any;
  public LossDetails: any;
  public DamagePoints: any=[];
  public LossInformation:any=[];
  public GarageEdit: any;
  panelOpen:any = true;
  public PolicyInformation: any;
  private subscription = new Subscription();
  garageForms: FormGroup;
  WhoView:any='AssessorSide';
  LossTypeDes:any="";subLossTypeId:any="";
  garageSection: boolean = false;
  claimAuthForm: FormGroup;
  termsGarageList:any[]=[];
  termsPaymentList: any[]=[];
  public tableData: PeriodicElement[];
  garageAuthForm: FormGroup;surveyorForms:FormGroup;
  lossStatus: any;public columnHeader: any;
  approverListSection: boolean = false;
  selectedApprover: any;
  lossRemarks: any;
  surveyorLoginId: any;
  filename: null;
  documentDetails: any;
  documentAltDetails: any;insuranceId:any=null;
  imageUrl: any;currencyCode:any=null;
  constructor(
    private claimjourneyService: ClaimjourneyService,
    private formbuilder: FormBuilder,
    private spinner:NgxSpinnerService,
    public dialog: MatDialog,
    private location: Location,
    private garageService: GarageService,
    private errorService:ErrorService,
    private router:Router,
    private lossService: LossService,

  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.insuranceId = this.logindata?.InsuranceId;
    if(this.insuranceId=='100002'){ this.currencyCode = 'TZS'}
    else if(this.insuranceId=='100003'){ this.currencyCode = 'UGX'}
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.GarageLoss = JSON.parse(sessionStorage.getItem("GarageLossDetails"));
    this.LossDetails = JSON.parse(sessionStorage.getItem("LossDetails"));
    console.log(this.GarageLoss,this.LossDetails);
    this.lossStatus = this.GarageLoss.SubStatus;
    if(this.GarageLoss.ChassisNo){
      this.subLossTypeId = this.GarageLoss.LosstypeId;
      sessionStorage.setItem('ChassisNumber',this.GarageLoss.ChassisNo);
      sessionStorage.setItem('PolicyNumber',this.GarageLoss.PolicyNo);
    }
    if(this.LossDetails){
      this.LossTypeDes = this.LossDetails.losstypedesc;

    }
    if(this.logindata.UserType != 'surveyor' && this.logindata.UserType != 'claimofficer'){
      this.garageSection = true;
      
    }
    else{
      this.garageSection = false;
    }
    this.onGetUploadedDocuments();
   }
   onViewInfo(){
    this.panelOpen = !this.panelOpen;
  }
  getClaimPdf(status){

    let UrlLink=''
    let reqObj = {
      "claimNo": this.GarageLoss.ClaimNo,
      "policyNo": this.GarageLoss.PolicyNo,
      "lossTypeId": this.GarageLoss.LosstypeId,
      "userType": "claimofficer",
      "partyNo" : this.GarageLoss.PartyNo,
      "createdBy": this.GarageLoss.CreatedBy,

    }
    if(status == 'SLP'){
      UrlLink = "pdf/claimauthorization";

    }
    if(status == 'RG'){
      UrlLink = "pdf/releaseletter";
      reqObj['garageId']=this.GarageLoss.GarageId;
    }
    if(status == 'IVG'){
      UrlLink = "pdf/invoicegenerate";
      reqObj['userId']=this.GarageLoss.GarageId;

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
  ngOnInit(): void {
    this.subscription = this.claimjourneyService.getpolicyInfo.subscribe(async (event: any) => {
      this.PolicyInformation = event;
      if (event != null) {
      } else {
        this.claimjourneyService.onGetPolicyDetails(sessionStorage.getItem("PolicyNumber"),'byChassisNo',this.LossDetails.Claimrefno);
      }

    });
    this.onCreateFromControls();
    this.getClaimAuthDetails();
    
    this.onFetchGarageFormDetails();
  }
  onGetClaimId(event){
    console.log("Selected Event ",event);
    if(event!=null){
      this.selectedApprover = event;
    }
    else{
      this.selectedApprover = undefined;
    }
  }
  onAllotedToApprover(){
    if(this.selectedApprover){

        let ReqObj = {
          "ClaimNo": this.GarageLoss.ClaimNo,
          "InsuranceId": this.GarageLoss.InsuranceId,
          "CreatedBy":this.logindata.LoginId,
          "UserType":this.logindata.UserType,
          "Partyno":this.GarageLoss.PartyNo,
          "Losstypeid":this.GarageLoss.LosstypeId,
          "Approver": this.selectedApprover
          }
          let UrlLink = "api/allocateapprover";
          return this.garageService.onFetchGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {

            console.log("Allot Response",data);
            if(data.Response == 'Success'){
              Swal.fire(
                'Approver Alloted Successfully',
                'success',
              )
              this.onStatusUpdate();
            }
          }, (err) => {

            this.handleError(err);
          })
    }
  }
  onCreateFromControls() {
    this.garageForms = this.formbuilder.group({
      YoungAgeDriver: [{ value: 0, disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      SparePartsCost: [{ value: 0, disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      Consumables: [{ value: 0, disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      TotalLabourHours: [{ value: 0, disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      LabourCostPerHour: [{ value: 0, disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      LabourCost: [{ value: 0, disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      LessBetterment: [{ value: 0, disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      LessExcess: [{ value: 0, disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      UnderInsurance: [{ value: 0, disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      SalvageAmount: [{ value: 0, disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      GarageStatus: [{ value: 'Y', disabled: this.checkGarageDisable() }, [Validators.required]],
      ExpectedStartsDate: [{ value: '', disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      NoOfDays: [{ value: 0, disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      GarageRemarks: [{ value: '', disabled: this.checkGarageDisable() }, [Validators.required, Validators.maxLength(50)]],
      UploadQuotation: [{ value: '', disabled: this.checkGarageDisable() },],
      claimOfficerStatus: [{ value: '', disabled: this.checkClaimDisable() }, [Validators.required,]],
      claimOfficerRemarks: [{ value: '', disabled: this.checkClaimDisable() }, [Validators.required,]],
    });
    this.claimAuthForm = this.formbuilder.group({
      "AssessedLossAmount" : [ 0, [Validators.required, Validators.maxLength(50)]],
      "AssessedPayYn" : ['Y' , [Validators.required, Validators.maxLength(50)]],
      "Lessbetterment" : [0, [Validators.required, Validators.maxLength(50)]],
      "LessBettermentPayYn" : ['Y', [Validators.required, Validators.maxLength(50)]],
      "LessExcess" : [ 0, [Validators.required, Validators.maxLength(50)]],
      "LessExcessPayYn" : ['Y', [Validators.required, Validators.maxLength(50)]],
      "LessYoung" : [0, [Validators.required, Validators.maxLength(50)]],
      "SalvageAmount" : [ 0, [Validators.required, Validators.maxLength(50)]],
      "LessYoungPayYn" : ['Y', [Validators.required, Validators.maxLength(50)]],
      "UnderInsurance" : [0, [Validators.required, Validators.maxLength(50)]],
      "UnderInsurancePayYn" : ['Y', [Validators.required, Validators.maxLength(50)]],
      "NetAmount" : [ 0 , [Validators.required, Validators.maxLength(50)]],
      "PrincipleAmount" : [ 0, [Validators.required, Validators.maxLength(50)]],
      "AdvanceAmount" : [0, [Validators.required, Validators.maxLength(50)]],
      "Variation" : [0, [Validators.required, Validators.maxLength(50)]],
      "VatYn": ["N", [Validators.required, Validators.maxLength(50)]],
      "VATAmount": [0, [Validators.required, Validators.maxLength(50)]],
    });
    this.garageAuthForm = this.formbuilder.group({
        "Assessedpartsnet" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Depreciation" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Discountnet" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Labour" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Miscallaneousparts" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Netdiscount" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Netofdepreciation" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Netofdiscount" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Possibleusedparts" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Problesuspectpartsnondep" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Problesusprctpartsdep" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Scrapvalueofmetalpart" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "SalvageAmount" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "Suspectedparts" : [ 0, [Validators.required, Validators.maxLength(50)]],
        "DiscountAmt": [ 0, [Validators.required, Validators.maxLength(50)]]
    }); 
    this.surveyorForms = this.formbuilder.group({
      YoungAgeDriver: [{ value: 0, disabled: this.checkSurveyorDisable() }, [Validators.required, Validators.maxLength(50)]],
      SparePartsCost: [{ value: 0, disabled: this.checkSurveyorDisable() }, [Validators.required, Validators.maxLength(50)]],
      Consumables: [{ value: 0, disabled: this.checkSurveyorDisable() }, [Validators.required, Validators.maxLength(50)]],
      TotalLabourHours: [{ value: 0, disabled: this.checkSurveyorDisable() }, [Validators.required, Validators.maxLength(50)]],
      LabourCostPerHour: [{ value: 0, disabled: this.checkSurveyorDisable() }, [Validators.required, Validators.maxLength(50)]],
      LabourCost: [{ value: 0, disabled: this.checkSurveyorDisable() }, [Validators.required, Validators.maxLength(50)]],
      LessBetterment: [{ value: 0, disabled: this.checkSurveyorDisable() }, [Validators.required, Validators.maxLength(50)]],
      LessExcess: [{ value: 0, disabled: this.checkSurveyorDisable() }, [Validators.required, Validators.maxLength(50)]],
      UnderInsurance: [{ value: 0, disabled: this.checkSurveyorDisable() }, [Validators.required, Validators.maxLength(50)]],
      SalvageAmount: [{ value: 0, disabled: this.checkSurveyorDisable() }, [Validators.required, Validators.maxLength(50)]],
      GarageStatus: [{ value: '', disabled: this.checkSurveyorDisable() }, [Validators.required]],
      ExpectedStartsDate: [{ value: '', disabled: this.checkSurveyorDisable() }, [ Validators.maxLength(50)]],
      NoOfDays: [{ value: 0, disabled: this.checkSurveyorDisable() }, [ Validators.maxLength(50)]],
      GarageRemarks: [{ value: '', disabled: this.checkSurveyorDisable() }, [Validators.required, Validators.maxLength(50)]],
      UploadQuotation: [{ value: '', disabled: this.checkSurveyorDisable() },],
      claimOfficerStatus: [{ value: '', disabled: this.checkSurveyorDisable() }, [Validators.required,]],
      claimOfficerRemarks: [{ value: '', disabled: this.checkSurveyorDisable() }, [Validators.required,]],
    })
  }
  setTotalAmount(){
   
    let totalValue = (this.ConvertToInt(this.claimAuthForm.controls['AssessedLossAmount'].value) 
    + this.ConvertToInt(this.claimAuthForm.controls['LessYoung'].value)) 
    - (this.ConvertToInt(this.claimAuthForm.controls['SalvageAmount'].value)+this.ConvertToInt(this.claimAuthForm.controls['Lessbetterment'].value) + this.ConvertToInt(this.claimAuthForm.controls['LessExcess'].value) + this.ConvertToInt(this.claimAuthForm.controls['UnderInsurance'].value))
    
    
    this.claimAuthForm.controls['NetAmount'].setValue(totalValue);
    console.log("Assessesd Loss",this.ConvertToInt(this.claimAuthForm.controls['AssessedLossAmount'].value),
    this.ConvertToInt(this.claimAuthForm.controls['LessYoung'].value),
    this.ConvertToInt(this.claimAuthForm.controls['SalvageAmount'].value),
    this.ConvertToInt(this.claimAuthForm.controls['Lessbetterment'].value),
    this.ConvertToInt(this.claimAuthForm.controls['LessExcess'].value),
    this.ConvertToInt(this.claimAuthForm.controls['UnderInsurance'].value))
    this.setVatValue(this.claimAuthForm.controls['VatYn'].value);
  }
  onCalculateValue(){

    let UrlLink = "api/lossnetdepcalculation";
    let ReqObj = {
      "Discountnet": this.garageAuthForm.controls['Discountnet'].value,
      "Problesusprctpartsdep": this.garageAuthForm.controls['Problesusprctpartsdep'].value,
      "Problesuspectpartsnondep": this.garageAuthForm.controls['Problesuspectpartsnondep'].value,
      "Depreciation": this.garageAuthForm.controls['Depreciation'].value,
      "Assessedpartsnet": this.garageAuthForm.controls['Assessedpartsnet'].value,
      "Labour": this.garageAuthForm.controls['Labour'].value,
    }
    return this.garageService.onFetchGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {

      if(data.Errors){
        this.errorService.showValidateError(data.Errors);
      }
      else{
        this.garageAuthForm.controls['Netofdepreciation'].setValue(data.Netofdepreciation);
        this.garageAuthForm.controls['Netofdiscount'].setValue(data.Netofdiscount);
        //this.garageAuthForm.controls['NonDepNetdiscount'].setValue(data.NonDepNetdiscount);
        this.garageAuthForm.controls['DiscountAmt'].setValue(data.DiscountAmt);
      }
    }, (err) => {

      this.handleError(err);
    })
  }
  onFetchGarageFormDetails() {


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
      data['LosstypeId'] = this.GarageLoss.LosstypeId;
      data['LossStatus'] = this.GarageLoss.SubStatus;
      this.GarageEdit = data;
      if (this.GarageEdit) {
        this.surveyorForms.controls['GarageStatus'].setValue(this.GarageEdit.ApprovedYn == ''?'Y':this.GarageEdit.ApprovedYn);
        //if(this.GarageEdit.SubStatus == 'QAFG' || this.GarageEdit.SubStatus == 'QS' || this.GarageEdit.SubStatus == 'SA' ){
          this.surveyorForms.controls['GarageStatus'].setValue('Y');
          this.surveyorForms.controls['YoungAgeDriver'].setValue(this.GarageEdit.YoungAgeDriver);
          this.surveyorForms.controls['SparePartsCost'].setValue(this.GarageEdit.SparepartsCost);
          this.surveyorForms.controls['Consumables'].setValue(this.GarageEdit.ConsumablesCost);
          this.surveyorForms.controls['TotalLabourHours'].setValue(this.GarageEdit.TotalLabourHour);
          this.surveyorForms.controls['LabourCostPerHour'].setValue(this.GarageEdit.PerHourLabourCost);
          this.surveyorForms.controls['LabourCost'].setValue(this.GarageEdit.LabourCost);
          this.surveyorForms.controls['LessBetterment'].setValue(0);
          this.surveyorForms.controls['LessExcess'].setValue(0);
          this.surveyorForms.controls['UnderInsurance'].setValue(0);
          this.surveyorForms.controls['SalvageAmount'].setValue(this.GarageEdit.SalvageAmount);
          console.log("Change",this.surveyorForms.value);
          if(this.GarageEdit.ApproverName != null && this.GarageEdit.ApproverName != ""){
            this.selectedApprover = this.GarageEdit.ApproverName;
          }
        //}
        this.surveyorForms.controls['ExpectedStartsDate'].setValue(this.GarageEdit.ExpectedStartdate == null ? '' : this.onDateFormatInEdit(this.GarageEdit.ExpectedStartdate));
        this.surveyorForms.controls['NoOfDays'].setValue(this.GarageEdit.Noofdays);
        this.surveyorForms.controls['GarageRemarks'].setValue(this.GarageEdit.GarageRemarks);
        this.surveyorForms.controls['UploadQuotation'].setValue(this.GarageEdit.Uploadquatationyn)
        if(this.GarageEdit.AllotedYn){
          this.surveyorForms.controls['claimOfficerStatus'].setValue(this.GarageEdit.AllotedYn);
        }
        else{
          this.surveyorForms.controls['claimOfficerStatus'].setValue('');
        }
        this.surveyorForms.controls['claimOfficerRemarks'].setValue(this.GarageEdit.ClaimofficerRemarks);
        this.DamagePoints = this.GarageEdit.VehpartsId == null ?[]:this.GarageEdit.VehpartsId;
        console.log(this.DamagePoints)
      }

    }, (err) => {
      this.handleError(err);
    })
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
      "UserType": "surveyor",
      "LosstypeId": this.GarageLoss.LosstypeId
    }
    console.log("FinalReq", ReqObj);
    let UrlLink = "api/claimlossdetailsbyid";
    return this.garageService.onFetchGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {

      console.log("Edit Res", data);
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
      "ChassisNo": this.GarageLoss.ChassisNo,
      "ClaimNo": this.GarageLoss.ClaimNo,
      "GarageId": this.GarageLoss.GarageId,
      "InsuranceId": this.GarageLoss.InsuranceId,
      "PolicyNo": this.GarageLoss.PolicyNo,
      "ProductId": this.GarageLoss.ProductId,
      "RegionCode": this.GarageLoss.RegionCode == null ? this.LossDetails.RegionCode : this.GarageLoss.RegionCode,
      "BranchCode": this.GarageLoss.BranchCode,
      "CreatedBy": this.surveyorLoginId,
      "PartyNo": this.GarageLoss.PartyNo,
      "UserType": "surveyor",
      "LosstypeId": this.GarageLoss.LosstypeId
    }
    console.log("FinalReq", ReqObj);
    let UrlLink = "api/claimlossdetailsbyid";
    return this.garageService.onFetchGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {
      this.GarageEdit = data;
      if (this.GarageEdit) {
        if(this.GarageEdit.ApproverName != null && this.GarageEdit.ApproverName != ""){
          this.selectedApprover = this.GarageEdit.ApproverName;
        }
        sessionStorage.setItem("garageAuthData",JSON.stringify(this.GarageEdit));
        this.garageForms.controls['SparePartsCost'].setValue(this.GarageEdit.SparepartsCost);
         this.garageForms.controls['YoungAgeDriver'].setValue(this.GarageEdit.YoungAgeDriver);
        this.garageForms.controls['Consumables'].setValue(this.GarageEdit.ConsumablesCost);
        this.garageForms.controls['TotalLabourHours'].setValue(this.GarageEdit.TotalLabourHour);
        this.garageForms.controls['LabourCostPerHour'].setValue(this.GarageEdit.PerHourLabourCost);
        this.garageForms.controls['LabourCost'].setValue(this.GarageEdit.LabourCost);
        this.garageForms.controls['LessBetterment'].setValue(this.GarageEdit.LessBetterment);
        this.garageForms.controls['LessExcess'].setValue(this.GarageEdit.LessExcess);
        this.garageForms.controls['UnderInsurance'].setValue(this.GarageEdit.UnderInsurance);
        this.garageForms.controls['SalvageAmount'].setValue(this.GarageEdit.SalvageAmount);
        this.garageForms.controls['GarageStatus'].setValue(this.GarageEdit.ApprovedYn == 'N'?'Y':this.GarageEdit.ApprovedYn);
        this.garageForms.controls['ExpectedStartsDate'].setValue(this.GarageEdit.ExpectedStartdate == null ? '' : this.onDateFormatInEdit(this.GarageEdit.ExpectedStartdate));
        this.garageForms.controls['NoOfDays'].setValue(this.GarageEdit.Noofdays);
        this.garageForms.controls['GarageRemarks'].setValue(this.GarageEdit.GarageRemarks);
        // this.garageForms.controls['UploadQuotation'].setValue(this.GarageEdit.Uploadquatationyn)
        this.garageForms.controls['claimOfficerStatus'].setValue(this.GarageEdit.ApprovedYn == 'Y' ? 'CA' : 'CR');
        this.garageForms.controls['claimOfficerRemarks'].setValue(this.GarageEdit.ClaimofficerRemarks);
        this.lossRemarks = this.GarageEdit.LastRemarks;
        this.DamagePoints = this.GarageEdit.VehpartsId == null ?[]:this.GarageEdit.VehpartsId;
        
        if(this.claimAuthForm.controls['AssessedLossAmount'].value==null || 
        this.claimAuthForm.controls['AssessedLossAmount'].value==undefined || this.claimAuthForm.controls['AssessedLossAmount'].value==''){
          let totalValue = Number(this.GarageEdit.SparepartsCost)
                      +Number(this.GarageEdit.ConsumablesCost)+Number(this.GarageEdit.LabourCost);
          this.claimAuthForm.controls['AssessedLossAmount'].setValue(totalValue);
          this.claimAuthForm.controls['Lessbetterment'].setValue(this.GarageEdit.LessBetterment);
          this.claimAuthForm.controls['LessExcess'].setValue(this.GarageEdit.LessExcess);
          this.claimAuthForm.controls['LessYoung'].setValue(this.GarageEdit.YoungAgeDriver);
          this.claimAuthForm.controls['UnderInsurance'].setValue(this.GarageEdit.UnderInsurance);
          this.claimAuthForm.controls['SalvageAmount'].setValue(this.GarageEdit.SalvageAmount);
          this.setTotalAmount();
        }
        
        //this.claimAuthForm.controls['NetAmount'].setValue(data.NetAmount);
       
        this.LossInformation = this.GarageLoss;
      }
    
    }, (err) => {
      this.handleError(err);
    })
  }
  getClaimAuthDetails(){
    let userType = "";
    if(this.logindata.UserType != 'claimofficer'){
      userType = this.logindata.UserType;
    }
    else{
      userType = 'claimofficer';
    }
    let ReqObj = {
      "ClaimNo": this.GarageLoss.ClaimNo,
      "Policyno": this.GarageLoss.PolicyNo,
      "Partyno": this.GarageLoss.PartyNo,
      "CreatedBy": this.GarageLoss.CreatedBy,
      "UserType": userType,
      "Losstypeid": this.GarageLoss.LosstypeId,
      "InsuranceId": this.logindata.InsuranceId
    }
    let UrlLink = "api/getclaimlpodetails";
    return this.garageService.onFetchGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {

      console.log("Claim Loss Details Req", ReqObj);
      console.log("Claim Loss Details Res", data);
      if(data){
        this.claimAuthForm.controls['AssessedLossAmount'].setValue(data.AssessedLossAmount);
        this.claimAuthForm.controls['AssessedPayYn'].setValue(data.AssessedPayYn);
        this.claimAuthForm.controls['Lessbetterment'].setValue(data.Lessbetterment);
        this.claimAuthForm.controls['LessBettermentPayYn'].setValue(data.LessBettermentPayYn);
        this.claimAuthForm.controls['LessExcess'].setValue(data.LessExcess);
        this.claimAuthForm.controls['LessExcessPayYn'].setValue(data.LessExcessPayYn);
        this.claimAuthForm.controls['LessYoung'].setValue(data.YoungAgeDriver);
        this.claimAuthForm.controls['LessYoungPayYn'].setValue(data.LessYoungPayYn);
        this.claimAuthForm.controls['UnderInsurance'].setValue(data.UnderInsurance);
        this.claimAuthForm.controls['UnderInsurancePayYn'].setValue(data.UnderInsurancePayYn);
        this.claimAuthForm.controls['NetAmount'].setValue(data.NetAmount);
        this.claimAuthForm.controls['PrincipleAmount'].setValue(data.PrincipleAmount);
        this.claimAuthForm.controls['AdvanceAmount'].setValue(data.AdvanceAmount);
        this.claimAuthForm.controls['Variation'].setValue(data.Variation);
        this.claimAuthForm.controls['VatYn'].setValue(data.VatYn);
        this.claimAuthForm.controls['SalvageAmount'].setValue(data.SalvageAmount);
        this.setTotalAmount();
      }
      this.onFetchGarageDetails();
      this.getGarageTermsList();
    }, (err) => {
      this.handleError(err);
    })
  }
  getGarageTermsList(){
    let userType = "";
    let UrlLink = "";
    let ReqObj:any;
    if((this.logindata.UserType == 'claimofficer' || this.logindata.UserType == 'surveyor')  && this.GarageLoss.SubStatus != 'SLPR'){
      userType = this.logindata.UserType;
      UrlLink = "api/claimcondmasterbyusertypeone";
      ReqObj = {
        "Inscompanyid" : this.logindata.InsuranceId,
        "Status" : "Y",
        "Usertype" : "claimofficer"
      }
    }
    else{
      ReqObj = {
        "Usertype": "claimofficer",
        "Status": "Y",
        "Createdby": this.GarageLoss.CreatedBy,
        "Partyno": this.GarageLoss.PartyNo,
        "Claimno": this.GarageLoss.ClaimNo,
        "Losstypeid": this.GarageLoss.LosstypeId,
        "Inscompanyid": this.logindata.InsuranceId,
        "paymenttype":"1"
      }
       UrlLink = `api/claimconddetailsbyuser`;
    }


    return this.garageService.onFetchGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {

      console.log("Garage Terms Details Res", data);
      if(data){
        if(data.length!=0){
            this.setEditGarageTerms(data);
        }
        else{
          this.addGarageRow();
        }
      }
      this.getPaymentTermsList();
      //this.getGarageTermsList();
    }, (err) => {
      this.handleError(err);
    })
  }
  onQuotationDocuments(event) {
    if(this.logindata.UserType=='garage'){
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
              "DocTypeId": "132",
              "FilePathName": "",
              "Description": "Garage Invoice",
              "ProductId": productId,
              "FileName": filename,
              "OpRemarks": "",
              "UploadType": "CLAIM-GARAGE",
              "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
              "DocId": "132",
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
   
  }
onGetUploadedDocuments(){
  let partyNo="",lossId="",insuranceId="",productId="",claimno="";
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
  let ReqObj = {
    "Claimno": claimno,
    "PartyNo": partyNo,
    "LossId": lossId,
    "Accimage": 'N',
    "Insid":this.logindata.InsuranceId,
    "CreatedBy": [this.GarageLoss.CreatedBy],
    "LoginId":this.logindata.LoginId
  }
  let UrlLink = `getdoclist`;
  return this.lossService.onGetUploadedDocuments(UrlLink, ReqObj).subscribe((data: any) => {
    console.log("Uploaded Document Req",ReqObj);
    let LossDocumentFile = data.filter((ele: any) => ele.documentId == "132");
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
  addGarageRow(){
      let entry = {
        "Sno":this.termsGarageList.length+1,
        "Claimno": this.GarageLoss.ClaimNo,
        "Partyno": this.GarageLoss.PartyNo,
        "Losstypeid": this.GarageLoss.LosstypeId,
        "Usertype": this.logindata.UserType,
        "Createdby": this.logindata.LoginId,
        "Termsdesc": "",
        "Status": "Y",
        "Remarks": "",
        "paymenttype":"1",
        "Inscompanyid": this.logindata.InsuranceId,
        "checked": 'Y'
      }
      this.termsGarageList.push(entry);
  }
  setEditGarageTerms(termsList){
    for(let entry of termsList){
      let row = {
        "Sno":entry.Sno,
        "Claimno": this.GarageLoss.ClaimNo,
        "Partyno": this.GarageLoss.PartyNo,
        "Losstypeid": this.GarageLoss.LosstypeId,
        "Usertype": this.logindata.UserType,
        "Createdby": this.logindata.LoginId,
        "Termsdesc": entry.Termsdesc,
        "Status": "Y",
        "Remarks": "",
        "paymenttype":"1",
        "Inscompanyid": this.logindata.InsuranceId,
        "checked": 'Y'
      }
      this.termsGarageList.push(row);
    }
  }
  getPaymentTermsList(){
    let userType = "";
    let UrlLink = "";
    let ReqObj:any;
    if(this.logindata.UserType != 'claimofficer' && this.GarageLoss.SubStatus != 'SLPR'){
      userType = this.logindata.UserType;
      UrlLink = "api/claimcondmasterbyusertypetwo";
      ReqObj = {
        "Inscompanyid" : this.logindata.InsuranceId,
        "Status" : "Y",
        "Usertype" : "claimofficer"
      }
    }
    else{
      ReqObj = {
        "Usertype": "claimofficer",
        "Status": "Y",
        "Createdby": this.GarageLoss.CreatedBy,
        "Partyno": this.GarageLoss.PartyNo,
        "Claimno": this.GarageLoss.ClaimNo,
        "Losstypeid": this.GarageLoss.LosstypeId,
        "Inscompanyid": this.logindata.InsuranceId,
        "paymenttype":"2"
      }
       UrlLink = `api/claimconddetailsbyuser`;
    }
    return this.garageService.onFetchGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {

      console.log("Payment Terms Details Res", data);
      if(data){
        if(data.length!=0){
            this.setEditPaymentTerms(data);
        }
        else{
          this.addPaymentRow();
        }
      }
      this.getGarageFormEdit();
    }, (err) => {
      this.handleError(err);
    })
  }
  addPaymentRow(){
    let entry = {
      "Sno":this.termsGarageList.length+1,
      "Claimno": this.GarageLoss.ClaimNo,
      "Partyno": this.GarageLoss.PartyNo,
      "Losstypeid": this.GarageLoss.LosstypeId,
      "Usertype": this.logindata.UserType,
      "Createdby": this.logindata.LoginId,
      "Termsdesc": "",
      "Status": "Y",
      "Remarks": "",
      "paymenttype":"2",
      "Inscompanyid": this.logindata.InsuranceId,
      "checked": 'Y'
    }
    this.termsPaymentList.push(entry);
  }
  setEditPaymentTerms(termsList){
    for(let entry of termsList){
      let row = {
        "Sno":entry.Sno,
        "Claimno": this.GarageLoss.ClaimNo,
        "Partyno": this.GarageLoss.PartyNo,
        "Losstypeid": this.GarageLoss.LosstypeId,
        "Usertype": this.logindata.UserType,
        "Createdby": this.logindata.LoginId,
        "Termsdesc": entry.Termsdesc,
        "Status": "Y",
        "Remarks": "",
        "paymenttype":"2",
        "Inscompanyid": this.logindata.InsuranceId,
        "checked": 'Y'
      }
      this.termsPaymentList.push(row);
    }
  }
  getGarageFormEdit(){
    let garageReq:any;
    if(this.logindata.UserType != 'surveyor' && this.logindata.UserType != 'garage'){
      garageReq = {
        "Claimno": this.GarageLoss.ClaimNo,
        "Createdby": this.GarageLoss.GarageLoginId,
        "Partyno": this.GarageLoss.PartyNo,
        "Inscompanyid": this.logindata.InsuranceId,
        "Losstypeid": this.GarageLoss.LosstypeId
      }
    }
    else{
      garageReq = {
        "Claimno": this.GarageLoss.ClaimNo,
        "Createdby": this.logindata.LoginId,
        "Partyno": this.GarageLoss.PartyNo,
        "Inscompanyid": this.logindata.InsuranceId,
        "Losstypeid": this.GarageLoss.LosstypeId
      }
    }
    let UrlLink = "api/claimlpodetailsgarageid";
    return this.garageService.onFetchGarageDetails(UrlLink, garageReq).subscribe((data: any) => {

      console.log("Get Garage Form Edit", garageReq,data);
        if(data){
          this.garageAuthForm.controls['Assessedpartsnet'].setValue(data.Assessedpartsnet);
          this.garageAuthForm.controls['Depreciation'].setValue(data.Depreciation);
          this.garageAuthForm.controls['Discountnet'].setValue(data.Discountnet);
          this.garageAuthForm.controls['Labour'].setValue(data.Labour);
          this.garageAuthForm.controls['Miscallaneousparts'].setValue(data.Miscallaneousparts);
          this.garageAuthForm.controls['Netdiscount'].setValue(data.Netdiscount);
          this.garageAuthForm.controls['Netofdepreciation'].setValue(data.Netofdepreciation);
          this.garageAuthForm.controls['Netofdiscount'].setValue(data.Netofdiscount);
          this.garageAuthForm.controls['Possibleusedparts'].setValue(data.Possibleusedparts);
          this.garageAuthForm.controls['Problesuspectpartsnondep'].setValue(data.Problesuspectpartsnondep);
          this.garageAuthForm.controls['Problesusprctpartsdep'].setValue(data.Problesusprctpartsdep);
          this.garageAuthForm.controls['Scrapvalueofmetalpart'].setValue(data.Scrapvalueofmetalpart);
          this.garageAuthForm.controls['Suspectedparts'].setValue(data.Suspectedparts);
        }
        if(this.GarageEdit){
          // if(this.lossStatus == 'SLPR' && this.logindata.UserType == 'surveyor'){
          //     this.approverListSection = true;
          //     this.getApproverList();
          // }
        }

      }, (err) => {
        this.handleError(err);
      })
  }
  setVatValue(event){
    console.log("Vat Event",event);
    if(event == 'Y'){
      let netAmount = Number(this.claimAuthForm.controls['NetAmount'].value)
      this.claimAuthForm.controls['VATAmount'].setValue(((netAmount/100)*18))
      this.claimAuthForm.controls['PrincipleAmount'].setValue(((netAmount/100)*18)+netAmount)
    }
    else{
      let netAmount = Number(this.claimAuthForm.controls['NetAmount'].value)
      this.claimAuthForm.controls['VATAmount'].setValue(((netAmount/100)*18))
      this.claimAuthForm.controls['PrincipleAmount'].setValue(netAmount);
    }
  }
  getApproverList(){
    let ReqObj = {
      "ClaimNo": this.GarageLoss.ClaimNo,
      "LosstypeId": this.GarageLoss.LosstypeId,
      "PartyNo": this.GarageLoss.PartyNo,
      "InsuranceId":this.logindata.InsuranceId,
      "UserType":this.logindata.UserType
    }
    let UrlLink = "api/approverlist";
    return this.garageService.onFetchGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {
      this.columnHeader = {
        'checkboxs': 'SELECTCLAIM',
        'Loginid': 'CLAIM ID',
        'Usermail': 'EMAIL',
        'Subusertype': 'SUBUSERTYPE'
      };
      this.tableData = data;
      }, (err) => {
        this.handleError(err);
      })
  }
  finalProceed(){
    if(this.logindata.UserType == 'surveyor' || this.logindata.UserType == 'claimofficer'){
      if(this.lossStatus == 'SLP' || this.lossStatus == 'QS' || this.lossStatus == 'CFA' || this.lossStatus == 'RC' || this.lossStatus == 'SLF' || this.lossStatus == 'RG' || this.lossStatus == 'CIRFP'|| this.lossStatus == 'IVG' ){
        this.submitClaimAuthDetails();
      }
      else{
        this.submitGarageForm();
        //this.onStatusUpdate();
      }
    }
    else{
      this.onStatusUpdate();
    }
  }
  setVariation(){
    let advance = this.claimAuthForm.controls['AdvanceAmount'].value;
    if(advance != "" && advance != '0' && advance != 0 && advance != undefined){
        let variation = 100 - advance;
        this.claimAuthForm.controls['Variation'].setValue(variation);
    }
    else{
      this.claimAuthForm.controls['Variation'].setValue('0');
    }
  }
  submitClaimAuthDetails(){
    let ReqObj = {
      "ClaimNo": this.GarageLoss.ClaimNo,
      "Policyno": this.GarageLoss.PolicyNo,
      "Partyno": this.GarageLoss.PartyNo,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "Losstypeid":this.GarageLoss.LosstypeId,
      "InsuranceId": this.logindata.InsuranceId,
      "Remarks": "",
      "YoungAgeDriver": this.claimAuthForm.controls['LessYoung'].value,
      "SalvageAmount": this.claimAuthForm.controls['SalvageAmount'].value,
      "AssessedLossAmount":this.claimAuthForm.controls['AssessedLossAmount'].value,
      "AssessedPayYn":this.claimAuthForm.controls['AssessedPayYn'].value,
      "Lessbetterment":this.claimAuthForm.controls['Lessbetterment'].value,
      "LessBettermentPayYn":this.claimAuthForm.controls['LessBettermentPayYn'].value,
      "LessExcess":this.claimAuthForm.controls['LessExcess'].value,
      "LessExcessPayYn":this.claimAuthForm.controls['LessExcessPayYn'].value,
      "LessYoung":this.claimAuthForm.controls['LessYoung'].value,
      "LessYoungPayYn":this.claimAuthForm.controls['LessYoungPayYn'].value,
      "UnderInsurance":this.claimAuthForm.controls['UnderInsurance'].value,
      "UnderInsurancePayYn":this.claimAuthForm.controls['UnderInsurancePayYn'].value,
      "NetAmount":this.claimAuthForm.controls['NetAmount'].value,
      "PrincipleAmount":this.claimAuthForm.controls['PrincipleAmount'].value,
      "AdvanceAmount":this.claimAuthForm.controls['AdvanceAmount'].value,
      "Variation":this.claimAuthForm.controls['Variation'].value,
      "VatYn":this.claimAuthForm.controls['VatYn'].value
    }
    let UrlLink = "api/insertclaimlpodetails";
    return this.garageService.onFetchGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {

      console.log("Claim Loss Details Submit Res", data);
      if(data.Errors){
        this.errorService.showValidateError(data.Errors);
      }
      else{
        this.submitGarageTerms();
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  submitGarageTerms(){
    let termList = [];
    for (let index = 0; index < this.termsGarageList.length; index++) {
      const element = this.termsGarageList[index];
      if(element.checked == 'Y'){
        delete element['checked'];
        termList.push(element);
      }
      if(index == this.termsGarageList.length-1){
        this.submitGarageTermsConditions(termList);
      }
    }
  }
  submitGarageTermsConditions(termList){
    let UrlLink = "api/insertclaimconddetails";
    return this.garageService.onFetchGarageDetails(UrlLink, termList).subscribe((data: any) => {

      console.log("Garage Terms Save Req",termList);
      console.log("Garage Terms Save Res", data);
      if(data.Errors){
        this.errorService.showValidateError(data.Errors);
      }
      else{
        this.submitPaymentTerms();
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  submitPaymentTerms(){
    let termList = [];
    for (let index = 0; index < this.termsPaymentList.length; index++) {
      const element = this.termsPaymentList[index];
      if(element.checked == 'Y'){
         delete element['checked'];
        termList.push(element);
      }
      if(index == this.termsPaymentList.length-1){
        this.submitPaymentTermsConditions(termList);
      }
    }

  }
  submitGarageForm(){
    let ReqObj = {
      "Assessedpartsnet": this.garageAuthForm.controls['Assessedpartsnet'].value,
      "Claimno": this.GarageLoss.ClaimNo,
      "Createdby": this.logindata.LoginId,
      "Depreciation": this.garageAuthForm.controls['Depreciation'].value,
      "Discountnet": this.garageAuthForm.controls['Discountnet'].value,
      "Inscompanyid": this.logindata.InsuranceId,
      "Labour": this.garageAuthForm.controls['Labour'].value,
      "Losstypeid": this.GarageLoss.LosstypeId,
      "Miscallaneousparts": this.garageAuthForm.controls['Miscallaneousparts'].value,
      "Netdiscount": this.garageAuthForm.controls['Netdiscount'].value,
      "Netofdepreciation": this.garageAuthForm.controls['Netofdepreciation'].value,
      "Netofdiscount": this.garageAuthForm.controls['Netofdiscount'].value,
      "Partyno": this.GarageLoss.PartyNo,
      "Possibleusedparts": this.garageAuthForm.controls['Possibleusedparts'].value,
      "Problesuspectpartsnondep": this.garageAuthForm.controls['Problesuspectpartsnondep'].value,
      "Problesusprctpartsdep": this.garageAuthForm.controls['Problesusprctpartsdep'].value,
      "Scrapvalueofmetalpart": this.garageAuthForm.controls['Scrapvalueofmetalpart'].value,
      "Suspectedparts": this.garageAuthForm.controls['Suspectedparts'].value
    }
    let UrlLink = "api/insertclaimlpodetailsgarage";
    return this.garageService.onFetchGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {

      console.log("Claim Loss Details Submit Res", data);
      if(data.Errors){
        this.errorService.showValidateError(data.Errors);
      }
      else{
        this.onStatusUpdate();
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  onGarageTermsSelect(event,rowData){
    if(event.checked){
        let Exist = this.termsGarageList.findIndex((ele:any)=>ele.Sno == rowData.Sno);
        this.termsGarageList[Exist].checked = 'Y';
    }
    else{
      let Exist = this.termsGarageList.findIndex((ele:any)=>ele.Sno == rowData.Sno);
      this.termsGarageList[Exist].checked = 'N';
    }
  }
  onPaymentTermsSelect(event,rowData){
    if(event.checked){
        let Exist = this.termsPaymentList.findIndex((ele:any)=>ele.Sno == rowData.Sno);
        this.termsPaymentList[Exist].checked = 'Y';
    }
    else{
      let Exist = this.termsPaymentList.findIndex((ele:any)=>ele.Sno == rowData.Sno);
      this.termsPaymentList[Exist].checked = 'N';
    }
  }
  onStatusUpdate() {
    const dialogRef = this.dialog.open(StatusUpdateComponent, {
      width: '100%',
      panelClass: 'full-screen-modal'
    });
    dialogRef.afterClosed().subscribe(result => {
      sessionStorage.removeItem("garageAuthData")
      this.router.navigate(['./Home/Dashboard']);
      //this.saveMessage(result);
    });
  }
  submitPaymentTermsConditions(termList){
    let UrlLink = "api/insertclaimconddetails";
    return this.garageService.onFetchGarageDetails(UrlLink, termList).subscribe((data: any) => {

      console.log("Payment Terms Save Req",this.termsPaymentList);
      console.log("Payment Terms Save Res", data);
      if(data.Errors){
        this.errorService.showValidateError(data.Errors);
      }
      else{
        this.onStatusUpdate();
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  checkClaimDisable() {
    return this.logindata.UserType != 'claimofficer';
  }
  checkGarageDisable() {
    return this.logindata.UserType != 'surveyor';
  }
  checkSurveyorDisable() {
    return (this.logindata.UserType != 'garage' || (this.logindata.UserType == 'garage' && this.lossStatus=='AFA'));
  }
  getDamageListValues(val){
   console.log(val)
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
  back(): void {
    sessionStorage.removeItem("garageAuthData")
    this.location.back()

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
