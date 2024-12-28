import { Component, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { PolicyService } from 'src/app/commonmodule/policy/policy.service';
import { CommondataService } from '../../services/commondata.service';
import { ErrorService } from '../../services/errors/error.service';

@Component({
  selector: 'app-policy-information',
  templateUrl: './policy-information.component.html',
  styleUrls: ['./policy-information.component.css']
})
export class PolicyInformationComponent implements OnInit,OnChanges {
  @Input() PolicyInformation;
  public logindata: any;
  public subscribers;
  public panelOpen:boolean=false;
  constructor(
    private commondataService: CommondataService,
    private errorService: ErrorService,
    private policyService: PolicyService,
  ) { }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    console.log("Policy Info",this.PolicyInformation)

  }

  ngOnChanges(){
    this.PolicyInformation;
  }

  commonReqObject() {
    return {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId":  this.logindata?.OaCode

    }
  }
  onViewInfo(){
    this.panelOpen = !this.panelOpen;
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
