import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { log } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs/internal/Subscription';
import { ClaimjourneyService } from 'src/app/commonmodule/claimjourney/claimjourney.service';
import { DashboardTableService } from 'src/app/commonmodule/dashboard-table/dasboard-table.service';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { NewLossModalComponent } from 'src/app/commonmodule/loss/new-loss-modal/new-loss-modal.component';
import { NewPartyModalComponent } from 'src/app/commonmodule/loss/new-party-modal/new-party-modal.component';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { StatusTrackComponent } from 'src/app/shared/statusTrackComponent/status-track.component';

@Component({
  selector: 'app-claim-search',
  templateUrl: './claim-search.component.html',
  styleUrls: ['./claim-search.component.css']
})
export class ClaimSearchComponent implements OnInit{
  innerColumnHeader: { Remarks: string; EntryDate: string; };
  partyList: any;
  columnHeader: ({ key: string; display: string; config?: undefined; } | { key: string; display: string; config: { onCSView: boolean; actions: string[]; }; })[];
  tableData: any;
  logindata: any;
  data: any;
  claimNo: any;
  policyNo: any;
  losstypeId: any;
  partyId: any;
  RefNumber:any;
  public claimDetails: any = {};
  public PolicyInformation: any;
  public ClaimSummary: any;
  public getClaimInformation: any;
  public PartyList: any = [];
  public Nationality: any = [];
  public claimLossTypeList: any=null;
  public claimIntimateValue: any = {};
  private subscription = new Subscription();
  count:any=0;
  public ImageObj:any={};
  totalTrackList: any[]=[];
  currentStatus: any;
  CSData:boolean=false;
  currentStatusUpdatedTime: any;
  pendingTrackList: any[]=[];
  completedTrackList: any[]=[];
  constructor( private lossService: LossService,
    private errorService: ErrorService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NewLossModalComponent>,
    private dialogRef2: MatDialogRef<StatusTrackComponent>,
    private ngZone: NgZone,
    private spinner: NgxSpinnerService,
    private commondataService: CommondataService,
    private dashboardTableService: DashboardTableService,
    private claimjourneyService: ClaimjourneyService,
    private router: Router,){
    
  }
  
  ngOnInit(): void {


    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    console.log("Data",this.data);
    if(this.data){
      this.claimNo = this.data?.ClaimNo;
      this.policyNo = this.data?.PolicyNo;
      this.losstypeId = this.data?.LosstypeId;
      this.partyId = this.data?.PartyNo;
      this.getTrackingDetails();
    }

    
   
    this.tableData =[{
      "Losstypedescp":"Prem",
      "LossNo":"77495774",
      "TotalPrice":"5675767866",
      "CreatedBy":"Officer",
      "Statusdescrip":"Active",

    }]
   
  }

