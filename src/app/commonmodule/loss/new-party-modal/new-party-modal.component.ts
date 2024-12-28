import { NgxSpinnerService } from 'ngx-spinner';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { ClaimjourneyService } from '../../claimjourney/claimjourney.service';
import { DatePipe } from '@angular/common';

import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PartyDetailComponent } from '../components/party-detail/party-detail.component';

const moment = _moment;

@Component({
  selector: 'app-new-party-modal',
  templateUrl: './new-party-modal.component.html',
  styleUrls: ['./new-party-modal.component.css']
})
export class NewPartyModalComponent implements OnInit, OnDestroy {

  public createPartyForm: FormGroup;
  public startDate = new Date();
  public driverMaxDOB = new Date();
  public logindata: any;
  public claimDetails: any;
  public PolicyInformation: any;
  public FaultCategoryList: any = [];
  public ClaimPartyTypeList: any = [];
  public MobileCodeList: any = [];
  public AllInsurancePart: any = [];
  public Nationality:any =[]; 
  public EditPartyNo: any = '';
  public EditPartyTypeId: any = '';
  public EditPartyList: any;
  private subscription = new Subscription();
  private partyDetailComponent:PartyDetailComponent;
  constructor(
    private formBuilder: FormBuilder,
    private lossService: LossService,
    private errorService: ErrorService,
    private claimjourneyService: ClaimjourneyService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewPartyModalComponent>,
  ) {
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var day = new Date().getDate();
    this.startDate = new Date(year - 18, month, day);
    this.driverMaxDOB = new Date(year - 18, month, day);
  }

