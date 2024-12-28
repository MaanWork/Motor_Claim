import { LossService } from 'src/app/commonmodule/loss/loss.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, find } from 'rxjs/operators';
import { StepperOrientation } from '@angular/cdk/stepper';
import { ErrorService } from '../../../shared/services/errors/error.service';
@Component({
  selector: 'app-claim-status-tracking',
  templateUrl: './claim-status-tracking.component.html',
  styleUrls: ['./claim-status-tracking.component.css']
})
export class ClaimStatusTrackingComponent implements OnInit, OnDestroy {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  public statusList: any;
  public logindata: any;
  public claimDetails: any;
  public LossInformation: any;
  public showLossStatus = {};
  public currentStatus:any;

  private subscription = new Subscription();


  constructor(
    private _formBuilder: FormBuilder,
    private lossService: LossService,
    private errorService: ErrorService
  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
  }

  ngOnInit() {
    this.subscription = this.lossService.getlossInformationReq.subscribe(async (event: any) => {
      this.LossInformation = event;
      console.log(event);
      this.onInitialFetchData();

    });

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  async onInitialFetchData() {
    this.statusList = await this.onStatusList();
    console.log("status-1", this.statusList);

    let sortArray = [];
    let sortList = [
      "PPC",
      "PLC",
      "AS",
      "SD",
      "SA",
      "SR",
      "CL",
      'QAFG',
      'QS',
      'CLG',
      'UP',
      'RQFG'
    ];



    if (this.statusList != undefined) {
      for (let index = 0; index < sortList.length; index++) {
        const element = sortList[index];

        let sort = this.statusList.find((ele: any) => ele.Code == element);
        if(sort != undefined){
          sortArray.push(sort);

        }
      }
      this.statusList = sortArray;
    console.log("status", this.statusList);

      for (let index = 0; index < this.statusList.length; index++) {
        const element = this.statusList[index];
        if (element.Code == this.LossInformation.Status) {
          this.showLossStatus['status' + element.Code] = true;
          console.log(this.showLossStatus['status' + element.Code], true)

        } else {
          this.showLossStatus['status' + element.Code] = false;
          console.log(false)

        }
      }
      let lossStatus = this.statusList.find((ele: any) => ele.Code == this.LossInformation.Status);
      console.log(lossStatus);
      console.log(this.currentStatus);

      if (lossStatus != undefined) {
        this.currentStatus = lossStatus.Code;

        let findIndex = this.statusList.findIndex((ele: any) => ele.Code == this.LossInformation.Status);
        for (let index = 0; index < findIndex; index++) {
          const element = this.statusList[index];
          this.showLossStatus['status' + element.Code] = true;

        }
      }else{
        this.currentStatus = "PPC";
        this.showLossStatus['status' + "PPC"] = true;

      }

    }
  }

  async onStatusList() {
    console.log("Losss Details On Status Update 2",this.LossInformation);
    let ReqObj = {
      "loginId": this.logindata.LoginId,
      "InsuranceId": this.logindata.InsuranceId,
      "Usertype": this.logindata.UserType,
      "PartyNo": this.LossInformation.PartyNo,
      "LosstypeId": this.LossInformation.LosstypeId,
      "SubStatus": this.LossInformation.Status
    }
    let UrlLink = null;
    if(this.logindata.InsuranceId=='100002') UrlLink = `api/statusmasterdropdown`;
    else if(this.logindata.InsuranceId=='100003' || this.logindata.InsuranceId=='100008') UrlLink = `api/statusmasterdropdownV1`;
    let response = (await this.lossService.onStatusList(UrlLink, ReqObj)).toPromise()
      .then(res => {
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
