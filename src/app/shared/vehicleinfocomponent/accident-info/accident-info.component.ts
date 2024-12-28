import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { DashboardTableService } from 'src/app/commonmodule/dashboard-table/dasboard-table.service';
import { ErrorService } from '../../services/errors/error.service';

@Component({
  selector: 'app-accident-info',
  templateUrl: './accident-info.component.html',
  styleUrls: ['./accident-info.component.css']
})
export class AccidentInfoComponent implements OnInit, OnDestroy {
  @Input() ClaimInfo:any
  public accidentInformation: any = {};
  private subscription = new Subscription();
  constructor(
    private errorService: ErrorService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dashboardTableService: DashboardTableService
  ) { }

  ngOnInit(): void {
    this.onGetClaimInformation();
  }
  onGetClaimInformation() {
    this.subscription = this.dashboardTableService.rowClaimInfo.subscribe((event: any) => {
      this.accidentInformation = event;
      console.log("accident-info", event)
    });
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
