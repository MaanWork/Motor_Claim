import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common'
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public ForgotPassword: FormGroup;
  InsuranceList: { Code: string; CodeDesc: string; TypeId: any; }[];
  InsuranceValue: any="100002";
  constructor(
    private commondataService: CommondataService,
    private formbuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private errorService:ErrorService,
    private location: Location,
  ) {
    this.InsuranceList = [
      { Code: '100003', CodeDesc: 'Alliance Insurance Uganda', TypeId: null },
      { Code: '100007', CodeDesc: 'Alliance Insurance Corporation Ltd-Test', TypeId: null },
      { Code: '100002', CodeDesc: 'Alliance Insurance Corporation Ltd.', TypeId: null },
      { Code: '100004', CodeDesc: 'Reliance Insurance Co. Tanzania Ltd', TypeId: null }
    ];
   }

  ngOnInit(): void {
    this.onCreateFormControl();
  }


  onCreateFormControl() {
    this.ForgotPassword = this.formbuilder.group({
      UserName: ['', Validators.required],
      EmailId: ['', Validators.required],
      loginType: ['claimofficer', Validators.required]
    });
  }

  onSubmit() {
    let ReqObj = {
      "MailId": this.ForgotPassword.get('EmailId').value,
      "UserId": this.ForgotPassword.get('UserName').value,
      "InsuranceId": this.InsuranceValue,
    }
    let UrlLink = "basicauth/forgotpassword";
    return this.commondataService.getChangePassword(UrlLink, ReqObj).subscribe((data: any) => {

      console.log("Response For Change Password",data)
      if(data.Errors){
        this.errorService.showValidateError(data.Errors);
      }
      else{
        this.router.navigate(['/Login/Change-Password']);
        Swal.fire(
        data.Message,
          `Success`
        )
        this.authService.logout();
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
  back(): void {
    this.location.back()
  }

}
