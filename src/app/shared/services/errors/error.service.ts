import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { BehaviorSubject, timer, Subscription } from 'rxjs';
import { IdleTimeoutManager } from "idle-timer-manager";
import { Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
declare var $:any;
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private loggedToken: BehaviorSubject<any> = new BehaviorSubject<any>('');

  timer:IdleTimeoutManager;
  redirectSection:boolean = false;
  timeLimit: Subscription;public value: number;
  logindata: any;
  timeoutHandle: NodeJS.Timeout;
  constructor(
    private spinner:NgxSpinnerService,
    private router: Router,
    private commonService:AuthService
  ) { }
  
  setTimeOutSection(){
    this.timeoutHandle = setTimeout(() => this.showAlert(this.redirectSection,this.router,this.commonService),(20*60*1000));
    this.redirectRouting();
  }
  restartTimer(){
      
  }
  showAlert(redirectSection,router,commonService){
    let redirectStatus = sessionStorage.getItem('redirectStatus');
    if((redirectStatus==undefined && router!= undefined)){
      if(this.router.url!= '/' && this.router.url!='/Login/Home' && this.router.url!='/Login/sessionRedirect' && this.router.url != '/Login/Officer' && this.router.url != '/Login/Assessor' && this.router.url != '/Login/Garage' ){
      
      sessionStorage.setItem('redirectStatus','started')
      
      const startValue = 1 * 60 + 5;

        this.timeLimit = timer(0, 1000).pipe(
          take(startValue + 1),
          map(value => startValue - value)
        ).subscribe(
          value => this.value = value, 
          null, 
          () => this.timeLimit = null
        );
          console.log("Alert Time Out",router,this.redirectSection,this.timeLimit);
          Swal.fire({
            title: 'Your Session is About to Expire!',
            text: `You will be LogOut in 10 Minute 0 seconds Due to InActivity.Are You want to Stay Logged in?`,
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, Stay Loggined in!`
          }).then((result) => {
            if (result.value) {
                this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
                  let ReqObj = {
                    "InsuranceId": this.logindata?.InsuranceId,
                      "UserId" : this.logindata?.LoginId
                  }
                  let UrlLink = `authentication/tokenregenrate`;
                  return commonService.onPostMethodSync(UrlLink, ReqObj).subscribe(async (data: any) => {
                        console.log("Update Response",data);
                        sessionStorage.removeItem('redirectStatus');
                        clearTimeout(this.timer);
                        clearTimeout(this.timeoutHandle);
                        this.clearTimeOut();
                        if(data?.LoginResponse?.Token){
                          this.loggedToken.next(data?.LoginResponse?.Token);
                          sessionStorage.setItem("UserToken",data?.LoginResponse?.Token);
                        }
                        
                  }, (err) => {
                    this.handleError(err);
                  })
              }
          })
      }
    }
  }
  updateTokenService(){
    

  }
  redirectRouting(){
    console.log("Redirect Time Out")
    if(this.router!=undefined){
      this.timer = new IdleTimeoutManager({
        timeout: 60*30,
        onExpired: () => {
          sessionStorage.clear();
          Swal.close();
          this.router.navigate(['./Login/sessionRedirect']);
        }
      });
    }
  }
  clearTimeOut(){
    console.log("Clear Time Out")
    let redirectStatus = sessionStorage.getItem('redirectStatus');
    if((redirectStatus==undefined && this.router!= undefined)){
      if(this.router.url!= '/' && this.router.url!='/Login/Home' && this.router.url!='/Login/sessionRedirect' && this.router.url != '/Login/Officer' && this.router.url != '/Login/Assessor' && this.router.url != '/Login/Garage' ){
        window.clearTimeout(this.timeoutHandle);
        this.setTimeOutSection();
      }
    }
    return true;
  }
  showError(error, errorMessage) {
    if (error.status == 401 || error.status == 400 || error.status == 500 || error.status == 501 || error.status == 503){
      Swal.fire(
        `ErrorCode:${errorMessage.ErrorCode}`,
        `${errorMessage.Message}`,
        'error'
      )
    }
     if(error.status == 0){
      Swal.fire(
        `Server Currently Down`,
        `${errorMessage.Message}`,
        'error'
      )
     }
  }

  showValidateError(data) {
    console.log(data);

    let element = '';
    for (let i = 0; i < data.length; i++) {
      element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data[i].Message + "</div>";
    }
    Swal.fire(
      '<h4 style="display:none">Please Fill Valid Value</h4>',
      `${element}`,
      'error',
    )
  }

  showLossErrorList(ErrorList){
    console.log(ErrorList);
    let ErrorsList = '';

    for (let i = 0; i < ErrorList.length; i++) {
      ErrorsList += '<div class="my-1 losserrorlist"><i class="fas fa-arrow-right mx-2"></i>' + ErrorList[i].Title + "</div>";
      for (let index = 0; index < ErrorList[i].Errors.length; index++) {
        const element = ErrorList[i].Errors[index];
        console.log(element);
          ErrorsList += '<div class="my-1 childerrorlist"><i class="fas fa-circle mx-2"></i>' + element.Message + "</div>";

      }
    }
    Swal.fire(
      '<h4 style="display:none">Please Fill Valid Value</h4>',
      `${ErrorsList}`,
      'error',
    )
  }
  handleError(error) {
    let errorMessage: any = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = { 'ErrorCode': error.status, 'Message': error.message };
      this.showError(error, errorMessage);

    }
  }
}
