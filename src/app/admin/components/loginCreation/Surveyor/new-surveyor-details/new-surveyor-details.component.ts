import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { FormBuilder, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-surveyor-details',
  templateUrl: './new-surveyor-details.component.html',
  styleUrls: ['./new-surveyor-details.component.css']
})
export class NewSurveyorDetailsComponent implements OnInit {

  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredRegionList: Observable<any[]>;
  filteredBranchList: Observable<any[]>;
  filteredStateList: Observable<any[]>;minDate:Date;
  logindata:any;SurveyorInsForm: any;SurveyorForm:any;
  RegionList:any;BranchList:any;loginSection:boolean = false;
  InsuranceCmpyList:any;public ChangePassword: any = 'N';InsertMode:any;
  public NewPassword: any; insuranceName: any;effectiveValue:any;
  public ReNewPassword: any;SurveyorStatus:any;stateList:any;
  InsuCode: string;InsuGridCode:any;
  RegionCode: string;
  BranchCode: string;SurveyorId:any;
  OaCode: any;loginId:any;
  SurveyorEditDetails: any;
  mode: string;
  garageIdss: any;
  constructor(
    private router:Router,
    private datePipe:DatePipe,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder
  ) {
    this.minDate = new Date();
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    
    
   }

  ngOnInit(): void {
    
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.SurveyorInsForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
    this.mode=sessionStorage.getItem('AddSur');
   
  }
  onCreateFormControl() {
    this.SurveyorForm = this.formBuilder.group({
      Username: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      LoginId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      CoreLoginId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      UserMail: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      ContactPersonName: [{ value: '', disabled: false }],
      CoreAppCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RegulatoryCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      MobileNumber: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      TaxExemptedYn: [{ value: 'Y', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Status: [{ value: 'Y', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Password: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RePassword: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      SurveyorAddress: [{ value: '', disabled: false }],
      SurveyorLicenseNo: [{ value: '', disabled: false }],
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RegionCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      BranchCode: [[], [Validators.required]],
      CityName: [{ value: '', disabled: false }],
      CountryId: [{ value: '', disabled: false }],
      Remarks: [{ value: '', disabled: false }], 
      StateId: [{ value: '', disabled: false }],
      StateName: [{ value: '', disabled: false }],
      WilayatId: [{ value: '1', disabled: false }],
      WilayatName: [{ value: '', disabled: false }],
      //oaCode:[{ value: '', disabled: false }]
    })
  }
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    let insVal = this.InsuranceCmpyList.find(ele=>ele.Code==this.logindata.InsuranceId);
    this.insuranceName = insVal?.CodeDesc;
    this.onChangeCompanyGridList(this.logindata.InsuranceId);
    this.filteredInsuranceComp = this.SurveyorForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance')),
    );
    this.filteredInsurance = this.SurveyorInsForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,'insurance2')),
    );
    let SurveyorObj = JSON.parse(sessionStorage.getItem('editSurveyorObj'));
    if(SurveyorObj){
      this.loginId = SurveyorObj?.LoginId;
      this.SurveyorId = SurveyorObj?.SurveyorId;
      let SurveyorStatus = sessionStorage.getItem('SurveyorStatus');
      if(SurveyorStatus){
        this.SurveyorStatus = SurveyorStatus;
        
      }
      if(this.SurveyorId){
        this.onCreateFormControl();
        this.getEditSurveyorDetails();
      } 
    }
  }
  async onInsuranceCompanyList() {
    let UrlLink = `api/insurancecompanies`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async getEditSurveyorDetails(){
   
     this.SurveyorEditDetails = await this.onSurveyorEditDetails();
       await this.onChangeCompanyList(this.logindata.InsuranceId);
      this.SurveyorForm.controls['BranchCode'].setValue(this.SurveyorEditDetails.BranchCode);
      this.SurveyorForm.controls['Username'].setValue(this.SurveyorEditDetails.SurveyorName);
      this.SurveyorForm.controls['LoginId'].setValue(this.SurveyorEditDetails.LoginId);
      if(this.SurveyorStatus=='createLoginDetails' && this.loginId!=null){
        this.SurveyorForm.controls['LoginId'].disable();
      } 
      this.SurveyorForm.controls['LoginId'].disable();
      this.effectiveValue = this.onDateFormatInEdit(this.SurveyorEditDetails.EffectiveDate)
      this.SurveyorForm.controls['SurveyorLicenseNo'].setValue(this.SurveyorEditDetails.SurveyorLicenseNo);
      this.SurveyorForm.controls['CoreAppCode'].setValue(this.SurveyorEditDetails.CoreAppCode);
      this.SurveyorForm.controls['RegulatoryCode'].setValue(this.SurveyorEditDetails.TinNumber);
      if(this.SurveyorEditDetails.TaxExemptedYn) this.SurveyorForm.controls['TaxExemptedYn'].setValue(this.SurveyorEditDetails.TaxExemptedYn);
      else this.SurveyorForm.controls['TaxExemptedYn'].setValue('N');
      this.SurveyorForm.controls['UserMail'].setValue(this.SurveyorEditDetails.EmailId);
      this.SurveyorForm.controls['MobileNumber'].setValue(this.SurveyorEditDetails.MobileNo);
      this.SurveyorForm.controls['Status'].setValue(this.SurveyorEditDetails.Status);
      this.SurveyorForm.controls['StateId'].setValue(this.SurveyorEditDetails.StateId);
      this.SurveyorForm.controls['StateName'].setValue(this.SurveyorEditDetails.StateName);
      this.SurveyorForm.controls['ContactPersonName'].setValue(this.SurveyorEditDetails.ContactPersonName);
      this.SurveyorForm.controls['CityName'].setValue(this.SurveyorEditDetails.CityName);
       this.SurveyorForm.controls['SurveyorAddress'].setValue(this.SurveyorEditDetails.SurveyorAddress);
       this.SurveyorForm.controls['Remarks'].setValue(this.SurveyorEditDetails.Remarks);
  }
  onDateFormatInEdit(date) {
    console.log(date);
    if (date) {
      let format = date.split('-');
      if(format.length >1){
        var NewDate = new Date(new Date(format[0], format[1], format[2]));
        NewDate.setMonth(NewDate.getMonth() - 1);
        return NewDate;
      }
      else{
        format = date.split('/');
        if(format.length >1){
          var NewDate = new Date(new Date(format[2], format[1], format[0]));
          NewDate.setMonth(NewDate.getMonth() - 1);
          return NewDate;
        }
      }

    }
  }
  async onSurveyorEditDetails() {
    let UrlLink = `api/getsurveyordetailsbyid`;
    let ReqObj = {
      "InsuranceId": this.logindata.InsuranceId,
      "SurveyorId": this.SurveyorId
    }
    let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async onChangeCompanyGridList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuGridCode = insuranceCode;
      sessionStorage.setItem('loginInsCode',this.InsuGridCode);
      this.SurveyorInsForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
    }
  }
  private _filter(value: any, dropname: string): string[] {
    if(value == null){
      value='';
    }
    const filterValue = value.toLowerCase();
    if (dropname == 'insurance') {
      return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'insurance2') {
      return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'region') {
      return this.RegionList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'branch') {
      return this.BranchList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'state') {
      console.log("State List",this.stateList);
      return this.stateList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
  }
  onAddNewSurveyor() {
    this.InsuCode = '';
    this.RegionCode = '';
    this.BranchCode = '';
    this.OaCode = null;
    this.loginSection = false;
    this.InsertMode = 'Insert';
    this.onCreateFormControl();
    this.onChangeCompanyList(this.logindata.InsuranceId);
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      sessionStorage.setItem('loginInsCode',this.InsuCode);
      this.SurveyorForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      //this.RegionList = await this.onGetRegionList(this.InsuCode);
      this.BranchList = await this.onGetBrnchList(this.InsuCode);
      console.log(this.BranchList);
      this.filteredBranchList = this.SurveyorForm.controls['BranchCode'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'branch')),
      );
      this.stateList = await this.onGetStateList(this.InsuCode);
      this.filteredStateList = this.SurveyorForm.controls['StateId'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'state')),
      );
    }
  }
  async onGetStateList(InsuCode) {
    let countryCode:any="";
    if(InsuCode=='100002'){ countryCode = 'TZS'}
    else if(InsuCode=='100003'){ countryCode = 'UG'}
    this.SurveyorForm.controls['CountryId'].setValue(countryCode);
    let ReqObj = {
      CountryId: countryCode
    }
    let UrlLink = `master/dropdown/state`;
    let response = (await this.adminService.onPostMethodAsync(UrlLink,ReqObj)).toPromise()
      .then(res => {
        let data:any = res;
        return data.Result;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async onGetBrnchList(InsuCode) {
    let UrlLink = `api/branches/${InsuCode}`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {

        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  onCloseForm(){
      sessionStorage.removeItem('editSurveyorObj');
      this.router.navigate(['/Home/SurveyorLogin']);
  }
  onFormSubmit(){
        if(this.SurveyorStatus == 'editBasicDetails'){
          this.onSaveBasicDetails('basic');
          //this.SurveyorStatus=='create'
        }
        if(this.mode=='Insert'){
          let password = this.SurveyorForm.controls['Password'].value;
            let rePassword = this.SurveyorForm.controls['RePassword'].value;
            if (password == undefined || password == '' || password == null) {
              Swal.fire(
                `Please Fill Password`,
                'Invalid',
                'info'
              );
            } else if (rePassword == undefined || rePassword == '' || rePassword == null) {
              Swal.fire(
                `Please Fill Re-Password`,
                'Invalid',
                'info'
              );
            } else if (password != rePassword) {
              Swal.fire(
                `Mismatch Password`,
                'Invalid',
                'info'
              );
            }
            else{
              this.onSaveBasicDetails('loginDetails');
            }
          //this.onSaveBasicDetails('loginDetails');
          console.log('UUUUUUUUUUU',this.mode);
        }
        else{
          if(this.SurveyorStatus=='createLoginDetails' && this.loginId==null){
            let password = this.SurveyorForm.controls['Password'].value;
            let rePassword = this.SurveyorForm.controls['RePassword'].value;
            if (password == undefined || password == '' || password == null) {
              Swal.fire(
                `Please Fill Password`,
                'Invalid',
                'info'
              );
            } else if (rePassword == undefined || rePassword == '' || rePassword == null) {
              Swal.fire(
                `Please Fill Re-Password`,
                'Invalid',
                'info'
              );
            } else if (password != rePassword) {
              Swal.fire(
                `Mismatch Password`,
                'Invalid',
                'info'
              );
            }
            else{
              this.onSaveBasicDetails('loginDetails');
            }
          }
          else{
            this.onSaveBasicDetails('loginDetails');
          }
        }
  }
  onChangePassword() {
    if (this.NewPassword == undefined || this.NewPassword == '' || this.NewPassword == null) {
      Swal.fire(
        `Please Fill New Password`,
        'Invalid',
        'info'
      );
    } else if (this.ReNewPassword == undefined || this.ReNewPassword == '' || this.ReNewPassword == null) {
      Swal.fire(
        `Please Fill Re-New Password`,
        'Invalid',
        'info'
      );
    } else if (this.NewPassword != this.ReNewPassword) {
      Swal.fire(
        `Mismatch Password`,
        'Invalid',
        'info'
      );
    } else {
      let UrlLink = `authentication/updatenewpassword`;
      let ReqObj = {
        "InsuranceId": this.SurveyorEditDetails.InsuranceId,
        "Branchcode": this.SurveyorEditDetails.Branchcode,
        "Loginid": this.loginId,
        "Password": this.ReNewPassword,
      }
      return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

        if (data.Response == "Password updated Sucessfully") {
          Swal.fire(
            `${data.Response}`,
            'success',
            'success'
          );
          this.ChangePassword='N';
        }
        if (data.Errors) {
          this.errorService.showValidateError(data.Errors);
        }
      }, (err) => {
        this.handleError(err);
      })
    }

  }
  onSaveBasicDetails(type){
    console.log('HHHHHHHHHHHH',this.SurveyorForm.controls['ContactPersonName'].value)
    console.log("Login Data",this.logindata);
    let branchList = this.SurveyorForm.controls['BranchCode'].value;
    let BranchCode = "";
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    if(branchList){
      let i = 0;
      if(branchList.length!=0){
          for(let branch of branchList){
            if(i==0){
              BranchCode = branchList[0];
            }
            else{
               BranchCode = BranchCode+","+branch;
            }
            i+=1;
          }

      }
    }
    let ReqObj = {
      "BranchCode": BranchCode,
      "CheckedYN": "Y",
      "CityName": this.SurveyorForm.controls['CityName'].value,
      "CoreAppCode": this.SurveyorForm.controls['CoreAppCode'].value,
      "TinNumber": this.SurveyorForm.controls['RegulatoryCode'].value,
      "TaxExemptedYn": this.SurveyorForm.controls['TaxExemptedYn'].value,
      "EffectiveDate": effectiveDate,
      "ContactPersonName": this.SurveyorForm.controls['ContactPersonName'].value,
      "CountryId": this.SurveyorForm.controls['CountryId'].value,
      "EmailId": this.SurveyorForm.controls['UserMail'].value,
      "SurveyorAddress": this.SurveyorForm.controls['SurveyorAddress'].value,
      "SurveyorId": this.SurveyorId,
      "SurveyorLicenseNo": this.SurveyorForm.controls['SurveyorLicenseNo'].value,
      "SurveyorName": this.SurveyorForm.controls['Username'].value,
      "InsuranceId": this.logindata.InsuranceId,
      "MobileNo": this.SurveyorForm.controls['MobileNumber'].value,
      "Remarks": this.SurveyorForm.controls['Remarks'].value,
      "StateId": "100001",
      "StateName": "Ilala",
      "Status":this.SurveyorForm.controls['Status'].value,
    }
    let UrlLink = `api/surveyormasterdetails`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      // if (data.Response == "Admin Login Details Insert Sucessfully") {
      //   Swal.fire(
      //     `Claim Updated Successfully`,
      //     'success',
      //     'success'
      //   );
      // }
      // if (data.Response == "Admin Login Details Update Sucessfully") {
      //   Swal.fire(
      //     `Claim Created Successfully`,
      //     'success',
      //     'success'
      //   );
      // }
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element: any = data.Errors[index];
          this.SurveyorForm.controls[element.Field].setErrors({ message: element.Message });

        }

      }
      else{
        if(type=='basic'){
          Swal.fire(
            `Surveyor Details Updated Successfully`,
            'success',
            'success'
          );
          this.router.navigate(['/Home/SurveyorLogin']);
        }
        else{
          this.garageIdss=data?.SurveyorId;
          this.saveLoginDetails(BranchCode)
        }
      }


    }, (err) => {
      this.handleError(err);
    })
  }
  saveLoginDetails(branchValue){
    this.SurveyorForm.controls['LoginId'].enable();
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }

    let surveyor;
    if(this.SurveyorId==null){
      surveyor=this.garageIdss;
    }
    else{
     surveyor=this.SurveyorId;
    }
    let ReqObj = {
      "Branchcode": branchValue,
      "Createdby": "admin",
      "InsuranceId": this.logindata.InsuranceId,
      "Loginid": this.SurveyorForm.controls['LoginId'].value,
      "Mobilenumber": this.SurveyorForm.controls['MobileNumber'].value,
      "Oacode":surveyor,
      "EffectiveDate": effectiveDate,
      "Password":this.SurveyorForm.controls['Password'].value,
      "Status": this.SurveyorForm.controls['Status'].value,
      "Usermail": this.SurveyorForm.controls['UserMail'].value,
      "Username": this.SurveyorForm.controls['Username'].value,
      "Usertype": "surveyor"
      }
      let UrlLink = `authentication/surveyorlogininsert`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element: any = data.Errors[index];
          this.SurveyorForm.controls[element.Field].setErrors({ message: element.Message });
        }
      }
      else{
          Swal.fire(
            `Surveyor Details Updated Successfully`,
            'success',
            'success'
          );
          this.router.navigate(['/Home/SurveyorLogin']);
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
