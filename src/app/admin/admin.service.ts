import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import *  as  Mydatas from '../appConfig.json';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public DocApiUrl: any = this.MotorClaim.DocApiUrl;

  public Token: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private commondataService:CommondataService

  ) {
      // let url = window.location.href;
      // let urlList = url.split(':');
      // if(urlList.length!=0){
      //   if(urlList[0]=='http'){
      //     this.MotorClaim = this.MotorClaim.replace()
      //   }
      // }
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


  

  async onGetLossType(UrlLink): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  async onGetSurveyorList(UrlLink): Promise<Observable<any[]>> {
    console.log(UrlLink)
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  async onPostMethodAsync(UrlLink,ReqObj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink,ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  async onGetMethodAsync(UrlLink): Promise<Observable<any[]>> {
    console.log(UrlLink)
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  onPostMethod(UrlLink, ReqObj): Observable<any[]> {
    console.log(ReqObj)
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }



  // Error handling
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
