import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-document-information',
  templateUrl: './document-information.component.html',
  styleUrls: ['./document-information.component.css']
})
export class DocumentInformationComponent implements OnInit {
  @Input() public claimInformation:any;
  @Input() public claimRefNo:any;
  claimInfo:any;
  logindata: any;
  constructor() {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
      this.claimInfo = {
        "LosstypeId":"52",
        "PartyNo":"1",
        "ClaimRefNo":null,
        "CreatedBy" : null
      }
   }

  ngOnInit(): void {
    if(this.claimInformation){
      this.claimInfo.ClaimRefNo = this.claimInformation.Claimrefno;
      this.claimInfo.CreatedBy = this.claimInformation.CreatedBy;
    }
    else{
      this.claimInformation = {};
      this.claimInfo.ClaimRefNo = sessionStorage.getItem('editClaimId');
      this.claimInfo.CreatedBy = this.logindata.LoginId;
    }
    
  }

}
