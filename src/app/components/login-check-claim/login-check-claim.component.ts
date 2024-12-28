import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import *  as  Mydatas from '../../appConfig.json';
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
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-login-check-claim',
  templateUrl: './login-check-claim.component.html',
  styleUrls: ['./login-check-claim.component.css'],
})
export class LoginCheckClaimComponent implements OnInit {
  public loginMenu: any;
  checkClaimForm: FormGroup;
  private formSubmitAttempt: boolean;
  public loginType:any='garage';
  branchValue: string;
  loginData: any;
  UserType: any;
  branchList: any;insuranceId:any=null;
  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public DocApiUrl: any = this.MotorClaim.DocApiUrl;
  MobileCodeList: any[]=[];companyList:any[]=[];
  
  public filteredCompany: Observable<any[]>;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private errorService:ErrorService,
    public dialog: MatDialog,
    public _dataService: CommondataService,
  ) {
    sessionStorage.clear();
    this.getMobileCodeList();
  }

  async ngOnInit(): Promise<void> {
    this.companyList = await this.onGetCompanyList() || [];
    this.checkClaimForm = this.fb.group({
      MobileCode: ['', Validators.compose([Validators.required])],
      MobileNo: ['', Validators.compose([Validators.required])],
      InsuranceId: ['', Validators.compose([Validators.required])],
    });
    this.filteredCompany = this.checkClaimForm.controls['InsuranceId'].valueChanges.pipe(
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
  onChangeCompany(val: any) {
    this.insuranceId = val;
    console.log(val);
  }
  isFieldInvalid(field: string) {
    return (
      (!this.checkClaimForm.get(field).valid &&
        this.checkClaimForm.get(field).touched) ||
      (this.checkClaimForm.get(field).untouched && this.formSubmitAttempt)
    );
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
  onSubmit() {
    this.router.navigate(['/Login/Search-Claim']);
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
