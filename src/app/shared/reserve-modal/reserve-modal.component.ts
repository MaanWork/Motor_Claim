import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { ErrorService } from '../services/errors/error.service';

@Component({
  selector: 'app-reserve-modal',
  templateUrl: './reserve-modal.component.html'
})
export class ReserveModalComponent implements OnInit{
  claimDetails:any;maxDate:Date;
  effectiveDate:any=null;reserveAmount:any=null;
  logindata: any;insuranceId:any=null;currencyCode:any=null;
  ReserveType:any;
  reserveTypes: any[]=[];
  PaymentTypelist: any[]=[];
  PaymentType:any;
  constructor(public dialog: MatDialog,private datePipe:DatePipe,public dialogRef: MatDialogRef<ReserveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private lossService:LossService,private errorService: ErrorService){
      this.maxDate = new Date();
      this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
      this.insuranceId = this.logindata?.InsuranceId;
      if(this.insuranceId=='100002'){ this.currencyCode = 'TZS'}
      else if(this.insuranceId=='100003'){ this.currencyCode = 'UGX'}
      this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
      if(this.claimDetails){

      }
    }
  ngOnInit(): void {
    if(this.insuranceId=='100003')this.getReserveType()
  }
  getReserveType(){
    let ReqObj = {
      "CompanyId": this.logindata?.InsuranceId,
    }
    let UrlLink = `api/dropdown/reserveType`;
    return this.lossService.getReserveType(UrlLink, ReqObj).subscribe(async (data: any) => {
      this.reserveTypes = data
    }, (err) => {

    })
  }
  onReserveTypeChange(event){
    let ReqObj = {
       "CompanyId": this.logindata?.InsuranceId,
        "ReserveType": event.value
    }
    let UrlLink = `api/dropdown/reservePaymentType`;
    return this.lossService.getReserveType(UrlLink, ReqObj).subscribe(async (data: any) => {
      this.PaymentTypelist = data
    }, (err) => {

    })
  }
    onSaveReserve(){
          let UrlLink = `api/insertreservedetails`;let date = null,reserveAmount:any=null;
          if(this.effectiveDate!=null){
            date = this.datePipe.transform(this.effectiveDate, "dd/MM/yyyy")
          }
          if(this.reserveAmount!=null && this.reserveAmount!=''){
            const regEx = new RegExp(',', "g");
            reserveAmount = this.reserveAmount.replace(regEx,'');
          }
          let paymetDesc = this.PaymentTypelist.find(ele=>ele.Code==this.PaymentType)?.CodeDesc
          let ReserveTypeDesc = this.reserveTypes.find(ele=>ele.Code == this.ReserveType)?.CodeDesc
          let ReqObj = {
            "ClaimNo": this.claimDetails?.ClaimNo,
            "EffectiveDate": date,
            "ReserveAmount": reserveAmount,
            "BranchCode": this.logindata.BranchCode,
            "InsuranceId": this.logindata.InsuranceId,
            "RegionCode": this.logindata.RegionCode,
            "CreatedBy": this.logindata.LoginId,
            "UserType": this.logindata.UserType,
            "UserId": this.logindata?.OaCode,
            "PaymentCode": this.PaymentType,
            "PaymentCodeDesc": paymetDesc,
            "ReserveCode" : this.ReserveType,
            "ReserveCodeDesc": ReserveTypeDesc
          }
          return this.lossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {
                if(data?.Response=='Success'){
                  this.dialogRef.close();
                }
                else if (data.Errors) {
                  this.errorService.showValidateError(data.Errors);
        
                }
          }, (err) => {
      
            this.handleError(err);
          })
    }
    onReserveAmountChange(args){
      if (args.key === 'e' || args.key === '+' || args.key === '-') {
        return false;
      } else {
        return true;
      }
    }
    CommaFormatted(){
      if (this.reserveAmount) {
        this.reserveAmount = this.reserveAmount.replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
