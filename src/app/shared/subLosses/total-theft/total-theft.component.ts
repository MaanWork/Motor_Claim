import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorService } from '../../services/errors/error.service';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { LossModalComponent } from 'src/app/shared/loss-modal/loss-modal.component';
import { DatePipe } from '@angular/common';
import { StatusUpdateComponent } from '../../lossinfocomponent/status-update/status-update.component';

@Component({
  selector: 'app-total-theft',
  templateUrl: './total-theft.component.html',
  styleUrls: ['./total-theft.component.css']
})
export class TotalTheftComponent implements OnInit {
  @Input() hidebtn: any;


  public logindata: any = {};
  public claimDetails: any = {};
  public createSecondaryForm: FormGroup;
  @Input() secdLossInfo: any;
  public LossTypeDes: any = '';
  public isLossEdit: any;
  public LossTypeId:any;
  public isDisabled:boolean=true;
  public empYn = 'Employee';
  public startDate = new Date();VatYN:any="N";
  @Output() public onSubmitFrom = new EventEmitter<any>();
  vatSection: boolean = false;
  totalAmount: any;
  constructor(
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private lossService: LossService,
    private spinner: NgxSpinnerService,
    private datePipe:DatePipe,
    public dialog:MatDialog,
    public dialogRef: MatDialogRef<LossModalComponent>,
  ) {
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var day = new Date().getDate();
    this.startDate = new Date(year, month, day);
  }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    if (this.logindata?.UserType == "claimofficer" && (this.secdLossInfo?.GarageYn!='N' && this.secdLossInfo?.SurveyorYn !='N')) {
      this.isDisabled=true;
    }else{
      this.isDisabled=false;
    }
    console.log(this.secdLossInfo);
    this.createFromControl();
    this.LossTypeDes = this.secdLossInfo.Losstypedescp;
    this.LossTypeId = this.secdLossInfo.LosstypeId;
    this.isLossEdit = this.secdLossInfo.LossNo;

