import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { DashboardTableService } from 'src/app/commonmodule/dashboard-table/dasboard-table.service';
import { CommondataService } from '../services/commondata.service';
import { ErrorService } from '../services/errors/error.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LossService } from 'src/app/commonmodule/loss/loss.service';

@Component({
  selector: 'app-status-track',
  templateUrl: './status-track.component.html',
  styleUrls: ['./status-track.component.scss']
})
export class StatusTrackComponent implements OnInit,OnDestroy {

  public ImageObj:any={};
  private subscription = new Subscription();
  totalTrackList: any[]=[];
  claimNo: any;
  policyNo: any;
  losstypeId: any;
  partyId: any;
  currentStatus: any;logindata:any;
  currentStatusUpdatedTime: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lossService: LossService,
    private errorService: ErrorService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dashboardTableService: DashboardTableService,
    private commondataService: CommondataService,
  ) { }

  ngOnInit(): void {
    // this.subscription=this.commondataService.getImageUrl.subscribe((event: any) => {
    //   this.ImageObj = event;
    //    console.log(this.ImageObj);
    // });
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    console.log("Data",this.data);
    if(this.data){
      this.claimNo = this.data?.ClaimNo;
      this.policyNo = this.data?.PolicyNo;
      this.losstypeId = this.data?.LosstypeId;
      this.partyId = this.data?.PartyNo;
      this.getTrackingDetails();
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  getTrackingDetails(){
    let ReqObj = {
      "ClaimNo":this.data.ClaimNo,
      "PolicyNo": this.data?.PolicyNo,
      "InsuranceId": this.logindata?.InsuranceId,
      "LossTypeId": this.data?.LosstypeId,
       "PartyNo": this.data?.PartyNo
    }
    let UrlLink = `api/viewclaimsteps`;
    return this.lossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.ErrorsList) {
        this.errorService.showLossErrorList(data.ErrorsList);
      }
      else {
        this.totalTrackList = data?.ClaimStepsList;
        if(data?.ClaimCurrentStep){
          this.currentStatus = data?.ClaimCurrentStep?.Substatusdescription;
          this.currentStatusUpdatedTime = data?.ClaimCurrentStep?.Entrydate;
        }
      }
    }, (err) => {
      this.handleError(err);
    })
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
