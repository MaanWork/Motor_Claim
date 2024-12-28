import { CommondataService } from './../../shared/services/commondata.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import Swal from 'sweetalert2';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { Location } from '@angular/common'
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;
  userType: any="";
  loginData: any;
  branchCode: any='';
  InsuranceList: any[]=[];
  InsuranceValue:any="100002";public filteredCompany: Observable<any[]>;
  constructor(
    private commondataService: CommondataService,
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private errorService:ErrorService,
    private location: Location,
  ) {

    
   }

  async ngOnInit() {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      loginType:['claimofficer',Validators.required],
      InsuranceId: ['', Validators.required],
    });
    let reqObj = JSON.parse(sessionStorage.getItem('changePassObj'));
    if(reqObj){
      console.log("Change Pass Obj",reqObj);
      this.form.controls['userName'].setValue(reqObj.UserId);
      this.form.controls['loginType'].setValue(reqObj.LoginType);
      this.InsuranceValue = reqObj.InsuranceId;
      //this.form.controls['oldPassword'].setValue(reqObj.Password);
    }
    this.InsuranceList = await this.getInsuranceList() || [];
    this.filteredCompany = this.form.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value)),
    );
    if(this.InsuranceList.length!=0){
      let entry = this.InsuranceList.find(ele=>ele.Code=='100003');
      if(entry) this.form.controls['InsuranceId'].setValue(entry.Code);
    }
  }
  private _filter(value: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return this.InsuranceList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));

  }
  async getInsuranceList(){
    let UrlLink = `basicauth/insurancecompanies`;
    let response = (await this.commondataService.onGetMethodAsyncBasicToken(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  onChangeCompany(val: any) {
    this.InsuranceValue = val;
    console.log(val);


  }
  onSubmit() {



    if (this.form.valid) {

      let UrlLink = `authentication/login`;
      var ReqObj = {
        // "BranchCode": "01",
        "InsuranceId": this.form.get('InsuranceId').value,
        "LoginType": this.form.get('loginType').value,
        "Password": this.form.get('oldPassword').value,

        // "RegionCode": "01",
        "UserId": this.form.get('userName').value
      }
      console.log(ReqObj);
      sessionStorage.setItem('userReq',JSON.stringify(ReqObj));
      return this.commondataService.getUserLogin(UrlLink, ReqObj).subscribe((data: any) => {

       console.log("Response For Login",data)
        if (data.LoginResponse && data.LoginResponse.Token != null && data.LoginResponse.Token != undefined) {
          this.userType = data.LoginResponse.UserType;
          this.branchCode = data.LoginResponse.BranchCode;
          sessionStorage.setItem('UserType', data.LoginResponse.UserType);
          sessionStorage.setItem('UserToken', data.LoginResponse.Token);
          sessionStorage.setItem("Userdetails", JSON.stringify(data));
          this.loginData=data;
          this.commondataService.UserToken(data.LoginResponse.Token);
          this.authService.login(data);
          if(this.userType){
            this.getChangePassword();
          }
        }
        if(data.Errors){
          console.log(data.Errors)
          let element='';
           for (let i = 0; i < data.Errors.length; i++) {
              element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>'+data.Errors[i].Message+"</div>";

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

  }
  insuranceCompyText = (option: any) => {
    if (!option) return '';
    let index = this.InsuranceList.findIndex((make: any) => make.Code == option);
    console.log(this.InsuranceList[index].CodeDesc)
    return this.InsuranceList[index].CodeDesc;
  }
  getChangePassword(){


    let passReq={
      "BranchCode": '01',
      "InsuranceId": this.form.get('InsuranceId').value,
      "UserType": this.form.get('loginType').value,
      "UserId": this.form.get('userName').value,
      "OldPassword": this.form.get('oldPassword').value,
      "NewPassword": this.form.get('newPassword').value
    }
    let UrlLink = "basicauth/changepassword";
    console.log("Change Pass Req",passReq);
    return this.commondataService.getChangePassword(UrlLink, passReq).subscribe((data: any) => {

      console.log("Response For Change Password",data)
      if(data.Errors){
        this.errorService.showValidateError(data.Errors);
      }
      else{
        this.router.navigate(['/Login/Home']);
        Swal.fire(
          'Password Changed Successfully',
          `Success`
        )
        this.authService.logout();
      }

    }, (err) => {
      this.handleError(err);
    })

  }

  back(): void {
    this.location.back()
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
