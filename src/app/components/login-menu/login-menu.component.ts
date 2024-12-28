import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent implements OnInit {

  public UserType:any;
  public loginData:any;
  constructor(
    private errorService:ErrorService,
    private spinner :NgxSpinnerService,
    private commondataService:CommondataService,
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  onGetUserLogin() {
    this.router.navigate(['/Login/Claim-Intimate']);
  }
  onRedirectClaim(type){
    if(type=='check'){
      sessionStorage.setItem('checkClaim','true');
      this.router.navigate(['/Login/ClaimIntimate']);
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
