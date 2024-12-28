import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorService } from '../../services/errors/error.service';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { LossModalComponent } from 'src/app/shared/loss-modal/loss-modal.component';
import { StatusUpdateComponent } from '../../lossinfocomponent/status-update/status-update.component';

@Component({
  selector: 'app-total-loss-by-theft',
  templateUrl: './total-loss-by-theft.component.html',
  styleUrls: ['./total-loss-by-theft.component.css']
})
export class TotalLossByTheftComponent implements OnInit {

  public logindata: any = {};
  public claimDetails: any = {};
  public createSecondaryForm: FormGroup;
  @Input() secdLossInfo: any;
  @Input() hidebtn: any;

  public LossTypeDes: any = '';
  public isLossEdit: any;
  public LossTypeId:any;
  public isDisabled:boolean=true;
  @Output() public onSubmitFrom = new EventEmitter<any>();
  VatYN: any="N";
  vatSection: boolean = false;
  totalAmount: any;
  constructor(
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    public dialog:MatDialog,
    private lossService: LossService,
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
      SalvageAmount: [{value:'',disabled: this.isDisabled}, Validators.required],
      ExcessAmount: [{value:'',disabled: this.isDisabled}, Validators.required],
      DepreciationAmount: [{value:'',disabled: this.isDisabled}, Validators.required],
      Amount: [{value:'',disabled: this.isDisabled}, Validators.required],
      Remarks: [{value:'',disabled: this.isDisabled}, Validators.required],
    })
  }

  onUpdateValidators(){

   const SalvageAmount = this.createSecondaryForm.get('SalvageAmount');
   const ExcessAmount = this.createSecondaryForm.get('ExcessAmount');
   const DepreciationAmount = this.createSecondaryForm.get('DepreciationAmount');

      if (this.LossTypeId == 48 || this.LossTypeId == 49 || this.LossTypeId == 50) {
        SalvageAmount.setValidators([Validators.required]);
        ExcessAmount.setValidators([Validators.required]);
        DepreciationAmount.setValidators([Validators.required]);
      }
      else {
        SalvageAmount.setValidators(null);
        ExcessAmount.setValidators(null);
        DepreciationAmount.setValidators(null);
      }

      SalvageAmount.updateValueAndValidity();
      ExcessAmount.updateValueAndValidity();
      DepreciationAmount.updateValueAndValidity();

  }

  onBindSecondayLossType() {
    this.createSecondaryForm.controls['SalvageAmount'].setValue(this.secdLossInfo.SalvageAmount);
    this.createSecondaryForm.controls['ExcessAmount'].setValue(this.secdLossInfo.LessExcess);
    this.createSecondaryForm.controls['DepreciationAmount'].setValue(this.secdLossInfo.DepriciationAmount);
    this.createSecondaryForm.controls['Amount'].setValue(this.secdLossInfo.SparepartsCost);
    this.createSecondaryForm.controls['Remarks'].setValue(this.secdLossInfo.Remarks)
    if(this.secdLossInfo.VatYn!=null){
      this.totalAmount = this.secdLossInfo.TotalPayable;
      this.VatYN = this.secdLossInfo.VatYn;
      if(this.VatYN=='Y'){
        this.vatSection = true;
        
      }
    }
  }

  async saveLossDetails(event: string) {
     console.log(this.createSecondaryForm);
    if (this.createSecondaryForm.invalid) {
      Swal.fire(
        `Please Fill All Required Fields`,
        'info'
      )
    } else {
      
      let Subusertype=this.logindata.SubUserType;
      if(Subusertype=='Approver'){
        this.onStatusUpdate();
      }
      else{

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
          "VatYn": this.VatYN,
          ...this.commonReqObject()
        }

        let UrlLink = `api/insertclaimLossdetail`;
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
          if (data.ErrorsList) {
            let Errorheading:any='';
            let ErrorList;
            let element = '';
            for (let i = 0; i < data.ErrorsList.length; i++) {
              const element = data.ErrorsList[i].Title;
              const elementErrors = data.ErrorsList[i].Errors;
              console.log("Element",element);
              Errorheading +='<div class="my-1 text-left"><h3>'+element+'</h3></div>';
              for (let index = 0; index < elementErrors.length; index++) {
                const element1 = elementErrors[index];
                console.log("Message",element1);
                Errorheading += '<div class="my-1 text-left"><i class="far fa-dot-circle text-danger p-1"></i>' + element1.Message+ "</div>";

              }
            }
            Swal.fire(
              'Please Fill Valid Value',
              `${Errorheading}`,
              'error',
            )
          }
          if (data.Errors) {

            this.errorService.showValidateError(data.Errors);

          }
        }, (err) => {
          this.handleError(err);
        })
      }
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