  async onInitialFetchData() {
    //this.Nationality = await this.commondataService.onGetNationality();
    //this.commondataService.getNationality(this.Nationality);
    this.partyList = await this.lossService.onGetPartyList();
    
    if (this.partyList?.Errors) {
      this.errorService.showValidateError(this.partyList?.Errors);
    } else {
      await this.onGetLossList(this.partyList[0]);
      
    }
  }
  async onGetLossList(item) {
    this.tableData = undefined;
    this.tableData = await this.lossService.onGetLossList(item);
    console.log(this.tableData,"this.tableData");
    
    this.columnHeader = [
     
      { key: "Losstypedescp", display: "LOSS NAME" },
      { key: "LossNo", display: "LOSS NO" },
      { key: "TotalPrice", display: "TOTAL PRICE" },
      { key: "CreatedBy", display: "CREATED BY" },
      { key: "Statusdescrip", display: "LOSS STATUS" },
      // {
      //   key: "View",
      //   display: "View",
      //   config: {
      //     isLossAction: true,
      //     actions: ["VIEW"]
      //   }
      // },
      {
        key: "action",
        display: "View",
        config: {
          onCSView: true,
          actions: ["VIEW"]
        }
      },
    ];
    if(this.tableData){
      if(this.tableData.length!=0){
          this.losstypeId = this.tableData[0].LosstypeId;
          this.partyId = this.tableData[0].PartyNo;
          this.ClaimSearch(this.RefNumber)
      }
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


    onClaimLossStatusTrack(row){
      if(row){
        this.totalTrackList = [];
        this.losstypeId=row?.LosstypeId;
        this.partyId = row?.PartyNo;
        this.ClaimSearch(this.RefNumber)
      }
      this.CSData=true;
    //   this.totalTrackList =
    //   [
    //     {
    //         "StatusCode": "CI",
    //         "StatusDesc": "Claim Intimatied",
    //         "Substatus": "CI",
    //         "Substatusdescription": "Claim Intimated",
    //         "UserType": "user",
    //         "Trackingid": "",
    //         "Entrydate": "12/07/2024 09:52:48 AM",
    //         "CreatedBy": "26471766677",
    //         "Remarks": "Claim Intimated",
    //         "AllocatedTo": "",
    //         "CompletedYn": "Y",
    //         "Days": null
    //     },
    //     {
    //         "StatusCode": "CI",
    //         "StatusDesc": "Claim Intimatied",
    //         "Substatus": "CA",
    //         "Substatusdescription": "Claim Accepted",
    //         "UserType": "claimofficer",
    //         "Trackingid": "",
    //         "Entrydate": "12/07/2024 09:53:56 AM",
    //         "CreatedBy": "claim1uganda",
    //         "Remarks": "Claim Approved",
    //         "AllocatedTo": "",
    //         "CompletedYn": "Y",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "NC",
    //         "StatusDesc": "Notified Claims",
    //         "Substatus": "NC",
    //         "Substatusdescription": "Notified Claims",
    //         "UserType": "claimofficer",
    //         "Trackingid": null,
    //         "Entrydate": null,
    //         "CreatedBy": null,
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "N",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "RCL",
    //         "StatusDesc": "Claim Rejected",
    //         "Substatus": "RCL",
    //         "Substatusdescription": "Claim Rejected",
    //         "UserType": "claimofficer",
    //         "Trackingid": null,
    //         "Entrydate": null,
    //         "CreatedBy": null,
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "N",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "CI",
    //         "StatusDesc": "Pending Loss Created",
    //         "Substatus": "PLC",
    //         "Substatusdescription": "Pending Loss Created",
    //         "UserType": "claimofficer",
    //         "Trackingid": "2412632423863",
    //         "Entrydate": "12/07/2024 09:54:23 AM",
    //         "CreatedBy": "claim1uganda",
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "Y",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "PFSS",
    //         "StatusDesc": "Allocate Surveyor",
    //         "Substatus": "AS",
    //         "Substatusdescription": "Allocate Surveyor",
    //         "UserType": "claimofficer",
    //         "Trackingid": "241263245095",
    //         "Entrydate": "12/07/2024 09:54:50 AM",
    //         "CreatedBy": "claim1uganda",
    //         "Remarks": null,
    //         "AllocatedTo": "claim1uganda",
    //         "CompletedYn": "Y",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "SS",
    //         "StatusDesc": "Appraisal Submitted",
    //         "Substatus": "SD",
    //         "Substatusdescription": "Appraisal Submitted",
    //         "UserType": "surveyor",
    //         "Trackingid": null,
    //         "Entrydate": null,
    //         "CreatedBy": null,
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "N",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "QAFG",
    //         "StatusDesc": "Quote Awaited From Garage",
    //         "Substatus": "QAFG",
    //         "Substatusdescription": "Quote Awaited From Garage",
    //         "UserType": "claimofficer",
    //         "Trackingid": null,
    //         "Entrydate": null,
    //         "CreatedBy": null,
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "N",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "QS",
    //         "StatusDesc": "Quotation Submitted",
    //         "Substatus": "QS",
    //         "Substatusdescription": "Quotation Submitted",
    //         "UserType": "garage",
    //         "Trackingid": null,
    //         "Entrydate": null,
    //         "CreatedBy": null,
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "N",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "SLPR",
    //         "StatusDesc": "Suppliementary LPO Processed",
    //         "Substatus": "SLPR",
    //         "Substatusdescription": "Suppliementary LPO Processed",
    //         "UserType": "surveyor",
    //         "Trackingid": null,
    //         "Entrydate": null,
    //         "CreatedBy": null,
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "N",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "AFA",
    //         "StatusDesc": "Approved From Approver",
    //         "Substatus": "AFA",
    //         "Substatusdescription": "Approved From Approver",
    //         "UserType": "claimofficer",
    //         "Trackingid": null,
    //         "Entrydate": null,
    //         "CreatedBy": null,
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "N",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "RGFR",
    //         "StatusDesc": "Vehicle Under Process",
    //         "Substatus": "UP",
    //         "Substatusdescription": "Vehicle Under Process",
    //         "UserType": "garage",
    //         "Trackingid": null,
    //         "Entrydate": null,
    //         "CreatedBy": null,
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "N",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "RG",
    //         "StatusDesc": "Vehicle Release Generated",
    //         "Substatus": "RG",
    //         "Substatusdescription": "Vehicle Release Generated",
    //         "UserType": "claimofficer",
    //         "Trackingid": null,
    //         "Entrydate": null,
    //         "CreatedBy": null,
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "N",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "PFS",
    //         "StatusDesc": "Settlement Processed",
    //         "Substatus": "PFS",
    //         "Substatusdescription": "Settlement Processed",
    //         "UserType": "claimofficer",
    //         "Trackingid": null,
    //         "Entrydate": null,
    //         "CreatedBy": null,
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "N",
    //         "Days": "0"
    //     },
    //     {
    //         "StatusCode": "NCS",
    //         "StatusDesc": "No Claim",
    //         "Substatus": "NCS",
    //         "Substatusdescription": "No Claim",
    //         "UserType": "claimofficer",
    //         "Trackingid": null,
    //         "Entrydate": null,
    //         "CreatedBy": null,
    //         "Remarks": null,
    //         "AllocatedTo": null,
    //         "CompletedYn": "N",
    //         "Days": "0"
    //     }
    // ]
    }

    ClaimSearch(rowData){
      let urlLink1 = 'api/view/claimupdatestatus';
      let ReqObj = {
        "ClaimRefNo": rowData,
        "LossTypeId": this.losstypeId,
        "PartyNo": this.partyId
      }
      this.lossService.onGetClaimLossDetails(urlLink1, ReqObj).subscribe((data: any) => {
        let res = data.Response;
        if(res){
          this.totalTrackList = data.Response.COMPLETED.concat(data.Response.PENDING);
          this.completedTrackList = data.Response.COMPLETED;
          this.pendingTrackList = data.Response.PENDING;
          console.log(this.pendingTrackList,"data.Response.COMPLETED");
          console.log(this.completedTrackList,"data.Response.COMPLETED");
          // this.completedTrackList['UserType'] = 'claimofficer';
          // this.pendingTrackList['UserType'] = 'user';
          if(this.totalTrackList?.length!=0){
            this.CSData = true;
          }
        }
      });
    }
    getLossName(){
      if(this.losstypeId){
        return this.tableData.find(ele=>ele.LosstypeId==this.losstypeId)?.CategoryDesc;
      }
      else return '';
    }
    setCommonValues(rowData){
      let ReqObj = {
        "Claimrefno": rowData
      }
      let UrlLink = `api/getclaimno`;
      this.lossService.onGetClaimLossDetails(UrlLink, ReqObj).subscribe((data: any) => {
        let res = data;
          this.claimNo = res.ClaimNo;
            sessionStorage.setItem('ChassisNumber',res.ChassisNo)
            let chassisNo = sessionStorage.getItem('ChassisNumber');
            if(this.claimNo){
              let ReqObj = {
                "ClaimNo": this.claimNo,
                "CustomerId": 123,
                "GarageId": 0,
                "PolicyNo": res.PolicyNo,
                "ProductId": 66,
                "ChassisNo": res.ChassisNo,
                ...this.lossService.commonReqObject()
              }
          
              let UrlLink = `api/claimdetailsbyid`;
              this.lossService.onGetClaimLossDetails(UrlLink, ReqObj).subscribe((data: any) => {
                  this.lossService.onPassClaimData(data);
                  this.subscription = this.claimjourneyService.getpolicyInfo.subscribe(async (event: any) => {
                    this.PolicyInformation = event;
                    if (event != null) {
                    } else {
                      this.claimjourneyService.onGetPolicyDetails(sessionStorage.getItem("PolicyNumber"),'byChassisNo',rowData);
                    }
              
                  });
                  sessionStorage.setItem("ClaimDetails", JSON.stringify(data));
                  sessionStorage.setItem("PolicyNumber", data.PolicyNo);
                  this.onInitialFetchData();
                  this.subscription = this.lossService.getPartyList.subscribe(async (event: any) => {
                    this.PartyList = event;
                  });
                })
            }
        }); 
  
      this.subscription = this.commondataService.nationalityList.subscribe((event: any) => {
        this.Nationality = event;
      })
    }
}
