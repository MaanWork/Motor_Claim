import { Component, OnInit, Inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommondataService } from '../../services/commondata.service';
import { ErrorService } from '../../services/errors/error.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import *  as  Mydatas from '../../../appConfig.json';

@Component({
  selector: 'app-policy-search',
  templateUrl: './policy-search.component.html',
  styleUrls: ['./policy-search.component.css']
})
export class PolicySearchComponent implements OnInit {

  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public DocApiUrl: any = this.MotorClaim.DocApiUrl;

  public filteredCompany: Observable<any[]>;
  public filteredCompanyPlate: Observable<any[]>
  public companyList: any[] = [];
  public insuranceId: any;

  public policyNumber: any;
  public regNumber: any;







  searchSection: boolean;
  otpSection: boolean;
  MobileCodeList: any[];
  PlateSearchForm: any;
  PolicySearchForm: any;
  OtpBtnTime: any;
  otpId: any; otpValue: any = "";
  OtpBtnEnable: boolean = false;
  userType: any;policyHolderName:any=null;
  loginData: any;
  assuredName: any;
  UserType
  otpGenerated: any;
  constructor(
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private authService: AuthService,
    public _dataService: CommondataService,
    private router: Router,
  ) {
    this.searchSection = true;
    this.otpSection = false;
    this.otpGenerated = null;
  }

  ngOnInit(): void {
    this.createFromControl();
    this.onFetchInitailData();
    this.loginData = JSON.parse(sessionStorage.getItem("Userdetails"));
    this.insuranceId = this.loginData?.LoginResponse.InsuranceId;

  }
  createFromControl() {
    this.PlateSearchForm = this.formBuilder.group({
      MobileNo: ['', Validators.compose([Validators.required])],
      MobileCode: ['', Validators.compose([Validators.required])],
      PlateNumber: ['', Validators.compose([Validators.required])],
      InsuranceId: ['', Validators.compose([Validators.required])],
    })
    this.PolicySearchForm = this.formBuilder.group({
      MobileNo: ['', Validators.compose([Validators.required])],
      MobileCode: ['', Validators.compose([Validators.required])],
      PolicyNumber: ['', Validators.compose([Validators.required])],
      InsuranceId: ['', Validators.compose([Validators.required])],

    })
  }

