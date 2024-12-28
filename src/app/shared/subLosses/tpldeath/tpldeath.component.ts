import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorService } from '../../services/errors/error.service';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { LossModalComponent } from 'src/app/shared/loss-modal/loss-modal.component';
import { StatusUpdateComponent } from '../../lossinfocomponent/status-update/status-update.component';

@Component({
  selector: 'app-tpldeath',
  templateUrl: './tpldeath.component.html',
  styleUrls: ['./tpldeath.component.css']
})
export class TPLDeathComponent implements OnInit {
  @Input() hidebtn: any;

  public logindata: any = {};
  public claimDetails: any = {};
  public createSecondaryForm: FormGroup;
  @Input() secdLossInfo: any;
  public LossTypeDes: any = '';
  public isLossEdit: any;
  public LossTypeId:any;
  public isDisabled:boolean=true;VatYN:any="N";
  public empYn = 'SelfEmployed';
  @Output() public onSubmitFrom = new EventEmitter<any>();
  vatSection: boolean = false;
  totalAmount: any;
  constructor(
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private lossService: LossService,
    public dialog:MatDialog,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<LossModalComponent>,
  ) {
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
      "VictAddress": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictAge": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictAnnualIncome": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictBreadWinner": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictComAddress": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictComDesignation": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictComName": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictComPoBox": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictDependAddre": [{value:'',disabled: this.isDisabled}],
      "VictDependName": [{value:'',disabled: this.isDisabled}],
      "VictDependYn": [{value:'N',disabled: this.isDisabled}, Validators.required],
      "VictEmpType": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictGender": [{value:'1',disabled: this.isDisabled}, Validators.required],
      "VictLossDesc": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictName": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictOccupation": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictPoBox": [{value:'',disabled: this.isDisabled}, Validators.required],
      "VictmMonthIncome": [{value:'',disabled: this.isDisabled}, Validators.required],
      "LessExcess":[{value:'0',disabled: this.isDisabled}, Validators.required],
      "VictNameAddr":[{value:'',disabled: this.isDisabled}],
      "VictMedAtten":[{value:'',disabled: this.isDisabled}, Validators.required]
    })
  }

  onUpdateValidators(){
     }

  onBindSecondayLossType() {
    this.createSecondaryForm.controls['VictAddress'].setValue(this.secdLossInfo.VictAddress);
    this.createSecondaryForm.controls['Amount'].setValue(this.secdLossInfo.TotalPrice);
    this.createSecondaryForm.controls['Remarks'].setValue(this.secdLossInfo.Remarks);
    this.createSecondaryForm.controls['VictAge'].setValue(this.secdLossInfo.VictAge);
    this.createSecondaryForm.controls['VictAnnualIncome'].setValue(this.secdLossInfo.VictAnnualIncome);
    this.createSecondaryForm.controls['VictBreadWinner'].setValue(this.secdLossInfo.VictBreadWinner);
    this.createSecondaryForm.controls['VictComAddress'].setValue(this.secdLossInfo.VictComAddress);
    this.createSecondaryForm.controls['VictComDesignation'].setValue(this.secdLossInfo.VictComDesignation);
    this.createSecondaryForm.controls['VictComName'].setValue(this.secdLossInfo.VictComName);
    this.createSecondaryForm.controls['VictComPoBox'].setValue(this.secdLossInfo.VictComPoBox);
    this.createSecondaryForm.controls['VictDependAddre'].setValue(this.secdLossInfo.VictDependAddre);
    this.createSecondaryForm.controls['VictDependName'].setValue(this.secdLossInfo.VictDependName);
    this.createSecondaryForm.controls['VictDependYn'].setValue(this.secdLossInfo.VictDependYn);
    this.createSecondaryForm.controls['VictEmpType'].setValue(this.secdLossInfo.VictEmpType);
    this.empYn = this.secdLossInfo.VictEmpType;
    if(this.secdLossInfo.VatYn!=null){
      this.totalAmount = this.secdLossInfo.TotalPayable;
      this.VatYN = this.secdLossInfo.VatYn;
      if(this.VatYN=='Y'){
        this.vatSection = true;
        
      }
    }

    this.createSecondaryForm.controls['VictGender'].setValue(this.secdLossInfo.VictGender);
    this.createSecondaryForm.controls['VictLossDesc'].setValue(this.secdLossInfo.VictLossDesc);
    this.createSecondaryForm.controls['VictMedAtten'].setValue(this.secdLossInfo.VictMedAtten);
    this.createSecondaryForm.controls['VictName'].setValue(this.secdLossInfo.VictName);
    this.createSecondaryForm.controls['VictNameAddr'].setValue(this.secdLossInfo.VictNameAddr);
    this.createSecondaryForm.controls['VictOccupation'].setValue(this.secdLossInfo.VictOccupation);
    this.createSecondaryForm.controls['VictPoBox'].setValue(this.secdLossInfo.VictPoBox);
    this.createSecondaryForm.controls['VictmMonthIncome'].setValue(this.secdLossInfo.VictmMonthIncome);
    // this.createSecondaryForm.controls['SalvageAmount'].setValue(this.secdLossInfo.SalvageAmount);
    // this.createSecondaryForm.controls['ExcessAmount'].setValue(this.secdLossInfo.LessExcess);
    // this.createSecondaryForm.controls['DepreciationAmount'].setValue(this.secdLossInfo.DepriciationAmount);
    // this.createSecondaryForm.controls['Amount'].setValue(this.secdLossInfo.TotalPrice);
    // this.createSecondaryForm.controls['Remarks'].setValue(this.secdLossInfo.Remarks)
  }

  async saveLossDetails(event: string) {

     this.createSecondaryForm.controls['VictEmpType'].setValue(this.empYn);
     console.log(this.createSecondaryForm.value);


      let ReqObj = {
        "ChassisNo": this.claimDetails.ChassisNo,
        "ClaimNo": this.claimDetails.ClaimNo,
        "Claimrefno": this.claimDetails.Claimrefno,
        "PolicyNo": this.claimDetails.PolicyNo,
        "Losstypeid": this.secdLossInfo.LosstypeId,
        "Partyno": this.secdLossInfo.PartyNo,
        "Remarks": this.createSecondaryForm.controls['Remarks'].value,
        "TotalPrice": this.createSecondaryForm.controls['Amount'].value,
        "LossNo": this.isLossEdit == '' || null ? '' : this.isLossEdit,
        "SalvageAmount": this.createSecondaryForm.controls['SalvageAmount'].value,
        "DepriciationAmount": this.createSecondaryForm.controls['DepreciationAmount'].value,
        "LessExcess": this.createSecondaryForm.controls['ExcessAmount'].value,
        "SaveorSubmit": event == 'Submit' ? 'Submit' : 'Save',
        "Status": this.createSecondaryForm.controls['Status'].value,
        "UnderInsurance":this.createSecondaryForm.controls['UnderInsurance'].value,
        "VictAddress": this.createSecondaryForm.controls['VictAddress'].value,
        "VictAge": this.createSecondaryForm.controls['VictAge'].value,
        "VictAnnualIncome": this.createSecondaryForm.controls['VictAnnualIncome'].value,
        "VictBreadWinner": this.createSecondaryForm.controls['VictBreadWinner'].value,
        "VictComAddress": this.createSecondaryForm.controls['VictComAddress'].value,
        "VictComDesignation": this.createSecondaryForm.controls['VictComDesignation'].value,
        "VictComName": this.createSecondaryForm.controls['VictComName'].value,
        "VictComPoBox": this.createSecondaryForm.controls['VictComPoBox'].value,
        "VictDependAddre": this.createSecondaryForm.controls['VictDependAddre'].value,
        "VictDependName": this.createSecondaryForm.controls['VictDependName'].value,
        "VictDependYn": this.createSecondaryForm.controls['VictDependYn'].value,
        "VictEmpType": this.createSecondaryForm.controls['VictEmpType'].value,
        "VictGender": this.createSecondaryForm.controls['VictGender'].value,
        "VictLossDesc": this.createSecondaryForm.controls['VictLossDesc'].value,
        "VictName": this.createSecondaryForm.controls['VictName'].value,
        "VictOccupation": this.createSecondaryForm.controls['VictOccupation'].value,
        "VictPoBox": this.createSecondaryForm.controls['VictPoBox'].value,
        "VictmMonthIncome": this.createSecondaryForm.controls['VictmMonthIncome'].value,
        "VictNameAddr":this.createSecondaryForm.controls['VictNameAddr'].value,
        "VictMedAtten":this.createSecondaryForm.controls['VictMedAtten'].value,
        "VatYn": this.VatYN,
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
          this.errorService.showLossErrorList(data.ErrorsList);

        }
      }, (err) => {
        this.handleError(err);
      })
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
