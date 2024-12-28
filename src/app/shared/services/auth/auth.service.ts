import { CommondataService } from 'src/app/shared/services/commondata.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ErrorService } from '../errors/error.service';
import *  as  Mydatas from '../../../appConfig.json';
import { DOCUMENT } from '@angular/common';
@Injectable()
export class AuthService {

  public UserType: any;
  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public DocApiUrl: any = this.MotorClaim.DocApiUrl;

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  private loggedToken: BehaviorSubject<any> = new BehaviorSubject<any>('');
  token: any;

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get isloggedToken() {
    return this.loggedToken.asObservable();
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private injector: Injector,
    @Inject(DOCUMENT) private _document: Document
  ) {

  }




  onLoginFormSubmit(UrlLink, ReqObj): Observable<any[]> {
    return this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj)
      .pipe(retry(1), catchError(this.handleError));
  }
  

  onGetBasicIns(UrlLink): Observable<any[]> {
    let uname = "claim";
      let password = "claim123#";
    let headers = new HttpHeaders();
    //headers = headers.append('Authorization', 'Basic ' + window.btoa(uname+':'+password));
    return this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  // onGetBasicIns(UrlLink): Observable<any[]> {
  //   let uname = "claim";
  //   let password = "claim123#";
  //     var headers_object = new HttpHeaders();
  //     headers_object.append('Content-Type', 'application/json');
  //     headers_object.append("Authorization", `Basic Y2xhaW06Y2xhaW0xMjMj`);

  //     const httpOptions = {
  //       headers: headers_object
  //     };
  //     return this.http
  //       .get<any>(this.DocApiUrl + UrlLink,{headers: headers_object})
  //       .pipe(retry(1), catchError(this.handleError));
  // }
  login(userDetails) {
    if (userDetails.LoginResponse.Token != '' && userDetails.LoginResponse.Token != null) {
      this.loggedIn.next(true);
    }
  }
  getToken() {
    if (this.token != undefined) {
      return this.token;
    } else {
      return this.token = sessionStorage.getItem('UserToken')
    }

  }
  UserToken(newUserToken) {
    this.loggedToken.next(newUserToken);
  }
  onPostMethodSync(UrlLink, ReqObj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl+UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  logout() {
    this.UserType = JSON.parse(sessionStorage.getItem("UserType"));
    this.loggedIn.next(false);
    if (this.UserType == "surveyor") {
      window.sessionStorage.clear();
      this.router.navigate(['/Login/Surveyor']);
      this.refreshPage();
    }
    if (this.UserType == "garage") {
      window.sessionStorage.clear();
      this.router.navigate(['/Login/Surveyor']);
      this.refreshPage();
    }
    if (this.UserType == "claimofficer" || this.UserType == "admin" || this.UserType?.toLowerCase() == "user" || this.UserType?.toLowerCase() == "financial") {
      window.sessionStorage.clear();
      this.router.navigate(['/Login/Officer']);
      this.refreshPage();

    }

  }
  refreshPage() {
    // let currentUrl = this.router.url;
  //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //     this.router.navigate([currentUrl]);
  // });
    this._document.defaultView.location.reload();

  }


  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
