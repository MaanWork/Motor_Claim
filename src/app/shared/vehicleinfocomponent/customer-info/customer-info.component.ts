import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DashboardTableService } from 'src/app/commonmodule/dashboard-table/dasboard-table.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit {
  
  @Input() ClaimInfo:any;
  public policyInformation:any;
  private subscription = new Subscription();
  constructor(
    private errorService: ErrorService,
    private router:Router,
    private spinner:NgxSpinnerService,
    private dashboardTableService:DashboardTableService
  ) { 
    console.log("Claim Data",this.ClaimInfo)

  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
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
