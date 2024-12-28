import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import Swal from 'sweetalert2';
import { CommondataService } from '../../services/commondata.service';
import { ErrorService } from '../../services/errors/error.service';

@Component({
  selector: 'app-status-update',
  templateUrl: './status-update.component.html',
  styleUrls: ['./status-update.component.css']
})
export class StatusUpdateComponent implements OnInit {

  public statusList: any;
  public statusYN: any;
  statusValue = new FormControl();
  statusUpdateRemarks = new FormControl();
  options: any[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  public logindata: any;
  public claimDetails: any;
  public LossDetails: any;
  public LossInformation: any;
  public StatusCode:any;
  private subscription = new Subscription();
  GarageLoss: any;
  GaragaeAuthData: any;
  constructor(
    private lossService: LossService,
    public commondataService: CommondataService,
    public dialog: MatDialog,
    private errorService: ErrorService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<StatusUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.LossDetails = JSON.parse(sessionStorage.getItem("LossDetails"));
    this.GarageLoss = JSON.parse(sessionStorage.getItem("GarageLossDetails"));
    this.GaragaeAuthData = JSON.parse(sessionStorage.getItem("garageAuthData"));
    console.log("LossDetails", this.LossDetails, this.claimDetails);
    this.onInitialFetchData();

  }

  async onInitialFetchData() {
    this.statusList = await this.onStatusList();
    this.options = this.statusList;
    console.log(this.options)
  }

  ngOnInit() {
    this.filteredOptions = this.statusValue.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.CodeDesc.toLowerCase().includes(filterValue));
  }

