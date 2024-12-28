import { BranchModalComponent } from './../branch-modal/branch-modal.component';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PolicySearchComponent } from 'src/app/shared/claimintimationForms/policy-search/policy-search.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public LoginFrom: FormGroup;
  public PolicyClaimFrom: FormGroup;
  public OtpVerifyFrom: FormGroup;
  public branchForm:FormGroup
  public InsuranceValue = "100002"
  public branchValue:any="";
  public UserType:any
  public InsuranceList:any[] = [];
  branchList: any[]=[];
  loginData: any={};
  public filteredCompany: Observable<any[]>;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private errorService: ErrorService,
    private commondataService:CommondataService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PolicySearchComponent>,

  ) {
    window.sessionStorage.clear();

    

  }

  async ngOnInit() {
    this.onLogout();
    this.onCreateFormControl();
    this.InsuranceList = await this.getInsuranceList() || [];

   
    this.filteredCompany = this.LoginFrom.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value)),
    );
    if(this.InsuranceList.length!=0){
      let entry = this.InsuranceList.find(ele=>ele.Code=='100003');
      if(entry) this.LoginFrom.controls['InsuranceId'].setValue(entry.Code);
    }
    //this.getInsuranceList();
  }
  getIntimate(){

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
  insuranceCompyText = (option: any) => {
    if (!option) return '';
    let index = this.InsuranceList.findIndex((make: any) => make.Code == option);
    console.log(this.InsuranceList[index].CodeDesc)
    return this.InsuranceList[index].CodeDesc;
  }
  onLogout(){
    this.authService.logout();
  }
  onChangeCompany(val: any) {
    this.InsuranceValue = val;
    console.log(val);
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
              this.router.navigate(['./Home/Admin']);
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

  onCreateFormControl() {
    this.LoginFrom = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      loginType: ['claimofficer', Validators.required],
      InsuranceId: ['', Validators.required],
    });
    this.PolicyClaimFrom = this.fb.group({
      plateNumber: ['',],
      policyNumber: ['',],
      mobileNumber: ['']
    });

    this.OtpVerifyFrom = this.fb.group({
      otpNumber: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.branchForm = this.fb.group({
      branchCode: ['', Validators.required],
    });

  }

  onLoginFormSubmit() {

    if (this.LoginFrom.valid) {
      let UrlLink = `authentication/login`;
      var ReqObj = {
        "InsuranceId": this.LoginFrom.get('InsuranceId').value,
        "LoginType": this.LoginFrom.get('loginType').value,
        "Password": this.LoginFrom.get('password').value,
        "UserId": this.LoginFrom.get('userName').value
      }
      return this.authService.onLoginFormSubmit(UrlLink, ReqObj).subscribe((data: any) => {

        let Token = data?.LoginResponse?.Token;
        if( data?.LoginResponse?.Status=="ChangePassword"){
          console.log('IIIIIIIIIII',data.Errors);
          sessionStorage.setItem('changePassObj',JSON.stringify(ReqObj));
            console.log('KKKKKKKKKKKKK')
            this.router.navigate(['./Login/Change-Password']);
          // if(data?.Errors[0]?.Message!=='You are not authorize user'){           
          // } 
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
            if(data.LoginResponse.BranchCodeList.length == 1){
              data.LoginResponse.BranchCode = data.LoginResponse.BranchCodeList[0].Code;
              data.LoginResponse.RegionCode = data.LoginResponse.BranchCodeList[0].RegionCode;
              sessionStorage.setItem('branchValue',data.LoginResponse.BranchCodeList[0].Code);
              sessionStorage.setItem("Userdetails", JSON.stringify(data));
              //sessionStorage.setItem('garageLoginReload','true');
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
