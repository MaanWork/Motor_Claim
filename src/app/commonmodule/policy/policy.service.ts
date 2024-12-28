import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, retry, take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import *  as  Mydatas from '../../appConfig.json';
@Injectable({
  providedIn: 'root'
})
export class PolicyService {
 public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public DocApiUrl: any = this.MotorClaim.DocApiUrl;


  public Token: any;
  public logindata:any;
  private claimHistroy: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private commondataService:CommondataService

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




  get getClaiminfo() {
    return this.claimHistroy.asObservable()
  }





  async onGetClaimHistory(PolicyInformation) {
    console.log(PolicyInformation)
    let ReqObj = {
      "ChassisNo": PolicyInformation?.VehicleInfo?.ChassisNo,
      "PolicyNo": PolicyInformation?.PolicyInfo?.PolicyNo,
      ...this.commonReqObject()

    }
    console.log(ReqObj)
    let UrlLink = `api/claimdetailsbypolicynoandchassissno`;
    let response = (await this.onCallClaimHistory(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.claimHistroy.next(res);
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;

  }






















 async onGetPolicyDetails(UrlLink, Reqobj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  async onCallClaimHistory(UrlLink, Reqobj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  // Error handling
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