  async onStatusList() {
    console.log("Losss Details On Status Update",this.LossDetails,this.GarageLoss);
    let partyNo = "";let lossId = "",garageId=null;
      if(this.data){
        if(this.data?.garageId) garageId=this.data?.garageId;
      }
      if(this.LossDetails.PartyNo){
          partyNo = this.LossDetails.PartyNo;
          lossId = this.LossDetails.LosstypeId;
      }
      else if(this.GaragaeAuthData){
          partyNo = this.GaragaeAuthData.PartyNo;
          lossId = this.GaragaeAuthData.LosstypeId;
      }
      let status = "";
      if(this.LossDetails.Status== 'CLG' && this.LossDetails.newStatus != undefined){
        status = this.LossDetails.newStatus
      }
      else{
        status = this.LossDetails.Status
      }
    let ReqObj = {
      "loginId": this.logindata.LoginId,
      "InsuranceId": this.logindata.InsuranceId,
      "Usertype": this.logindata.UserType,
      "PartyNo": partyNo,
      "LosstypeId": lossId,
      "SubStatus": status
    }
    let UrlLink = null;
    if(this.logindata.InsuranceId=='100002') UrlLink = `api/statusmasterdropdown`;
    else if(this.logindata.InsuranceId=='100003' || this.logindata.InsuranceId=='100008') UrlLink = `api/statusmasterdropdownV1`;
    let response = (await this.lossService.onStatusList(UrlLink, ReqObj)).toPromise()
      .then(res => {
        console.log("status list", res);
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  onStatusSelect(event) {
    console.log(event);
    let StatusDesc = this.statusList.find((ele: any) => ele.CodeDesc == event);
    this.StatusCode=StatusDesc.Code;
    console.log(this.StatusCode);
  }

  onUpdateStatus(event) {
    let i = 0;
    if(this.GaragaeAuthData){
      if((this.StatusCode == 'CFA' ||  this.StatusCode == 'AFA' || this.StatusCode == 'RFA') && this.GaragaeAuthData.ClaimApproverYn == 'N'){
        i+=1;
      }
      else{
        i = 0;
      }
    }
    else{
      i = 0;
    }
    if(i==0){
      let UrlLink = null;
      if(this.logindata.InsuranceId=='100002') UrlLink = `api/updateclaimstatus`;
      else if(this.logindata.InsuranceId=='100003' || this.logindata.InsuranceId=='100008') UrlLink = `api/updateclaimstatusV1`; 
      let partyNo = "";let lossId = "",garageId=null;
      if(this.data){
        if(this.data?.garageId) garageId=this.data?.garageId;
      }
      if(this.LossDetails.PartyNo){
          partyNo = this.LossDetails.PartyNo;
          lossId = this.LossDetails.LosstypeId;
      }
      else if(this.GaragaeAuthData){
          partyNo = this.GaragaeAuthData.PartyNo;
          lossId = this.GaragaeAuthData.LosstypeId;
      }
      let ReqObj = {
        "ClaimNo": this.LossDetails.ClaimNo,
        "PolicyNo": this.LossDetails.PolicyNo,
        "InsuranceId": this.logindata.InsuranceId,
        "Status": this.StatusCode,
        "BranchCode": this.logindata.BranchCode,
        "RegionCode": this.logindata.RegionCode,
        "CreatedBy": this.logindata.LoginId,
        "Remarks": this.statusUpdateRemarks.value,
        "UserType": this.logindata.UserType,
        "PartyNo": partyNo,
        "Losstypeid": lossId,
        "Authcode": sessionStorage.getItem('UserToken')
      }
      if(garageId!=null) ReqObj['GarageId'] = garageId;


      console.log(ReqObj,this.LossDetails,event);

      return this.lossService.onUpdateStatus(UrlLink, ReqObj).subscribe(async (data: any) => {

        console.log("saveloss", data);
        if (data.Response == "Success") {
          
          Swal.fire(
            `Status Updated Successfully`,
            'success'
          );
          sessionStorage.removeItem("GarageLossDetails");
          if (this.router.url == '/Home/Loss' ) {
            window.location.reload();
          }
          else if(this.router.url == '/Home/Table'){
            this.dialogRef.close(true);
            this.router.navigate(['/Home']);
          }
          else {
            this.dialogRef.close(true);
            // if(this.StatusCode=='PFA' || this.StatusCode=='AFA') this.onUpdateClaimApproverStatus();
            // else this.dialogRef.close(true);
          }
        }
        if (data.Errors) {
          console.log(data);
          this.errorService.showValidateError(data.Errors);

        }
      }, (err) => {
        this.handleError(err);
      })
    }
    else{
      Swal.fire(
        `Only Approver Allowed to Do this Action`,
        'Error',
        'error'
      );
    }


  }
  onUpdateClaimApproverStatus(){
    let UrlLink = `api/updateclaimapproverstatus`;
    let partyNo = "";let lossId = "",garageId=null;
    if(this.data){
      if(this.data?.garageId) garageId=this.data?.garageId;
    }
    if(this.LossDetails.PartyNo){
        partyNo = this.LossDetails.PartyNo;
        lossId = this.LossDetails.LosstypeId;
    }
    else if(this.GaragaeAuthData){
        partyNo = this.GaragaeAuthData.PartyNo;
        lossId = this.GaragaeAuthData.LosstypeId;
    }
    let ReqObj = {
      "ClaimNo": this.LossDetails.ClaimNo,
      "PolicyNo": this.LossDetails.PolicyNo,
      "InsuranceId": this.logindata.InsuranceId,
      "Status": this.StatusCode,
      "BranchCode": this.logindata.BranchCode,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "Remarks": this.statusUpdateRemarks.value,
      "UserType": this.logindata.UserType,
      "PartyNo": partyNo,
      "Losstypeid": lossId,
      "Authcode": sessionStorage.getItem('UserToken')
    }
    if(garageId!=null) ReqObj['GarageId'] = garageId;


    console.log(ReqObj,this.LossDetails,event);

    return this.lossService.onUpdateStatus(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("saveloss", data);
      if (data.Response == "Success") {
        this.dialogRef.close(true);
      }
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

}
