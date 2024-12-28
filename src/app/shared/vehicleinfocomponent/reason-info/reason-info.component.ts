import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { DashboardTableService } from 'src/app/commonmodule/dashboard-table/dasboard-table.service';
import { CommondataService } from '../../services/commondata.service';
import { ErrorService } from '../../services/errors/error.service';

@Component({
  selector: 'app-reason-info',
  templateUrl: './reason-info.component.html',
  styleUrls: ['./reason-info.component.css']
})
export class ReasonInfoComponent implements OnInit,OnDestroy {
  @Input() ClaimInfo:any;
  public reasonInformation: any;
  public panelOpen: boolean = true;
  public otherVehiclePropertyDamage: any = [];
  public personInjured:any=[];
  public independentWitness:any=[];
  public passengerInVehicle:any=[];
  private subscription = new Subscription();

  constructor(
    private errorService: ErrorService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dashboardTableService: DashboardTableService,
    private commondataService: CommondataService
  ) { }

  ngOnInit(): void {
    this.onGetClaimInformation();
    if(this.ClaimInfo){
      this.getAllClaimInfo();
    }
  }

ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  async getAllClaimInfo(){
    if (this.ClaimInfo?.DamgPropYn == 'Y') {
        
      let UrlLink = "api/claimintiotrvehpropdamagebyclaimrefno";
      this.otherVehiclePropertyDamage = await this.onGetReasonInformation(UrlLink, this.reasonInformation.Claimrefno);
       console.log("Other Vehicle List",this.otherVehiclePropertyDamage);
    }
    if (this.ClaimInfo?.DamgPersYn == 'Y') {
      let UrlLink = "api/claimintipersoninjuredbyclaimrefno";
      this.personInjured = await this.onGetReasonInformation(UrlLink, this.reasonInformation.Claimrefno);
       console.log("Person Inj List",this.personInjured);
    }
    if (this.ClaimInfo?.DamIndiYn == 'Y') {
      let UrlLink = "api/claiminitindepenwitbyclaimrefno";
      this.independentWitness = await this.onGetReasonInformation(UrlLink, this.reasonInformation.Claimrefno);
       console.log("Ind Witness List",this.independentWitness);
    }
    if (this.ClaimInfo?.DamPassenYn == 'Y') {
      let UrlLink = "api/claimintipassengvehbyclaimrefno";
      this.passengerInVehicle = await this.onGetReasonInformation(UrlLink, this.reasonInformation.Claimrefno);
       console.log("Passenger In Vehicle List",this.passengerInVehicle);
    }
  }
  async onGetClaimInformation() {
   this.subscription = this.dashboardTableService.rowClaimInfo.subscribe(async (event: any) => {
      this.reasonInformation = event;
      console.log("Entered For Others List",this.reasonInformation)
      
    });
  }

  async onGetReasonInformation(UrlLink, claimno) {
    let ReqObj = {
      "Claimrefno": claimno,
    }
    console.log("Reevied Req For List",ReqObj)
    let response = (await this.commondataService.onGetReasonInformation(UrlLink, ReqObj)).toPromise()
      .then(res => {
        console.log("Reevied Res For List",res)
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
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
