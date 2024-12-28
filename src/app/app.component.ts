import { Router, NavigationEnd } from '@angular/router';
import { CommondataService } from './shared/services/commondata.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { ErrorService } from './shared/services/errors/error.service';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Claimintimation';

  public Nationality:any=[];
  public loginData:any;
  public hidebackbtn:boolean;timeoutId;
  userInactive: Subject<any> = new Subject();currentRoute:any;
  private navigateurl: BehaviorSubject<any> = new BehaviorSubject<any>('');
  constructor(
    private authService: AuthService,
    private commondataService: CommondataService,
    private errorService:ErrorService,
    private router:Router
  ) {
    let cachePoint = sessionStorage.getItem('clear');
    if(cachePoint==undefined || cachePoint==null){
      sessionStorage.setItem('clear','ClearCache');
      window.location.reload();
    }
    if (JSON.parse(sessionStorage.getItem("Userdetails")) != null && JSON.parse(sessionStorage.getItem("Userdetails")) != '') {
      this.loginData = JSON.parse(sessionStorage.getItem("Userdetails"));
      this.authService.login(this.loginData);
      console.log("Data",this.loginData,window.location.href);
    }

  }

   ngOnInit():void{
      this.commondataService.getnavigateurl(this.router.url );
      console.log(this.navigateurl.next(this.router.url));
      console.log("Url",this.router.url);
  }
  
 
  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  checkUserActivity() {
    let url = this.router.url;
    if(url!= '/' && url!='/Login/Home' && url!='/Login/sessionRedirect' && url != '/Login/Officer' && url != '/Login/Assessor' && url != '/Login/Garage'){
      clearTimeout(this.timeoutId);
      console.log("Url Received",url);
      this.errorService.clearTimeOut();
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
