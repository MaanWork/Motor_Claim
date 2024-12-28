import { Component, Input, OnInit, OnDestroy, OnChanges, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DamageModalComponent } from 'src/app/shared/lossinfocomponent/damage-modal/damage-modal.component';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { ErrorService } from '../../services/errors/error.service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-loss-dmage-parts',
  templateUrl: './loss-dmage-parts.component.html',
  styleUrls: ['./loss-dmage-parts.component.css']
})
export class LossDmagePartsComponent implements OnInit, OnDestroy,OnChanges {
  public damageInformation: any;
  public logindata: any;
  public LossDetails:any;
  public TotalPrice: any;
  public isSingleClick: Boolean = true;

  @Input() form: FormGroup;
  @Input() DamagePoints: any = [];
  @Input() LossInformation: any;
  @Input() approvedSection: any;
  @Input() pageFrom: any;
  @Output() public DamageListValues = new EventEmitter<any>();
  

  public damagepoints_1: boolean = false;
  public damagepoints_2: boolean = false;
  public damagepoints_3: boolean = false;
  public damagepoints_4: boolean = false;
  public damagepoints_5: boolean = false;
  public damagepoints_6: boolean = false;
  public damagepoints_7: boolean = false;
  public damagepoints_8: boolean = false;
  public damagepoints_9: boolean = false;
  public damagepoints_10: boolean = false;
  public damagepoints_11: boolean = false;
  public damagepoints_12: boolean = false;
  public damagepoints_14: boolean = false;
  public damagepoints_13: boolean = false;
  public damagepoints_15: boolean = false;
  public damagepoints_16: boolean = false;



  private subscription = new Subscription();
  @Input() WhoView:any;
  @Input() surveyorLoginId:any;
  constructor(
    private errorService: ErrorService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private lossService: LossService,
    public dialog: MatDialog,

  ) { 

  }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.LossDetails = JSON.parse(sessionStorage.getItem("LossDetails"));
    if(this.approvedSection==true && this.logindata.UserType=='garage'){
        //alert(this.approvedSection)
    }
    else{
      this.surveyorLoginId = null;
    }
    if(this.form.controls['SparePartsCost'].value){
      this.validateNumber(this.form.controls['SparePartsCost'].value,'SparePartsCost')
    }
    if(this.form.controls['YoungAgeDriver'].value){
      this.validateNumber(this.form.controls['YoungAgeDriver'].value,'YoungAgeDriver')
    }
    if(this.form.controls['SalvageAmount'].value){
      this.validateNumber(this.form.controls['SalvageAmount'].value,'SalvageAmount')
    }
    if(this.form.controls['LabourCost'].value){
      this.validateNumber(this.form.controls['LabourCost'].value,'LabourCost')
    }
    let damageIdLength = 16;
    for (let index = 1; index <= damageIdLength; index++) {
      this['damagepoints_' + index] = false;
    }
    for (let index = 0; index < this.DamagePoints.length; index++) {
      const element = this.DamagePoints[index];
      this['damagepoints_' + element] = true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  validateNumber(e: any,name) {
    // this.form.controls[name].setValue(formatNumber(Number(e), 'en-US', '1.2-3'));
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
    }, (err) => {
      this.handleError(err);
    })
  }
  ngOnChanges(){
   this.DamagePoints
    let damageIdLength = 16;
    for (let index = 1; index <= damageIdLength; index++) {
      this['damagepoints_' + index] = false;
    }
    for (let index = 0; index < this.DamagePoints.length; index++) {
      const element = this.DamagePoints[index];
      this['damagepoints_' + element] = true;
    }
  }
  checkValues(){
    return ((this.form.controls['SparePartsCost'].value!=null && this.form.controls['SparePartsCost'].value!=0 && this.form.controls['SparePartsCost'].value!='0') || 
      (this.form.controls['LabourCostPerHour'].value!=null && this.form.controls['LabourCostPerHour'].value!=0 && this.form.controls['LabourCostPerHour'].value!='0') || 
      (this.form.controls['LessBetterment'].value!=null && this.form.controls['LessBetterment'].value!=0 && this.form.controls['LessBetterment'].value!='0'))
  }


  method1CallForClick(id) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        // this['damagepoints_' + id] = true;
        this.lossService.onGetDamagePartId(id);
        this.onDamagePonits(id);
        const dialogRef = this.dialog.open(DamageModalComponent, {
          width: '100%',
          panelClass: 'full-screen-modal',
          data: {'LossInformation':this.LossInformation,'approvedSection':this.approvedSection,
          'surveyorLoginId':this.surveyorLoginId,'WhoView':this.WhoView}
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result !=undefined && result !=''&& result !=null){
            this.DamageListValues.emit(result);
          }
        });
      }
    }, 250)
  }

  onDamagePonits(id) {
    let exist = this.DamagePoints.some((ele: any) => ele == id);
    let index = this.DamagePoints.findIndex((ele: any) => ele == id);

    if (!exist) {
      this.DamagePoints.push(id);

    }

  }



  method2CallForDblClick(id) {
    this.isSingleClick = false;
    this.onDamagecheckboxRemove(id);
  }


  onDamagecheckboxRemove(id) {

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
        this.onRemoveLossMarkDetails(id)


      }
    })


  }


  onRemoveLossMarkDetails(id) {

    let ReqObj = {
      "ChassisNo": this.LossDetails.ChassisNo,
      "ClaimNo": this.LossDetails.ClaimNo,
      "Partyno": this.LossDetails.PartyNo,
      "PolicyNo": this.LossDetails.PolicyNo,
      "Losstypeid":this.LossDetails.LosstypeId,
      "SectionIds": [id],
      "CreatedBy": this.logindata.LoginId,
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "UserType": this.logindata.UserType
    }

    let UrlLink = `api/deletesectionidsinloss`;
    return this.lossService.onRemoveLossMarkDetails(UrlLink, ReqObj).subscribe((data: any) => {

      if (data.Response == "Successfully Deleted") {
        this['damagepoints_' + id] = false;
        let index = this.DamagePoints.findIndex((ele: any) => ele == id);
        this.DamagePoints.splice(index, 1);
        Swal.fire(
          'Removed!',
          'Your Mark has been deleted.',
          'success'
        )
      }

    }, (err) => {
      this.handleError(err);
    })


  }



  ConvertToInt(val) {
    if (val == '' || val == null) {
      return 0;
    }
    return parseInt(val);
  }




  damageListDisabled() {
    if (this.logindata?.UserType == "claimofficer") {
      return true;
    }
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
