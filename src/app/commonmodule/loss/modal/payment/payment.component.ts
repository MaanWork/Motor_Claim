import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { LossService } from '../../loss.service';
export interface PeriodicElement {
  AdditionalDescription: any;
  BranchCode: any;
  BranchDescription: any;
  CauseOfLoss: any;
  ChassisNo: any;
  ClaimChannel: any;
  ClaimDate: any;
  ClaimNo: any;
  Claimrefno: any;
  CreatedBy: any;
  CustomerId: any;
  DateOfIncident: any;
  Edit: any;
  EntryDate: any;
  EstimateAmt: any;
  GarageId: any;
  InsDescription: any;
  InsuranceId: any;
  NoOfPart: any;
  OutstandingAmt: any;
  PaidAmt: any;
  PoliceReportSource: any;
  PoliceReportno: any;
  PolicyNo: any;
  Product: any;
  ProductDesc: any;
  ProductId: any;
  RegionCode: any;
  Status: any;
}
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  public paymentSlider1: boolean = false;
  public paymentSlider2: boolean = false;
  public payabletype: any = 'TotalAmount';
  public paymentForm: FormGroup;
  public bankList: any[] = [];
  public branchList: any[] = [];
  public logindata: any;
  public bankCompCode: any = '';
  public branchCompCode: any = '';
  public cityList: any[] = [];
  cityCompCode: any = '';
  public tableData: PeriodicElement[];
  public columnHeader: any;
  public tableData1: PeriodicElement[];
  public columnHeader1: any;
  public activePayment: number = 1;
  public paymentTitle: string = 'Surveyor';
  public paymentLossess = [];
  public paymentChoosed: any;
  constructor(
    private formBuilder: FormBuilder,
    private lossService: LossService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe
  ) {
    console.log("Payment", this.data)
  }

  ngOnInit(): void {
    this.logindata = JSON.parse(
      sessionStorage.getItem('Userdetails')
    )?.LoginResponse;
    this.createFromControl();

  }
  onLoadBankList() {

    let ReqObj = {
      Status: 'Y',
      InscompanyId: this.logindata.InsuranceId,
    };
    let UrlLink = `api/getbankmaster`;
    return this.lossService.onPostMethod(UrlLink, ReqObj).subscribe(
      async (data: any) => {

        console.log('Bank Master List', data);
        this.bankList = data;
        console.log(data);
      },
      (err) => {
        this.handleError(err);
      }
    );
  }
  async onChangeBankList(bankCode) {
    let Code = this.bankList.find((ele: any) => ele.Bankcode == bankCode);
    if (Code) {
      this.bankCompCode = bankCode;

      this.paymentForm.controls['bankName'].setValue(Code.Bankname);
      this.onLoadCityList();

    }
  }
  async onChangeBranchValue(branchCode) {
    let Code = this.branchList.find((ele: any) => ele.Branchcode == branchCode);
    if (Code) {
      this.branchCompCode = branchCode;

      this.paymentForm.controls['branchName'].setValue(Code.Branchname);
    }
  }
  createFromControl() {
    this.paymentForm = this.formBuilder.group({
      holderName: ['', Validators.required],
      bankName: ['', Validators.required],
      Cityname: ['', Validators.required],
      accountNo: ['', Validators.required],
      reAccountNo: ['', Validators.required],
      swiftCode: ['', Validators.required],
      micrNo: ['', Validators.required],
      branchName: ['', Validators.required],
      paymentType: ['TotalAmount', Validators.required],
      amount: [this.data?.VatYn == 'Y' ? this.data?.TotalPayable : this.data?.TotalPrice, Validators.required],
    });
    this.onLoadBankList();
    this.onGetAllLoss();
  }


  onGetAllLoss() {
    let ReqObj = {
      "ClaimNo": this.data?.ClaimNo,
      "PartyNo": this.data?.PartyNo,
      "LosstypeId": this.data?.LosstypeId
    };
    let UrlLink = `api/claimlossesbyclaimno`;
    return this.lossService.onPostMethod(UrlLink, ReqObj).subscribe((data: any) => {
      this.paymentLossess = data;
      this.onPayment(this.activePayment,this.paymentTitle);

    },
      (err) => {
        this.handleError(err);
      }
    );
  }

  onLoadBranchList(cityCode) {
    console.log("Changed City Code", cityCode)
    let ReqObj = {
      Status: 'Y',
      Inscompanyid: this.logindata.InsuranceId,
      Bankcode: this.bankCompCode,
      Citycode: cityCode
    };
    let UrlLink = `api/getbankbranchmaster`;
    return this.lossService.onPostMethod(UrlLink, ReqObj).subscribe(
      async (data: any) => {

        console.log('Branch List', data);
        this.branchList = data;
        console.log(data);

      },
      (err) => {
        this.handleError(err);
      }
    );
  }
  onLoadCityList() {
    let ReqObj = {
      Status: 'Y',
      InscompanyId: this.logindata.InsuranceId,
      Bankcode: this.bankCompCode,
    };
    let UrlLink = `api/getBankCityMaster`;
    return this.lossService.onPostMethod(UrlLink, ReqObj).subscribe(
      async (data: any) => {
        console.log('City List', data);
        this.cityList = data;
        console.log(data);
      },
      (err) => {
        this.handleError(err);
      }
    );
  }
  onChangeCityValue(cityName) {
    let Code = this.cityList.find((ele: any) => ele.Cityname == cityName);
    if (Code) {
      this.cityCompCode = Code.Citycode;

      this.paymentForm.controls['Cityname'].setValue(cityName);
      this.onLoadBranchList(Code.Citycode);
    }
  }

  onPayment(val: number, title: string) {
    this.activePayment = val;
    this.paymentTitle = title;
    let findUser = this.paymentLossess.find((ele: any) => ele.UserType == title.toLowerCase());
    this.paymentChoosed = findUser;
    console.log(this.paymentChoosed);
    console.log(this.paymentLossess);
    if (this.paymentChoosed != undefined) {
      this.onGetExistBankList();


    }
  }






  onGetExistBankList() {
    let UrlLink = `api/bankaccountdetails`;
    let ReqObj = {
      Companyid: this.logindata.InsuranceId,
      Userid:this.paymentChoosed.CreatedBy,
      Usertype: this.paymentChoosed.UserType,
    };
    this.lossService.onPaymentSubmit(UrlLink, ReqObj).subscribe(
      async (data: any) => {
        console.log(data);
        this.tableData = data;
      this.onGetPaymentHistory();

      },
      (err) => {
        this.handleError(err);
      }
    );

    this.columnHeader = [
      { key: 'Accountnumber', display: 'Account No' },
      { key: 'Bankname', display: 'Bank Name' },
      { key: 'Bankbranchname', display: 'Branch Name' },
      {
        key: 'action',
        display: 'Select',
        config: {
          isSelectBank: true,
          actions: ['EDIT'],
        },
      },
    ];
  }
  onInsertBankDetails() {
    let UrlLink = 'api/insertbankaccountdetails';
    let formValue = this.paymentForm.value;
    let ReqObj = {
      Accountnumber: formValue.accountNo,
      Bankname: this.paymentForm.controls['bankName'].value,
      Bankcode: this.bankCompCode,
      Bankbranchname: this.paymentForm.controls['branchName'].value,
      Branchcode: this.branchCompCode,
      Bankcity: this.paymentForm.controls['Cityname'].value,
      Bankcitycode: this.cityCompCode,
      Companyid: this.logindata.InsuranceId,
      Micrnumber: this.paymentForm.controls['micrNo'].value,
      Mobilecode: null,
      Phonenumber: null,
      Primaryorsecaccount: null,
      Regioncode: this.logindata?.RegionCode,
      Regionname: null,
      Swiftcode: formValue.swiftCode,
      Username: formValue.holderName,

      Userid: this.paymentChoosed.CreatedBy,
      Usertype: this.paymentChoosed.UserType,
      Claimno: this.data?.ClaimNo,
      Policyno: this.data?.PolicyNo,
      Chassisno: this.data?.ChassisNo,
      Partyno: this.data?.PartyNo,
      Losstypeid: this.data?.LosstypeId,
    };

    return this.lossService.onPaymentSubmit(UrlLink, ReqObj).subscribe(
      async (data: any) => {
        console.log(data);

        if (data?.Errors) {
          this.errorService.showValidateError(data?.Errors);
        } else {
          this.onPaymentSubmit();

        }
      },
      (err) => {
        this.handleError(err);
      }
    );
  }

  onPaymentSubmit() {
    let formValue = this.paymentForm.value;

    let UrlLink = `api/insertpaymenttransactiondetails`;
    let ReqObj = {
      AccountNumber: formValue.accountNo,
      Amountpaid: formValue.amount,
      Paiddate: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      Partialamountyn: formValue.paymentType == 'TotalAmount' ? 'N' : 'Y',
      Claimno: this.data?.ClaimNo,
      Companyid: this.logindata.InsuranceId,
      Losstypeid: this.data?.LosstypeId,
      Partyno: this.data?.PartyNo,
      Policyno: this.data?.PolicyNo,
      Usertype: this.paymentChoosed.UserType,
      Paymentbyusertype: this.logindata.UserType,
      Paymentbyuserid: this.logindata?.LoginId

    };
    this.lossService.onPaymentSubmit(UrlLink, ReqObj).subscribe(
      async (data: any) => {
        console.log('payTrancs', data);

        if (data.Errors) {
          this.errorService.showValidateError(data.Errors);
        }
        else {

        }
      },
      (err) => {
        this.handleError(err);
      }
    );
  }

  onGetPaymentHistory() {
    this.columnHeader1 = [
      { key: 'Totalamount', display: 'Total Amount' },
      { key: 'Amountpaid', display: 'Amount Paid' },
      { key: 'Paiddate', display: 'Paid Date' },
      { key: 'Amountremaing', display: 'Balance Amount' },
    ];
    let UrlLink = `api/paymenttransactiondetailsforloss`;
    let ReqObj = {
      Claimno: this.data?.ClaimNo,
      Companyid: this.logindata.InsuranceId,
      Losstypeid: this.data?.LosstypeId,
      Partyno: this.data?.PartyNo,
      Policyno: this.data?.PolicyNo,
      Usertype: this.paymentChoosed.UserType,
    };
    this.lossService.onPaymentSubmit(UrlLink, ReqObj).subscribe(
      async (data: any) => {
        console.log('payTrancs', data);
        this.tableData1 = data;

      },
      (err) => {
        this.handleError(err);
      }
    );
  }










  handleError(error) {
    let errorMessage: any = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = { ErrorCode: error.status, Message: error.message };
      this.errorService.showError(error, errorMessage);
    }
  }
}
