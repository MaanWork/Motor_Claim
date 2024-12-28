import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
import { BranchModalComponent } from '../branch-modal/branch-modal.component';

@Component({
  selector: 'app-logingarage',
  templateUrl: './logingarage.component.html',
  styleUrls: ['./logingarage.component.css'],
})
export class LogingarageComponent implements OnInit {
  public loginMenu: any;
  garageForm: FormGroup;
  private formSubmitAttempt: boolean;
  public loginType:any='garage';
  branchValue: string;
  loginData: any;
  UserType: any;
  branchList: any;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private errorService:ErrorService,
    public dialog: MatDialog,

  ) {
    sessionStorage.clear();
  }

  ngOnInit(): void {
    this.garageForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.garageForm.get(field).valid &&
        this.garageForm.get(field).touched) ||
      (this.garageForm.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {



    if (this.garageForm.valid) {

      let UrlLink = `authentication/login`;
      var ReqObj = {
        "BranchCode": "01",
        "InsuranceId": "100002",
        "LoginType": this.loginType,
        "Password": this.garageForm.get('password').value,
        "RegionCode": "01",
        "UserId": this.garageForm.get('userName').value
      }
      console.log(ReqObj);
      return this.authService.onLoginFormSubmit(UrlLink, ReqObj).subscribe((data: any) => {

        let Token = data?.LoginResponse?.Token;
        if( data?.LoginResponse?.Status=="ChangePassword"){
          sessionStorage.setItem('changePassObj',JSON.stringify(ReqObj));
          this.router.navigate(['./Login/Change-Password']);
        }
        if (data?.LoginResponse && Token != null && Token != undefined) {
          this.authService.login(data);
          this.loginData = data;

          this.authService.UserToken(Token);
          sessionStorage.setItem("UserToken",Token);
          sessionStorage.setItem("Userdetails", JSON.stringify(data));
          sessionStorage.setItem("UserType", JSON.stringify(data.LoginResponse.UserType));

          this.UserType = data.LoginResponse.UserType;
          if(data.LoginResponse.BranchCodeList){
            console.log("Login Branch Response",data);
            if(data.LoginResponse.BranchCodeList.length == 1){
              data.LoginResponse.BranchCode = data.LoginResponse.BranchCodeList[0].Code;
              data.LoginResponse.RegionCode = data.LoginResponse.BranchCodeList[0].RegionCode;
              sessionStorage.setItem('branchValue',data.LoginResponse.BranchCodeList[0].Code);
              sessionStorage.setItem("Userdetails", JSON.stringify(data));

              if (this.UserType == 'admin') {
                this.router.navigate(['./Home/Admin']);
                console.log("admin")
              }
              else {
                this.router.navigate(['./Home/Dashboard']);
                console.log("Not-admin")

              }
            }
            else{
              this.branchList =  data.LoginResponse.BranchCodeList;
              const dialogRef = this.dialog.open(BranchModalComponent, {
                width: '100%',
                panelClass: 'full-screen-modal',
                data:{'branchList':this.branchList}
              });

              dialogRef.afterClosed().subscribe(result => {
                if(result != '' && result != undefined){
                  this.setBranchValue(result)
                }
              });
            }
          }

        }
        if (data.Errors) {
          this.errorService.showValidateError(data.Errors);
        }

      }, (err) => {
        this.handleError(err);
      })
    }

  }

  setBranchValue(code){
    this.branchValue = code;
    if(this.branchValue != ""){
      this.loginData.LoginResponse.BranchCode = this.branchValue;
      for(let branch of this.branchList){
        if(branch.Code == this.branchValue){
          this.loginData.LoginResponse.RegionCode = branch.RegionCode;
            sessionStorage.setItem("Userdetails", JSON.stringify(this.loginData));
            if (this.UserType == 'admin') {
              //this.router.navigate(['./existingAdminLoginList']);
            }
            else {
              this.router.navigate(['./Home/Dashboard']);
            }
        }
      }

    }
    else{
      Swal.fire(
        'Please Select Valid Branch',
        `Error`,
        'error',
      )
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
