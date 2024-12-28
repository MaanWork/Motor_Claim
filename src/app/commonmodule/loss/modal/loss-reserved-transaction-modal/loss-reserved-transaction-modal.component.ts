import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LossService } from '../../loss.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
export interface PeriodicElement {
  Address: any,
  CategoryDesc: any,
  CategoryId: any,
  ChassisNo: any,
  ClaimNo: any,
  ConsumablesCost: any,
  CreatedBy: any,
  DepriciationAmount: any,
  DriverDob: any,
  DriverEmailId: any,
  DriverGender: any,
  DriverLicenseExpiryDate: any,
  DriverLicenseNo: any,
  DriverMobile: any,
  DriverMobileCode: any,
  DriverName: any,
  DriverNationality: any,
  EntryDate: any,
  FinanceOfficerId: any,
  GarageYn: any,
  IncidentLatitudeLongitude: any,
  IncidentLocationLongitude: any,
  LabourCost: any,
  LessBetterment: any,
  LessExcess: any,
  LossNo: any,
  LosstypeId: any,
  Losstypedescp: any,
  PartyNo: any,
  PerHourLabourCost: any,
  PolicyNo: any,
  Remarks: any,
  SalvageAmount: any,
  SectionIds: any,
  SparepartsCost: any,
  Status: any,
  Statusdescrip: any,
  TotalLabourHour: any,
  TotalPrice: any,
}
@Component({
  selector: 'app-loss-reserved-transaction-modal',
  templateUrl: './loss-reserved-transaction-modal.component.html',
  styleUrls: ['./loss-reserved-transaction-modal.component.css']
})
export class LossReservedTransactionModalComponent implements OnInit {
  logindata: any;
  reservedTypeList:any;
  public startDate = new Date();
  public transactionForm: FormGroup;
  currencyTypeList: any;
  claimNo: any="";policyNo: any="";
  partyNo: any="";insuranceId: any="";
  branchCode: any="";regionCode: any="";
  public tableData: PeriodicElement[] | any;
  columnHeader: any;
  innerColumnHeader: any[]=[];
  addNewTransaction:boolean = false;
  partyName: any;
  constructor(
    private formBuilder: FormBuilder,
    private lossService: LossService,
    private errorService: ErrorService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LossReservedTransactionModalComponent>,
  ) { 
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    console.log("Login Res",this.logindata)
  }

  ngOnInit(): void {
    if(this.data){
      console.log("Received Data",this.data);
      this.claimNo = this.data.ClaimNo;
      this.policyNo = this.data.PolicyNo;
      this.insuranceId = this.logindata.InsuranceId;
      this.branchCode = this.logindata.BranchCode;
      this.regionCode = this.logindata.RegionCode;
      this.partyNo = this.data.PartyNo;
      this.partyName = this.data.PartyName;
    }
    this.createFromControl();
    this.onInitialFetchData();
  }
  async onInitialFetchData(){
    this.reservedTypeList = await this.getReservedTypeList();
    this.currencyTypeList = await this.getCurrencyTypeList();
    await this.getTransactionList();
  }
  async getReservedTypeList(){
    let UrlLink = `api/reservetypes`;
    let response = (await this.lossService.getFaultCategory(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async getCurrencyTypeList(){
    let UrlLink = `api/currencytypes/100002`;
    let response = (await this.lossService.getFaultCategory(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async getTransactionList(){
    this.tableData = undefined;
    let ReqObj = {
      "ClaimNo": this.claimNo,
      "PolicyNo": this.policyNo,
      "PartyNo": this.partyNo,
      "LosstypeId": ""
    }
    this.tableData = await this.lossService.onGetLossList(ReqObj);
    this.columnHeader = [
      { key: "LossNo", display: "LOSS NO" },
      { key: "Losstypedescp", display: "LOSS DESCRIPTION" },
      { key: "TotalPrice", display: "LOSS VALUE" },
      { key: "LossExcess", display: "LOSS RESERVED AMOUNT", 
      config: {
        isLossReservedAmount: true,
        actions: ["EDIT"]
      } },
    ];
    // this.innerColumnHeader =
    // {
    //   "Remarks": "REMARKS",
    //   "EntryDate": "LOSS CREATED",
    // }
  }
  createFromControl(){
    this.transactionForm = this.formBuilder.group({
      Reservetype: ['', Validators.required],
      CurrencyId: ['', Validators.required],
      OutstFullAmt: ['', Validators.required],
      OutstOurAmt: ['', Validators.required],
      TotalOutstLossAmt: ['', Validators.required],
      SharePercent: ['', Validators.required],
      ResPosdate: ['', Validators.required],
      ResUpddate: ['', Validators.required],
      Remarks: ['', Validators.required],
      UpdateRef: ['', Validators.required],
    })
  }
  addTransaction(){
    this.transactionForm.reset();
    this.addNewTransaction = true;
  }
  onSaveTransactions(){
    console.log("Final Submit Value",this.transactionForm.value);
    let ReqObj = {
      "ResId": "", 
      "ClaimNo": this.claimNo,
      "PolicyNo": this.policyNo,
      "PartyNo": this.partyNo,
      "LosstypeId": "",
      "InsuranceId": this.insuranceId,
      "BranchCode": this.branchCode,
      "RegionCode": this.regionCode,
      "Usertype": this.data.UserType,
      "CreatedBy": this.data.CreatedBy,
      "Reservetype": this.transactionForm.controls['Reservetype'].value,
      "Reservetypedesc": "",
      "CurrencyShortDesc": "",
      "CurrencyId": this.transactionForm.controls['CurrencyId'].value,
      "OutstFullAmt": this.transactionForm.controls['OutstFullAmt'].value,
      "OutstOurAmt": this.transactionForm.controls['OutstOurAmt'].value,
      "TotalOutstLossAmt": this.transactionForm.controls['TotalOutstLossAmt'].value,
      "ResPosdate":  this.datePipe.transform(this.transactionForm.controls['ResPosdate'].value, "dd/MM/yyyy"),
      "ResUpddate":  this.datePipe.transform(this.transactionForm.controls['ResPosdate'].value, "dd/MM/yyyy"),
      "Remarks": this.transactionForm.controls['Remarks'].value,
      "SharePercent":this.transactionForm.controls['SharePercent'].value,
      "UpdateRef": this.transactionForm.controls['UpdateRef'].value
    }
    let UrlLink = `api/savereservedetails`;
    return this.lossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {
        console.log("Resereved Trans Submit",data);
        if (data.Errors) {
          this.errorService.showValidateError(data.Errors);
        }
        else {
          Swal.fire(
            'Reserved Transactions Inserted Successfully',
            'Success',
            'success'
          );
          this.getTransactionList();
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
}
