import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from './errors/error.service';
import *  as  Mydatas from '../../appConfig.json';



@Injectable({
  providedIn: 'root',
})
export class CommondataService {
  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public DocApiUrl: any = this.MotorClaim.DocApiUrl;
  public token: any;LossList:any;
  fields: any[] = [];


  private loggedToken: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private nationality: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private state: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private lossType: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private errorObservable: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private imageUrl: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private navigateurl: BehaviorSubject<any> = new BehaviorSubject<any>('');




  userToken = this.loggedToken.asObservable();
  logindata: any;

  get nationalityList() {
    return this.nationality.asObservable()
  }
  get getLossList(){
    return this.LossList;
  }
  get stateList() {
    return this.state.asObservable()
  }
  get lossTypeList() {
    return this.lossType.asObservable()
  }
  get errorHandling() {
    return this.errorObservable.asObservable()
  }
  get getImageUrl() {
    return this.imageUrl.asObservable()
  }

  get getnavigate() {
    return this.navigateurl.asObservable()
  }


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private errorService: ErrorService
  ) {
  console.log(this.MotorClaim);
  }







  errorFunction(errors) {
    this.errorObservable.next(errors);

  }

  onGetImageUrl(base64) {
    this.imageUrl.next(base64);

  }

  UserToken(newUserToken) {
    this.token = newUserToken;
    this.loggedToken.next(newUserToken);

  }

  getnavigateurl(url) {
    this.navigateurl.next(url);
  }

  getNationality(data){
    this.nationality.next(data);

  }

  async getLossTypeList(lossList) {
    await this.lossType.next(lossList);
  }

  getToken() {
    // if (this.token != undefined) {
    //   return this.token;
    // } else {
      return this.token = sessionStorage.getItem('UserToken')
    //}

  }


  async onGetNationality() {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;

    let UrlLink = `api/nationality`;
    let ReqObj = {
      "InsuranceId":this.logindata?.InsuranceId
    }
    let response = (await this.onGetReasonInformation(UrlLink,ReqObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  getUserLogin(UrlLink, ReqObj): Observable<any[]> {
    return this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj)
      .pipe(retry(1), catchError(this.handleError));
  }
  getChangePassword(UrlLink, Reqobj): Observable<any[]> {
    let uname = "claim";
    let password = "claim123#";
  let headers = new HttpHeaders();
  //headers = headers.append('Authorization', 'Basic ' + window.btoa(uname+':'+password));
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

 async onCallNationality(UrlLink): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onGetBase64Image(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onUploadFiles(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onGetUploadedDocuments(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onGetUploadedDocumentsNoAuth(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onGetDocumentList(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  async onGetReasonInformation(UrlLink, ReqObj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  async onGetUploadDocList(UrlLink, ReqObj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  //POLICY CHASSIS NUMBER
  onGetPolicyChassisNoList(UrlLink, ReqObj): Observable<any[]>{
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onGetDropDown(UrlLink): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onGetImage(UrlLink, ReqObj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onGetClaimList(UrlLink, ReqObj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onGetOtp(UrlLink, ReqObj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  onPostMethodSync(UrlLink, ReqObj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl+UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onGetMethodSyncBasicToken(UrlLink): Observable<any[]> {
    let uname = "claim";
    let password = "claim123#";
    let headers = new HttpHeaders();
    //headers = headers.append('Authorization', 'Basic ' + window.btoa(uname+':'+password));
    return this.http
      .get<any>(UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onPostMethodSyncBasicToken(UrlLink, ReqObj): Observable<any[]> {
    let uname = "claim";
    let password = "claim123#";
    let headers = new HttpHeaders();
    //headers = headers.append('Authorization', 'Basic ' + window.btoa(uname+':'+password));
    return this.http
      .post<any>(UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  async onGetMethodAsyncBasicToken(UrlLink): Promise<Observable<any[]>> {
    let uname = "claim";
    let password = "claim123#";
    let headers = new HttpHeaders();
    //headers = headers.append('Authorization', 'Basic ' + window.btoa(uname+':'+password));
    return await this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  async onPostMethodAsyncBasicToken(UrlLink,ReqObj): Promise<Observable<any[]>> {
    let uname = "claim";
    let password = "claim123#";
    let headers = new HttpHeaders();
    //headers = headers.append('Authorization', 'Basic ' + window.btoa(uname+':'+password));
    return await this.http
      .post<any>(this.ApiUrl + UrlLink,ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }



  // Error handling
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
