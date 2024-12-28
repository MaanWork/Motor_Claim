import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import *  as  Mydatas from '../../../appConfig.json';
import { Observable, map, startWith } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-policy-search-details',
  templateUrl: './policy-search-details.component.html',
  styleUrls: ['./policy-search-details.component.scss']
})
export class PolicySearchDetailsComponent {

  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public DocApiUrl: any = this.MotorClaim.DocApiUrl;

  public filteredCompany: Observable<any[]> | undefined;
  public filteredCompanyPlate: Observable<any[]> | undefined
   companyList: any[]=[];
  public insuranceId: any;

  public policyNumber: any;
  public regNumber: any;
  searchSection: boolean;
  otpSection: boolean;
  MobileCodeList: any[]=[];
  PlateSearchForm: any;
  PolicySearchForm: any;
  OtpBtnTime: any;
  otpId: any; otpValue: any = "";
  OtpBtnEnable: boolean = false;
  userType: any;
  loginData: any;
  assuredName: any;
  UserType:any;
  otpGenerated: any;
  checkClaimSection: boolean=false;
  policyHolderName: any;
  emailId: any;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorService,
    public _dataService: CommondataService,
  ) {
    this.searchSection = true;
    this.otpSection = false;
    this.otpGenerated = null;
    let entry = sessionStorage.getItem('checkClaim');
    if(entry) this.checkClaimSection = true;
    else this.checkClaimSection = false;
  }
  ngOnInit(): void {
    this.createFromControl();
    this.onFetchInitailData();
    this.loginData = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    this.insuranceId = this.loginData?.LoginResponse.InsuranceId;
    
  }
  async onFetchInitailData() {
    this.onGetCompanyList() ;
     //this.onGetCompanyList();
    console.log("Company list",this.companyList)
    this.getMobileCodeList();
    console.log(this.companyList);
  }
  private _filter(value: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return this.companyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));

  }

  createFromControl() {
    this.PlateSearchForm = this.formBuilder.group({
      MobileNo: ['', Validators.compose([Validators.required])],
      MobileCode: ['', Validators.compose([Validators.required])],
      PlateNumber: ['', Validators.compose([Validators.required])],
      InsuranceId: ['', Validators.compose([Validators.required])],
      EmailId : ['', Validators.compose([Validators.required])],
    })
    this.PolicySearchForm = this.formBuilder.group({
      MobileNo: ['', Validators.compose([Validators.required])],
      MobileCode: ['', Validators.compose([Validators.required])],
      PolicyNumber: ['', Validators.compose([Validators.required])],
      InsuranceId: ['', Validators.compose([Validators.required])],
      EmailId : ['', Validators.compose([Validators.required])],
    })
  }
  // async onGetCompanyList() {
  //   let UrlLink = `basicauth/insurancecompanies`;
  //   (await this._dataService.onGetMethodAsyncBasicToken(UrlLink)).subscribe(
  //     (data: any) => {
  //       if(data) this.companyList =  data;
  //       console.log('JJJJJJJJJJJ',this.companyList)
  //     },
  //     (err:any) => { },
  //   );
  //   // let response = (await this._dataService.onGetMethodAsyncBasicToken(UrlLink)).toPromise()
  //   //   .then(res => {
  //   //     console.log("Response Received",res)
  //   //     if(res) this.companyList =  res;
  //   //   })
  //   //   .catch((err) => {
  //   //     this.handleError(err)
  //   //   });
  //   // return response;
  // }

  onRedirectClaim(type){
    if(type=='check'){
      sessionStorage.setItem('checkClaim','true');
      window.location.reload();
    }
  }
  async onGetCompanyList() {
    let UrlLink = `basicauth/insurancecompanies`;
    let response = (await this._dataService.onGetMethodAsyncBasicToken(UrlLink)).subscribe((data:any)=>
      {
        this.companyList =  data;
        if(this.companyList.length!=0){
          let entry = this.companyList.find(ele=>ele.Code=='100003');
          if(entry) {
            this.PolicySearchForm.controls['InsuranceId'].setValue(entry.Code);
            this.PlateSearchForm.controls['InsuranceId'].setValue(entry.Code);
            this._filter(this.PolicySearchForm.controls['InsuranceId'].value);
            this.onChangeCompany(this.PolicySearchForm.controls['InsuranceId'].value);
          }
        }
        this.filteredCompany = this.PolicySearchForm.controls['InsuranceId'].valueChanges.pipe(
          startWith(''),
          map((value: any) => this._filter(value)),
        );
        this.filteredCompanyPlate = this.PlateSearchForm.controls['InsuranceId'].valueChanges.pipe(
          startWith(''),
          map((value: any) => this._filter(value)),
        );
      },
      (err) => {
        this.handleError(err)
      });
    return response;
  }
  getMobileCodeList(){
    let UrlLink = `${this.ApiUrl}basicauth/mobilecode`;
    return this._dataService.onGetMethodSyncBasicToken(UrlLink).subscribe((data: any) => {
      if(data != null){
        this.MobileCodeList = data;
        if(this.MobileCodeList.length!=0){
          let entry = this.MobileCodeList.find(ele=>ele.Code=='2');
          if(entry){
            this.PolicySearchForm.controls['MobileCode'].setValue(entry.Code);
            this.PlateSearchForm.controls['MobileCode'].setValue(entry.Code);
          } 
        }
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  onChangeCompany(val: any) {
    this.insuranceId = val;
    console.log(val);


  }
  insuranceCompyText = (option: any) => {
    if (!option) return '';
    let index = this.companyList.findIndex((make: any) => make.Code == option);
    console.log(this.companyList[index].CodeDesc)
    return this.companyList[index].CodeDesc;
  }
  submitPolicySearch() {

    let policyNumber = this.PolicySearchForm.controls['PolicyNumber'].value;
    let mobileNumber = this.PolicySearchForm.controls['MobileNo'].value;
    this.emailId =  this.PolicySearchForm.controls['EmailId'].value;
    let reqObj = {
      "QuotationPolicyNo": policyNumber,
      "MoblieNo": mobileNumber,
      "InsuranceId": this.insuranceId

    }
    let url = `${this.ApiUrl}basicauth/get/policyOtpDetail`;
    try {
      this.PlateSearchForm.controls['PlateNumber'].setValue('');
      console.log("Req",reqObj)
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
  submitPlateSearch() {

    let plateNumber = this.PlateSearchForm.controls['PlateNumber'].value;
    let mobileNumber = this.PlateSearchForm.controls['MobileNo'].value
    this.emailId =  this.PlateSearchForm.controls['EmailId'].value;
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
      "Emailid": this.emailId,
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
        console.log("Otp Generate Res", data);
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
              // Swal.fire(
              //   'Success',
              //   `Otp Validated Successfully`,
              //   'success',
              // )
            }
          }
        }, (err) => {
          this.handleError(err);
        })
      } catch (error) {
      }
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
  onPolicySearchExist(SearchType:any) {

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
              let mobileCode=null,mobileNumber=null;
              let plateNumber = this.PlateSearchForm.controls['PlateNumber'].value;
              let policyNumber = this.PolicySearchForm.controls['PolicyNumber'].value;
              if (policyNumber != "") {
                mobileCode = this.PolicySearchForm.controls['MobileCode'].value;
                mobileNumber = this.PolicySearchForm.controls['MobileNo'].value;
              }
              else if (plateNumber != "") {
                mobileCode = this.PlateSearchForm.controls['MobileCode'].value;
                mobileNumber = this.PlateSearchForm.controls['MobileNo'].value;
              }
              sessionStorage.setItem('mobileNo',mobileNumber)
              if (data.length == 1) {
                sessionStorage.setItem('chassisNo', data[0].VehicleInfo.ChassisNo);
                sessionStorage.setItem('productNo', data[0].PolicyInfo.Product);
                sessionStorage.setItem('SearchValue', data[0].PolicyInfo.PolicyNo);
                sessionStorage.removeItem('editClaimId');
                this.router.navigate(['Login/IntimatedList']);
                //this.router.navigate(['./claimIntimate']);
              }
              else {
                sessionStorage.setItem('SearchValue', data[0].PolicyInfo.PolicyNo);
                this.router.navigate(['Login/IntimatedList']);
                //this.router.navigate(['./claimIntimate']);

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
  onActionHandler(action) {
    console.log("Event Received Is ", action);
    if (action.event.checked == true) {
      sessionStorage.setItem('chassisNo', action.element.VehicleInfo.ChassisNo);
      sessionStorage.setItem('productNo', action.element.PolicyInfo.Product);
      sessionStorage.setItem('SearchValue', this.policyNumber);
      let mobileCode = ""; let mobileNumber = "";
      let plateNumber = this.PlateSearchForm.controls['PlateNumber'].value;
      let policyNumber = this.PolicySearchForm.controls['PolicyNumber'].value;
    if (policyNumber != "") {
      mobileCode = this.PolicySearchForm.controls['MobileCode'].value;
      mobileNumber = this.PolicySearchForm.controls['MobileNo'].value;
    }
    else if (plateNumber != "") {
      mobileCode = this.PlateSearchForm.controls['MobileCode'].value;
      mobileNumber = this.PlateSearchForm.controls['MobileNo'].value;
    }
    sessionStorage.setItem('mobileNo',mobileNumber)
      sessionStorage.removeItem('editClaimId');
      this.router.navigate(['./intimateDetails']);
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
  onLogOut(){
    sessionStorage.clear();
    this.router.navigate(['/Home'])
  }
  handleError(error:any) {
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
