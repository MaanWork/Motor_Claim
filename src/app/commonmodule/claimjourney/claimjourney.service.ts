import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, retry, take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import *  as  Mydatas from '../../appConfig.json';
@Injectable({
  providedIn: 'root'
})
export class ClaimjourneyService {
  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public DocApiUrl: any = this.MotorClaim.DocApiUrl;



  public logindata:any;
  public Token: any;

  private policyInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private allotedClaimLoss: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private commondataService:CommondataService,
    private spinner:NgxSpinnerService,
    private errorService:ErrorService

  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;

  }

  commonReqObject() {
    return {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId":  this.logindata?.OaCode

    }
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

  get getpolicyInfo() {
    return this.policyInfo.asObservable()
  }
  get getAllotedClaimLoss() {
    return this.allotedClaimLoss.asObservable()
  }




  onGetPolicyDetails(PolicyNumber,type,claimRefNo) {
    let chassisNo = sessionStorage.getItem('ChassisNumber');
    let UrlLink = "";
    if(type=='byChassisNo'){
      UrlLink = `api/get/policydetailsbychassissno`;
      chassisNo = sessionStorage.getItem('ChassisNumber');
    }
    else{
      UrlLink = `api/get/policyDetails`;
      chassisNo = "";
    }
    let ReqObj = {
      "QuotationPolicyNo": PolicyNumber,
      "ChassisNo":chassisNo,
      "InsuranceId": this.logindata.InsuranceId,
      "ClaimRefNo": claimRefNo

    }
    return this.onCallPolicyDetails(UrlLink, ReqObj).subscribe((data: any) => {

      if (data) {
        this.policyInfo.next(data);
      }
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
    }, (err) => {
      this.handleError(err);
    })

  }


  async onGetAllotedLossForSurveyor() {
    let ReqObj = {
      "SurveyorId": this.logindata.OaCode
    }
    let UrlLink = `api/surveyorapprovaldetailbysurid`;
    let response = (await this.onCallAllotedLossForSurveyor(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.allotedClaimLoss.next(res);
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }





















  async getSearchby(UrlLink): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onCallPolicyDetails(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  async onCallAllotedLossForSurveyor(UrlLink,ReqObj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink,ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  // Error handling
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