  async onFetchInitailData() {
    this.companyList = await this.onGetCompanyList() || [];
    this.getMobileCodeList();
    console.log(this.companyList);
    this.filteredCompany = this.PolicySearchForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value)),
    );
    this.filteredCompanyPlate = this.PlateSearchForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value)),
    );

  }

  private _filter(value: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return this.companyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));

  }

  insuranceCompyText = (option: any) => {
    if (!option) return '';
    let index = this.companyList.findIndex((make: any) => make.Code == option);
    console.log(this.companyList[index].CodeDesc)
    return this.companyList[index].CodeDesc;
  }

  onChangeCompany(val: any) {
    this.insuranceId = val;
    console.log(val);


  }

  getMobileCodeList(){
    let UrlLink = `${this.ApiUrl}basicauth/mobilecode`;
    return this._dataService.onGetMethodSyncBasicToken(UrlLink).subscribe((data: any) => {
      if(data != null){
        this.MobileCodeList = data;
      }
    }, (err) => {
      this.handleError(err);
    })
  }

  async onGetCompanyList() {
    let UrlLink = `basicauth/insurancecompanies`;
    let response = (await this._dataService.onGetMethodAsyncBasicToken(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  onRedirectClaim(type){
    if(type=='check'){
      sessionStorage.setItem('checkClaim','true');
      this.router.navigate(['/Login/ClaimIntimate']);
    }
  }
  submitPlateSearch() {

    let plateNumber = this.PlateSearchForm.controls['PlateNumber'].value;
    let mobileNumber = this.PlateSearchForm.controls['MobileNo'].value
    let reqObj = {
      "PlateNo": plateNumber,
      "MoblieNo": mobileNumber,
      "InsuranceId": this.insuranceId
    }
    let url = `${this.ApiUrl}basicauth/get/plateOtpDetail`;
    try {
      this.PolicySearchForm.controls['PolicyNumber'].setValue('');
      this._dataService.onPostMethodSyncBasicToken(url, reqObj).subscribe((data: any) => {
        console.log("Plate Search Response", data)
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

          if (data.Response == 'Success') {
            this.searchSection = false;
            this.otpSection = true;
            this.otpGenerated = null;
            this.OtpBtnTime = '';
            this.policyHolderName = data?.PolicyHolder;
            this.generateOtp();
            sessionStorage.setItem("RegNumber", plateNumber);
            sessionStorage.removeItem('SearchValue');

          }
          console.log("Search Success", data);
        }
      }, (err) => {
        this.handleError(err);
      })
    } catch (error) {

    }
  }
  generateOtp() {
    
    let plateNumber = this.PlateSearchForm.controls['PlateNumber'].value;
    let policyNumber = this.PolicySearchForm.controls['PolicyNumber'].value;
    let searchValue = "";
    let mobileCode = ""; let mobileNumber = "";
    if (policyNumber != "") {
      searchValue = policyNumber;
      mobileCode = this.PolicySearchForm.controls['MobileCode'].value;
      mobileNumber = this.PolicySearchForm.controls['MobileNo'].value;
    }
    else if (plateNumber != "") {
      searchValue = plateNumber;
      mobileCode = this.PlateSearchForm.controls['MobileCode'].value;
      mobileNumber = this.PlateSearchForm.controls['MobileNo'].value;
    }
    let token = sessionStorage.getItem('UserToken');
    let reqObj = {
      "Code": mobileCode,
      "Emailid": "",
      "InsuranceId": this.insuranceId,
      "Mobileno": mobileNumber,
      "Referenceno": searchValue,
      "PolicyHolder":this.policyHolderName,
      "Whatsappno": ""
    }
    console.log("GetOtp Req Details", reqObj);
    let url = `${this.DocApiUrl}post/notification/getotp`;
    try {
      this._dataService.onPostMethodSyncBasicToken(url, reqObj).subscribe((data: any) => {
        if (data.Errors) {
          this.searchSection = true;
          this.otpSection = false;
          this.otpGenerated = null;
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

          console.log("Otp Generate Success", data);
          this.otpId = data.OTPValidationStatus;
          this.otpGenerated = data.OTP;
          this.searchSection = false;
          this.otpSection = true;
          this.OtpBtnEnable = true;
          this.setTimeInterval();
        }
      }, (err) => {
        this.handleError(err);
        console.log(err);
      })
    } catch (error) {
    }
  }
  regenerateOtp() {
    if (this.otpId != "" || this.otpId != undefined || this.otpId != null) {

      let plateNumber = this.PlateSearchForm.controls['PlateNumber'].value;
      let policyNumber = this.PolicySearchForm.controls['PolicyNumber'].value;
      let searchValue = "";
      let mobileCode = ""; let mobileNumber = "";
      if (policyNumber != "") {
        searchValue = policyNumber;
        mobileCode = this.PolicySearchForm.controls['MobileCode'].value;
        mobileNumber = this.PolicySearchForm.controls['MobileNo'].value;
      }
      else if (plateNumber != "") {
        searchValue = plateNumber;
        mobileCode = this.PlateSearchForm.controls['MobileCode'].value;
        mobileNumber = this.PlateSearchForm.controls['MobileNo'].value;
      }
      let token = sessionStorage.getItem('UserToken');
      let reqObj = {
        "Code": mobileCode,
        "Emailid": "",
        "InsuranceId": this.insuranceId,
        "Mobileno": mobileNumber,
        "Referenceno": searchValue,
        "Otpid": this.otpId,
        "PolicyHolder":this.policyHolderName,
        "Whatsappno": ""
      }
      let url = `${this.DocApiUrl}post/notification/getotp`;
      try {
        this._dataService.onPostMethodSyncBasicToken(url, reqObj).subscribe((data: any) => {
          if (data?.Errors) {
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

            console.log("Otp Generate Success", data);
            this.otpId = data.OTPValidationStatus;
            this.otpGenerated = data.OTP;
            this.OtpBtnEnable = true;
            this.setTimeInterval();
          }
        }, (err) => {
          this.handleError(err);
        })
      } catch (error) {

      }
    }
  }
  onOtpValidate() {

    if (this.otpValue == "" || this.otpValue == undefined || this.otpValue == null) {
      let element = '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>Please Enter OTP</div>';
      Swal.fire(
        'Please Fill Valid Value',
        `${element}`,
        'error',
      )
    }
    else {
      let plateNumber = this.PlateSearchForm.controls['PlateNumber'].value;
      let policyNumber = this.PolicySearchForm.controls['PolicyNumber'].value;
      let searchValue = "";
      let mobileCode = ""; let mobileNumber = "";
      if (policyNumber != "") {
        searchValue = policyNumber;
        mobileCode = this.PolicySearchForm.controls['MobileCode'].value;
        mobileNumber = this.PolicySearchForm.controls['MobileNo'].value;
      }
      else if (plateNumber != "") {
        searchValue = plateNumber;
        mobileCode = this.PlateSearchForm.controls['MobileCode'].value;
        mobileNumber = this.PlateSearchForm.controls['MobileNo'].value;
      }
      if (!this.assuredName) {
        this.assuredName = "";
      }
      this.otpValue = this.otpValue.replace(/\D/g, '');
      let reqObj = {
        "Referenceno": mobileCode + mobileNumber,
        "Otpid": this.otpId,
        "Otp": this.otpValue,
        "InsuranceId": this.insuranceId,
        "QuotationPolicyNo": this.PolicySearchForm.controls['PolicyNumber'].value,
        "RegNo": this.PlateSearchForm.controls['PlateNumber'].value
      }
      let url = `${this.DocApiUrl}post/notification/validateotp`;
      try {
        this._dataService.onPostMethodSyncBasicToken(url, reqObj).subscribe((data: any) => {
          console.log("Otp Generate", data);
          if (data) {
            if (data.Errors) {
              console.log("Otp ", data.Errors);
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


              this.otpId = "";
              this.otpValue = "";
              this.onGetUserLogin(data)
              Swal.fire(
                'Success',
                `Otp Validated Successfully`,
                'success',
              )
            }
          }
        }, (err) => {
          this.handleError(err);
        })
      } catch (error) {
      }
    }
  }
  setTimeInterval() {

    var count = 15,
      timer = setInterval(() => {
        var seconds = (count--) - 1;
        var percent_complete = (seconds / 60) * 100;
        percent_complete = Math.floor(percent_complete);

        this.OtpBtnTime = count;
        if (seconds == 0) {
          clearInterval(timer);
          this.OtpBtnEnable = false;
          this.OtpBtnTime = '';
        }
      }, 1000);
  }

  submitPolicySearch() {

    let policyNumber = this.PolicySearchForm.controls['PolicyNumber'].value;
    let mobileNumber = this.PolicySearchForm.controls['MobileNo'].value
    let reqObj = {
      "QuotationPolicyNo": policyNumber,
      "MoblieNo": mobileNumber,
      "InsuranceId": this.insuranceId

    }
    let url = `${this.ApiUrl}basicauth/get/policyOtpDetail`;
    try {
      this.PlateSearchForm.controls['PlateNumber'].setValue('');
      this._dataService.onPostMethodSyncBasicToken(url, reqObj).subscribe((data: any) => {
        console.log("Policy Search Response", data)
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

          if (policyNumber != "" && policyNumber != undefined && policyNumber != null) {
            sessionStorage.setItem('SearchValue', policyNumber);
          }
          console.log("Search Success", data);
          if (data.Response == 'Success') {
            sessionStorage.removeItem("RegNumber");
            if (data.AssuredName) {
              this.assuredName = data.AssuredName;
            }
            this.policyHolderName = data?.PolicyHolder;
            this.generateOtp();
          }
        }
      }, (err) => {
        this.handleError(err);
      })
    } catch (error) {

    }
  }

  onGetUserLogin(data: any) {

    let UrlLink = `authentication/login`;
    var ReqObj = {
      "LoginType": data.Usertype,
      "Password": "Admin@01",
      "UserId": data.Loginid
    }
    sessionStorage.setItem('userReq', JSON.stringify(ReqObj));
    return this._dataService.getUserLogin(UrlLink, ReqObj).subscribe((data: any) => {

      if (data.LoginResponse && data.LoginResponse.Token != null && data.LoginResponse.Token != undefined) {
        this.UserType = data.LoginResponse.UserType;
        this.loginData = data;
        sessionStorage.setItem("UserType", JSON.stringify(data.LoginResponse.UserType));
        sessionStorage.setItem('UserToken', data.LoginResponse.Token);
        sessionStorage.setItem("Userdetails", JSON.stringify(data));
        this._dataService.UserToken(data.LoginResponse.Token);
        this.authService.login(data);
        console.log("Login Res", data)
        if (this.UserType) {
          this.policyNumber = sessionStorage.getItem("SearchValue");
          this.regNumber = sessionStorage.getItem("RegNumber");
          if (this.policyNumber != null) {
            this.onPolicySearchExist('Policy');
          }
          if (this.regNumber != null) {
            this.onPolicySearchExist('Registration');

          }
        }
      }
      if (data.Errors) {
        console.log(data.Errors)
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

    }, (err) => {
      this.handleError(err);
    })
  }

  onPolicySearchExist(SearchType) {

    let ReqObj = {};
    let UrlLink = '';

    if (SearchType == 'Policy') {
      ReqObj = {
        "EndtNo": "",
        "QuotationPolicyNo": this.policyNumber,
        "BranchCode": this.loginData?.LoginResponse?.BranchCode,
        "InsuranceId": this.loginData?.LoginResponse?.InsuranceId,
        "RegionCode": this.loginData?.LoginResponse?.RegionCode,
        "CreatedBy": this.loginData?.LoginResponse?.LoginId
      }
      UrlLink = `api/get/policyDetails`;
    }
    if (SearchType == 'Registration') {
      ReqObj = {
        ChassisNo: this.regNumber,
        "InsuranceId": this.loginData?.LoginResponse?.InsuranceId,

      }
      UrlLink = `api/get/policydetailsbyregno`;
    }

    try {
      this._dataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {
        console.log("Policy Search Response", data)
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

          if (data) {
            if (data.length != 0) {
              sessionStorage.setItem('SearchValue', this.policyNumber);
              sessionStorage.removeItem('editClaimId');
              if (data.length == 1) {
                sessionStorage.setItem('chassisNo', data[0].VehicleInfo.ChassisNo);
                sessionStorage.setItem('productNo', data[0].PolicyInfo.Product);
                sessionStorage.setItem('SearchValue', data[0].PolicyInfo.PolicyNo);
                sessionStorage.setItem('newproductid', data[0].PolicyInfo.ProductCode);
                sessionStorage.removeItem('editClaimId');
                this.router.navigate(['./Home/Claimforms']);
              }
              else {
                this.router.navigate(['./Home/ClaimIntimate'])

              }
            }
          }
        }

      }, (err) => {

        this.handleError(err);
      })
    } catch (error) {

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