  ngOnInit(): void {
    this.onInitialFetchData();

    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));

    this.subscription = this.claimjourneyService.getpolicyInfo.subscribe(async (event: any) => {
      this.PolicyInformation = event;
      if (event == null) {
        this.claimjourneyService.onGetPolicyDetails(sessionStorage.getItem("PolicyNumber"),'byChassisNo',this.claimDetails.Claimrefno);
      }

    });

    //  this.subscription=this.lossService.getPartyRowDetails.subscribe((event:any)=>{
    //    this.EditPartyList = event;
    //    if(event != null){
    //      this.onBindPartyDetails();
    //    }

    //  });

    console.log(this.data)
    if(this.data != null){
      this.EditPartyList = this.data;
      this.onBindPartyDetails();
    }else{
      this.onResetForm();
    }




  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async onInitialFetchData() {
    this.createFromControl();

    this.FaultCategoryList = await this.getFaultCategory();
    this.ClaimPartyTypeList = await this.getClaimPartyType();
    this.MobileCodeList = await this.getMobileCodeList();
    this.Nationality =await this.getNationality();
    this.AllInsurancePart = await this.getAllInsurancePartyInfo();
    console.log('Insu', this.AllInsurancePart);

    //console.log('nn',this.Nationality)

  }

  createFromControl() {

    this.createPartyForm = this.formBuilder.group({
      FaultCategory: ['', Validators.required],
      PartyType: ['', Validators.required],
      Name: ['', Validators.required],
      Dob: ['', Validators.required],
      Email: [''],
      MobileNo: ['',Validators.compose([Validators.required])],
      MobileCode: [''],
      Remarks: [''],
      Address: [''],
      InsurancePartyId: [''],
      Nationality:['']

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

  onBindPartyDetails() {
    this.EditPartyNo = this.EditPartyList.PartyNo;
    this.EditPartyTypeId = this.EditPartyList.PartyType;
    this.createPartyForm.controls['FaultCategory'].setValue(this.EditPartyList.FaultCategoryId);
    this.createPartyForm.controls['PartyType'].setValue((this.EditPartyList.PartyTypeId));
    this.createPartyForm.controls['Name'].setValue((this.EditPartyList.PartyName));
    this.createPartyForm.controls['Dob'].setValue((this.onDateFormatInEdit(this.EditPartyList.Dob)));
    this.createPartyForm.controls['Email'].setValue((this.EditPartyList.Email));
    this.createPartyForm.controls['MobileNo'].setValue((this.EditPartyList.Mobile));
    this.createPartyForm.controls['MobileCode'].setValue((this.EditPartyList.MobileCode));
    this.createPartyForm.controls['Remarks'].setValue((this.EditPartyList.Remarks));
    this.createPartyForm.controls['Address'].setValue((this.EditPartyList.Address));
    this.createPartyForm.controls['InsurancePartyId'].setValue((this.EditPartyList.PartyInsId));
    this.createPartyForm.controls['Nationality'].setValue((this.EditPartyList.Nationality));


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
      "Policytypeid": this.PolicyInformation?.PolicyInfo?.Product,
      "CreatedBy": this.logindata.LoginId,
      "InsuranceId":this.logindata.InsuranceId
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

async getNationality() {
    let ReqObj = { 
      "Inscompanyid":this.logindata.InsuranceId
    }
    console.log(ReqObj)
    let UrlLink = `api/dropdown/nationality`;
    let response = (await this.lossService.getNationality(UrlLink, ReqObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;

  }


  async getMobileCodeList() {
    let UrlLink = `api/mobilecode`;
    let response = (await this.lossService.getMobileCodeList(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  async getAllInsurancePartyInfo() {
    let UrlLink = `api/getAllPartyInsuranceInfo`;
    let response = (await this.lossService.getAllInsurancePartyInfo(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  

  onCreateNewParty(event) {

    let ReqObj = {
      "Address": this.createPartyForm.controls['Address'].value,
      "ChassisNo": this.claimDetails.ChassisNo,
      "ClaimNo": this.claimDetails.ClaimNo,
      "Dob": this.datePipe.transform(this.createPartyForm.controls['Dob'].value, "dd/MM/yyyy"),
      "Email": this.createPartyForm.controls['Email'].value,
      "FaultCategory": this.createPartyForm.controls['FaultCategory'].value,
      "Mobile": this.createPartyForm.controls['MobileNo'].value,
      "CountryId": 91,
      "Nationality":this.createPartyForm.controls['Nationality'].value,
      "PartyName": this.createPartyForm.controls['Name'].value,
      "PartyType": this.createPartyForm.controls['PartyType'].value,
      "PolicyNo": this.claimDetails.PolicyNo,
      "PartyInsId": this.createPartyForm.controls['InsurancePartyId'].value,
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "Remarks": this.createPartyForm.controls['Remarks'].value,
      "CreatedBy": this.logindata.LoginId,
      "PartyNo": this.EditPartyNo == '' ? '' : this.EditPartyNo,
      "PartyTypeId": this.EditPartyTypeId == '' ? '' : this.EditPartyTypeId,
      "MobileCode": this.createPartyForm.controls['MobileCode'].value,
      "SaveorSubmit": event == 'submit' ? 'Submit' : 'Save',

    }
    console.log(ReqObj)

    let UrlLink = `api/newpartydetails`;
    return this.lossService.onCreateNewParty(UrlLink, ReqObj).subscribe(async (data: any) => {
      console.log(data);


      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);

      } else {
        this.onResetForm();
        this.dialogRef.close(data);
        location.reload();
        if (this.EditPartyNo != '') {

          Swal.fire(
            'Party Updated Successfully',
            "Policy No or Claim No",
            'success',
          )
        } else {
          Swal.fire(
            'Party Created Successfully',
            "Policy No or Claim No",
            'success',
          )
        }

      }

    }, (err) => {
      this.handleError(err);
    })

  }

  onResetForm() {
    console.log('clear')
    this.createPartyForm.reset();
    this.EditPartyNo = '';
    this.EditPartyTypeId = '';
  }

  handleError(error) {
    let errorMessage: any = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;

      console.log('eeeeeeee',errorMessage)
    } else {
      // server-side error
      errorMessage = { 'ErrorCode': error.status, 'Message': error.message };
      console.log('jjjjjjjj',errorMessage)
      this.errorService.showError(error, errorMessage);

    }

  }

}
