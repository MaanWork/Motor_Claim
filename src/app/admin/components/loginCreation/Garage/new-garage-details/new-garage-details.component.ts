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
  selector: 'app-new-garage-details',
  templateUrl: './new-garage-details.component.html',
  styleUrls: ['./new-garage-details.component.css']
})
export class NewGarageDetailsComponent implements OnInit {

  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredRegionList: Observable<any[]>;
  filteredBranchList: Observable<any[]>;
  filteredStateList: Observable<any[]>;minDate:Date;
  logindata:any;garageInsForm: any;garageForm:any;
  RegionList:any;BranchList:any;loginSection:boolean = false;
  InsuranceCmpyList:any;public ChangePassword: any = 'N';InsertMode:any;
  public NewPassword: any; insuranceName: any;effectiveValue:any;
  public ReNewPassword: any;garageStatus:any;stateList:any;
  InsuCode: string;InsuGridCode:any;
  RegionCode: string;
  BranchCode: string;garageId:any;
  OaCode: any;loginId:any;
  GarageEditDetails: any;
  mode: any;
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
    this.garageInsForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]

    });
    this.mode=sessionStorage.getItem('ADDItem');
   
  }
  onCreateFormControl() {
    this.garageForm = this.formBuilder.group({
      Username: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      LoginId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      CoreLoginId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      UserMail: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      ContactPersonName: [{ value: '', disabled: false }],
      CoreAppCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RegulatoryCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      MobileNumber: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Status: [{ value: 'Y', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Password: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RePassword: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      GarageAddress: [{ value: '', disabled: false }],
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
      TaxExemptedYn: [{ value: 'N', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      //oaCode:[{ value: '', disabled: false }]
    })
  }
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    let insVal = this.InsuranceCmpyList.find(ele=>ele.Code==this.logindata.InsuranceId);
    this.insuranceName = insVal?.CodeDesc;
    this.onChangeCompanyGridList(this.logindata.InsuranceId);
    this.filteredInsuranceComp = this.garageForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance')),
    );
    this.filteredInsurance = this.garageInsForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,'insurance2')),
    );
    let garageObj = JSON.parse(sessionStorage.getItem('editGarageObj'));
    if(garageObj){
      this.loginId = garageObj?.LoginId;
      this.garageId = garageObj?.GarageId;
      let garageStatus = sessionStorage.getItem('garageStatus');
      if(garageStatus){
        this.garageStatus = garageStatus;
        
      }
      if(this.garageId){
        this.onCreateFormControl();
        this.getEditGarageDetails();
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
  async getEditGarageDetails(){
   
     this.GarageEditDetails = await this.onGarageEditDetails();
       await this.onChangeCompanyList(this.logindata.InsuranceId);
      this.garageForm.controls['BranchCode'].setValue(this.GarageEditDetails.BranchCode);
      this.garageForm.controls['Username'].setValue(this.GarageEditDetails.GarageName);
      this.garageForm.controls['LoginId'].setValue(this.GarageEditDetails.LoginId);
      if(this.garageStatus=='createLoginDetails' && this.loginId!=null){
        this.garageForm.controls['LoginId'].disable();
      } 
      this.garageForm.controls['LoginId'].disable();
      this.effectiveValue = this.onDateFormatInEdit(this.GarageEditDetails.EffectiveDate)
      this.garageForm.controls['CoreAppCode'].setValue(this.GarageEditDetails.CoreAppCode);
      this.garageForm.controls['RegulatoryCode'].setValue(this.GarageEditDetails.TinNumber);
      if(this.GarageEditDetails.TaxExemptedYn!=null) this.garageForm.controls['TaxExemptedYn'].setValue(this.GarageEditDetails.TaxExemptedYn);
      else this.garageForm.controls['TaxExemptedYn'].setValue('N');
      this.garageForm.controls['UserMail'].setValue(this.GarageEditDetails.EmailId);
      this.garageForm.controls['MobileNumber'].setValue(this.GarageEditDetails.MobileNo);
      this.garageForm.controls['Status'].setValue(this.GarageEditDetails.Status);
      this.garageForm.controls['StateId'].setValue(this.GarageEditDetails.StateId);
      this.garageForm.controls['StateName'].setValue(this.GarageEditDetails.StateName);
      this.garageForm.controls['ContactPersonName'].setValue(this.GarageEditDetails.ContactPersonName);
      this.garageForm.controls['CityName'].setValue(this.GarageEditDetails.CityName);
       this.garageForm.controls['GarageAddress'].setValue(this.GarageEditDetails.GarageAddress);
       this.garageForm.controls['Remarks'].setValue(this.GarageEditDetails.Remarks);
       //this.garageForm.controls['oaCode'].setValue(this.garageId);
  }
  onDateFormatInEdit(date) {
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
  async onGarageEditDetails() {
    let UrlLink = `api/garagedetailsbyid`;
    let ReqObj = {
      "InsuranceId": this.logindata.InsuranceId,
      "GarageId": this.garageId
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
      this.garageInsForm.controls['InsuranceId'].setValue(Code.CodeDesc);
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
      this.garageForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      //this.RegionList = await this.onGetRegionList(this.InsuCode);
      this.BranchList = await this.onGetBrnchList(this.InsuCode);
      console.log(this.BranchList);
      this.filteredBranchList = this.garageForm.controls['BranchCode'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'branch')),
      );
      this.stateList = await this.onGetStateList(this.InsuCode);
      this.filteredStateList = this.garageForm.controls['StateId'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'state')),
      );
    }
  }
  async onGetStateList(InsuCode) {
    let countryCode:any="";
    if(InsuCode=='100002'){ countryCode = 'TZS'}
    else if(InsuCode=='100003'){ countryCode = 'UG'}
    this.garageForm.controls['CountryId'].setValue(countryCode);
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
      sessionStorage.removeItem('editGarageObj');
      this.router.navigate(['/Home/GarageLogin']);
  }
  onFormSubmit(){
        if(this.garageStatus == 'editBasicDetails'){
          //this.garageStatus=='create' || 
          this.onSaveBasicDetails('basic');
          
        }
        if(this.mode=='Insert'){
          let password = this.garageForm.controls['Password'].value;
            let rePassword = this.garageForm.controls['RePassword'].value;
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
          
          console.log('UUUUUUUUUUU',this.mode);
        }
        else{
          if(this.garageStatus=='createLoginDetails' && this.loginId==null){
            let password = this.garageForm.controls['Password'].value;
            let rePassword = this.garageForm.controls['RePassword'].value;
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
            console.log('DDDDDDDDDDD',this.mode);
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
        "InsuranceId": this.GarageEditDetails.InsuranceId,
        "Branchcode": this.GarageEditDetails.Branchcode,
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
    console.log("Login Data",this.logindata);
    let branchList = this.garageForm.controls['BranchCode'].value;
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
      "CityName": this.garageForm.controls['CityName'].value,
      "CoreAppCode": this.garageForm.controls['CoreAppCode'].value,
      "TinNumber": this.garageForm.controls['RegulatoryCode'].value,
      "TaxExemptedYn": this.garageForm.controls['TaxExemptedYn'].value,
      "EffectiveDate": effectiveDate,
      "ContactPersonName": this.garageForm.controls['ContactPersonName'].value,
      "CountryId": this.garageForm.controls['CountryId'].value,
      "EmailId": this.garageForm.controls['UserMail'].value,
      "GarageAddress": this.garageForm.controls['GarageAddress'].value,
      "GarageId": this.garageId,
      "GarageName": this.garageForm.controls['Username'].value,
      "InsuranceId": this.logindata.InsuranceId,
      "MobileNo": this.garageForm.controls['MobileNumber'].value,
      "Remarks": this.garageForm.controls['Remarks'].value,
      "StateId": "100001",
      "StateName": "Ilala",
      "Status":this.garageForm.controls['Status'].value,
    }
    let UrlLink = `api/garagemasterdetail`;
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
          this.garageForm.controls[element.Field].setErrors({ message: element.Message });

        }

      }
      else{
        if(type=='basic'){
          Swal.fire(
            `Garage Details Updated Successfully`,
            'success',
            'success'
          );
          this.router.navigate(['/Home/GarageLogin']);
        }
        else{
          console.log('JJJJJJJJJJ',data.GarageId)
          this.garageIdss=data?.GarageId;
          this.saveLoginDetails(BranchCode)
        }
      }


    }, (err) => {
      this.handleError(err);
    })
  }
  saveLoginDetails(branchValue){
    console.log("DDDDDDDDDDDDDDDDDDD",this.logindata);
    this.garageForm.controls['LoginId'].enable();
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }

    let garage;
     //console.log('PPPPPPPPPPPP',this.garageForm.controls['oaCode'].value)
    if(this.garageId==null){
      garage=this.garageIdss;
    }
    else{
     garage=this.garageId
    }
    let ReqObj = {
      "Branchcode": branchValue,
      "Createdby": "admin",
      "InsuranceId": this.logindata.InsuranceId,
      "Loginid": this.garageForm.controls['LoginId'].value,
      "EffectiveDate": effectiveDate,
      "Mobilenumber": this.garageForm.controls['MobileNumber'].value,
      "Oacode":garage,
      "Password":this.garageForm.controls['Password'].value,
      "Status": this.garageForm.controls['Status'].value,
      "Usermail": this.garageForm.controls['UserMail'].value,
      "Username": this.garageForm.controls['Username'].value,
      "Usertype": "garage"
      }
      let UrlLink = `authentication/garagelogininsert`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element: any = data.Errors[index];
          this.garageForm.controls[element.Field].setErrors({ message: element.Message });

        }

      }
      else{
          Swal.fire(
            `Garage Details Updated Successfully`,
            'success',
            'success'
          );
          this.router.navigate(['/Home/GarageLogin']);
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