    this.onBindSecondayLossType();
    this.onUpdateValidators();

  }

  commonReqObject() {
    return {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId":  this.logindata?.OaCode

    }
  }

  createFromControl() {
    this.createSecondaryForm = this.formBuilder.group({
      SalvageAmount: [{value:'0',disabled: this.isDisabled}],
      ExcessAmount: [{value:'0',disabled: this.isDisabled}],
      DepreciationAmount: [{value:'0',disabled: this.isDisabled}],
      Amount: [{value:'0',disabled: this.isDisabled}],
      Remarks: [{value:'None',disabled: this.isDisabled}],
      TotalPrice: [{value:'0',disabled: this.isDisabled}],
      Status: [{value:'Y',disabled: this.isDisabled}],
      UnderInsurance:[{value:'0',disabled: this.isDisabled}],
      "TheftDate":[{value:'',disabled: this.isDisabled}, Validators.required],
      "TheftTime":[{value:'12:00',disabled: this.isDisabled}, Validators.required],
      "TheftPlace":[{value:'',disabled: this.isDisabled}, Validators.required],
      "TheftStolen":[{value:'',disabled: this.isDisabled}, Validators.required],
      "TheftEstReplace":[{value:'',disabled: this.isDisabled}, Validators.required],
      "TheftDiscovredBy":[{value:'',disabled: this.isDisabled}, Validators.required],
      "TheftReportedTo":[{value:'',disabled: this.isDisabled}, Validators.required],
      "TheftReportedWhen":[{value:'',disabled: this.isDisabled}, Validators.required],
      "TheftReportedWhich":[{value:'',disabled: this.isDisabled}, Validators.required],
      "TheftCrDairyno":[{value:'',disabled: this.isDisabled}, Validators.required],
    })
  }

  onUpdateValidators(){
     }
     onDateFormatInEdit(date) {
      console.log(date);
      if (date) {
        let format = date.split('/');
        var NewDate = new Date(new Date(format[2],format[1],format[0]));
        NewDate.setMonth(NewDate.getMonth() - 1);
        return NewDate;
      }
    }
  onBindSecondayLossType() {

    this.createSecondaryForm.controls['TheftCrDairyno'].setValue(this.secdLossInfo.TheftCrDairyno);
    this.createSecondaryForm.controls['TheftDate'].setValue(this.onDateFormatInEdit(this.secdLossInfo.TheftDate));
    this.createSecondaryForm.controls['TheftDiscovredBy'].setValue(this.secdLossInfo.TheftDiscovredBy);
    this.createSecondaryForm.controls['TheftEstReplace'].setValue(this.secdLossInfo.TheftEstReplace);
    this.createSecondaryForm.controls['TheftPlace'].setValue(this.secdLossInfo.TheftPlace);
    this.createSecondaryForm.controls['TheftReportedTo'].setValue(this.secdLossInfo.TheftReportedTo);
    this.createSecondaryForm.controls['TheftReportedWhen'].setValue(this.onDateFormatInEdit(this.secdLossInfo.TheftReportedWhen));
    this.createSecondaryForm.controls['TheftReportedWhich'].setValue(this.secdLossInfo.TheftReportedWhich);
    this.createSecondaryForm.controls['TheftStolen'].setValue(this.secdLossInfo.TheftStolen);
    this.createSecondaryForm.controls['TheftTime'].setValue(this.secdLossInfo.TheftTime);
    if(this.secdLossInfo.VatYn!=null){
      this.totalAmount = this.secdLossInfo.TotalPayable;
      this.VatYN = this.secdLossInfo.VatYn;
      if(this.VatYN=='Y'){
        this.vatSection = true;
        
      }
    }
    // this.createSecondaryForm.controls['SalvageAmount'].setValue(this.secdLossInfo.SalvageAmount);
    // this.createSecondaryForm.controls['ExcessAmount'].setValue(this.secdLossInfo.LessExcess);
    // this.createSecondaryForm.controls['DepreciationAmount'].setValue(this.secdLossInfo.DepriciationAmount);
    // this.createSecondaryForm.controls['Amount'].setValue(this.secdLossInfo.TotalPrice);
    // this.createSecondaryForm.controls['Remarks'].setValue(this.secdLossInfo.Remarks)
  }

  async saveLossDetails(event: string) {
     console.log(this.createSecondaryForm.value);
    if (this.createSecondaryForm.invalid) {
      Swal.fire(
        `Please Fill All Required Fields`,
        'info'
      )
    } else {


      let ReqObj = {
        "ChassisNo": this.claimDetails.ChassisNo,
        "ClaimNo": this.claimDetails.ClaimNo,
        "PolicyNo": this.claimDetails.PolicyNo,
        "Losstypeid": this.secdLossInfo.LosstypeId,
        "Partyno": this.secdLossInfo.PartyNo,
        "Remarks": this.createSecondaryForm.controls['Remarks'].value,
        "TotalPrice": this.createSecondaryForm.controls['Amount'].value,
        "LossNo": this.isLossEdit == '' || null ? '' : this.isLossEdit,
        "SalvageAmount": this.createSecondaryForm.controls['SalvageAmount'].value,
        "DepriciationAmount": this.createSecondaryForm.controls['DepreciationAmount'].value,
        "LessExcess": this.createSecondaryForm.controls['ExcessAmount'].value,
        "SaveorSubmit": event == 'submit' ? 'Submit' : 'Save',
        "Status": this.createSecondaryForm.controls['Status'].value,
        "UnderInsurance":this.createSecondaryForm.controls['UnderInsurance'].value,
        "TheftDate":this.datePipe.transform(this.createSecondaryForm.controls['TheftDate'].value,"dd/MM/yyyy"),
        "TheftTime":this.createSecondaryForm.controls['TheftTime'].value,
        "TheftPlace":this.createSecondaryForm.controls['TheftPlace'].value,
        "TheftStolen":this.createSecondaryForm.controls['TheftStolen'].value,
        "TheftEstReplace": this.createSecondaryForm.controls['TheftEstReplace'].value,
        "TheftDiscovredBy": this.createSecondaryForm.controls['TheftDiscovredBy'].value,
        "TheftReportedTo": this.createSecondaryForm.controls['TheftReportedTo'].value,
        "TheftReportedWhen": this.datePipe.transform(this.createSecondaryForm.controls['TheftReportedWhen'].value,"dd/MM/yyyy"),
        "TheftReportedWhich": this.createSecondaryForm.controls['TheftReportedWhich'].value,
        "TheftCrDairyno": this.createSecondaryForm.controls['TheftCrDairyno'].value,
        "VatYn":this.VatYN,
        ...this.commonReqObject()
      }

      let UrlLink = `api/save/claimLossDetails`;
      return this.lossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {

        console.log("saveloss", data);
        if (data.Response == "SUCCESS") {
          this.dialogRef.close(true);
          if (this.isLossEdit == '' || null) {
            Swal.fire(
              `Loss Created Successfully`,
              'success'
            )
          } else {
            Swal.fire(
              `Loss Updated Successfully`,
              'success'
            )
          }
          this.onStatusUpdate();
        }
        if (data.Errors) {

          this.errorService.showValidateError(data.Errors);
        }
        if (data.ErrorsList) {
          console.log(data.ErrorsList);
          this.errorService.showLossErrorList(data.ErrorsList);
        }
      }, (err) => {
        this.handleError(err);
      })

    }
  }
  onStatusUpdate() {
    const dialogRef = this.dialog.open(StatusUpdateComponent, {
      width: '100%',
      panelClass: 'full-screen-modal'
    });

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
