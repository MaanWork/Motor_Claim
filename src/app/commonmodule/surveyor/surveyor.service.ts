import { NgxSpinnerService } from 'ngx-spinner';
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
export class SurveyorService {
  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public DocApiUrl: any = this.MotorClaim.DocApiUrl;

  public logindata: any;
  public claimDetails: any;
  public Token: any;
  private garageList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private surveyorList: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private spinner:NgxSpinnerService,
    private commondataService: CommondataService

  ) {

    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    //this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
  }

  get getGarageList(){
    return this.garageList.asObservable();
  }

  get getSurveyorList(){
    return this.surveyorList.asObservable();
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








  onGetGarageList(lossDetails) {
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    let ReqObj = {
      "ClaimNo": this.claimDetails.ClaimNo,
      "PartyNo": lossDetails.PartyNo,
      "LosstypeId": lossDetails.LosstypeId,
      "PolicyNo": this.claimDetails.PolicyNo,
      ...this.commonReqObject()

    }
    let UrlLink = `api/allotedgaragedetails`;
    return this.onCallGarageList(UrlLink, ReqObj).subscribe((data: any) => {


      console.log("GarageDetails", data);
      this.garageList.next(data);

    }, (err) => {
      this.handleError(err);
    })
  }

  onGetSurveyorList(lossDetails) {
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));

    let ReqObj = {
      "ClaimNo": this.claimDetails.ClaimNo,
      "RegionId": this.logindata.RegionCode,
      "PartyNo": lossDetails.PartyNo,
      "LosstypeId": lossDetails.LosstypeId,
      ...this.commonReqObject()
    }
    let UrlLink = `api/allotedsurveyordetails`;
    return this.onCallSurveyorList(UrlLink, ReqObj).subscribe((data: any) => {


      this.surveyorList.next(data);
      console.log("surveyorDetails", data);
    }, (err) => {
      this.handleError(err);
    })
  }


  async onViewClaimIntimation(rowData){

    let ReqObj = {
      "Claimrefno": rowData.Claimrefno,
      "PolicyNo": rowData.PolicyNo,
      ...this.commonReqObject()

    }
    let UrlLink = `api/getbycliamrefno`;
    let response = (await this.onCallViewClaimIntimation(UrlLink, ReqObj)).toPromise()
      .then(res => {

        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }


























































































  onAssignSurveyor(UrlLink, ReqObj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onAllotedToGarages(UrlLink, ReqObj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }



  onCallGarageList(UrlLink, ReqObj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onCallSurveyorList(UrlLink, ReqObj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  async onCallViewClaimIntimation(UrlLink, ReqObj): Promise<Observable<any[]>> {
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
