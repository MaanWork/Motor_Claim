import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, retry, take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import *  as  Mydatas from '../../appConfig.json';
@Injectable({
  providedIn: 'root'
})
export class DashboardTableService {
  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public DocApiUrl: any = this.MotorClaim.DocApiUrl;

  private policyInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public Token: any;
  private claimInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  loginData: any;

  get rowClaimInfo() {
    return this.claimInfo.asObservable();
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private commondataService:CommondataService,
    private spinner:NgxSpinnerService,
    public dialog: MatDialog,

  ) {
    this.loginData = JSON.parse(sessionStorage.getItem("Userdetails"));
  }

  get getpolicyInfo() {
    return this.policyInfo.asObservable()
  }
  async onGetPolicyDetails(PolicyNumber,chassisNo) {
    let ReqObj = {
      "QuotationPolicyNo": PolicyNumber,
      "ChassisNo":chassisNo,
      "InsuranceId": this.loginData.InsuranceId
    }
    let UrlLink = "";
      UrlLink = `api/get/policydetailsbychassissno`;
      (await this.viewClaimIntimation(UrlLink, ReqObj)).toPromise()
      .then(res => {

      if (res) {
        this.policyInfo.next(res);
      }
    }, (err) => {
      this.handleError(err)
    })

  }
  async onViewClaimIntimation(rowData){
    let claimrefNo = "";
    if(rowData?.ClaimRefNo) claimrefNo = rowData?.ClaimRefNo;
    else if(rowData?.Claimrefno) claimrefNo = rowData?.Claimrefno;
    let ReqObj = {
      "Claimrefno": claimrefNo,
      "PolicyNo": rowData.PolicyNo
    }
    let UrlLink = `api/getbycliamrefno`;
    let response = (await this.viewClaimIntimation(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.claimInfo.next(rowData);
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }



  getToken() {
    this.authService.isloggedToken.subscribe((event: any) => {
      if (event != undefined && event != '' && event != null) {
        this.Token = event;
      } else {
        this.Token = sessionStorage.getItem('UserToken');
      }
    });
    return this.Token;
  }

  async onGetClaimDetailsBasedStatus(UrlLink, ReqObj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  // getClaimRowData(rowData) {
  //   console.log(rowData)

  // }






  async viewClaimIntimation(UrlLink, ReqObj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }



  // Error handling
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
