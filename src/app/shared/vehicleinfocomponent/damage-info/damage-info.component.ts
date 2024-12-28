import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { DashboardTableService } from 'src/app/commonmodule/dashboard-table/dasboard-table.service';
import { ErrorService } from '../../services/errors/error.service';

@Component({
  selector: 'app-damage-info',
  templateUrl: './damage-info.component.html',
  styleUrls: ['./damage-info.component.css']
})
export class DamageInfoComponent implements OnInit,OnDestroy {

  @Input() ClaimInfo:any
  public damageInformation:any;

  public isSingleClick: Boolean = true;


  public damagepoints_1: boolean = false;
  public damagepoints_2: boolean = false;
  public damagepoints_3: boolean = false;
  public damagepoints_4: boolean = false;
  public damagepoints_5: boolean = false;
  public damagepoints_6: boolean = false;
  public damagepoints_7: boolean = false;
  public damagepoints_8: boolean = false;
  public damagepoints_9: boolean = false;
  public damagepoints_10: boolean = false;
  public damagepoints_11: boolean = false;
  public damagepoints_12: boolean = false;
  public damagepoints_14: boolean = false;
  public damagepoints_13: boolean = false;
  public damagepoints_15: boolean = false;
  public damagepoints_16: boolean = false;

  private subscription = new Subscription();

  constructor(
    private errorService: ErrorService,
    private router:Router,
    private spinner:NgxSpinnerService,
    private dashboardTableService:DashboardTableService
  ) { }

  ngOnInit(): void {
    this.onGetClaimInformation();
  }

  ngOnDestroy(){
      this.subscription.unsubscribe();
    }

  onGetClaimInformation(){
    this.damageInformation = this.ClaimInfo;
    console.log("damage-info",event);
    let damageIdLength = 16;
    for (let index = 1; index <= damageIdLength; index++) {
        this['damagepoints_'+index] = false;     
    }
    for (let index = 0; index < this.damageInformation?.Vehpartsid?.length; index++) {
     const element = this.damageInformation.Vehpartsid[index];
     this['damagepoints_'+element] = true     
   }
  }

  method1CallForClick(id) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {

      }
    }, 250)
  }
  method2CallForDblClick(id) {
    this.isSingleClick = false;
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


