import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
export interface PeriodicElement {
  AllotedYn: any,
  ApprovedYn: any,
  BranchCode: any,
  ChassisNo: any,
  ClaimNo: any,
  ClaimofficerRemarks: any,
  ConsumablesCost: any,
  CreatedBy: any,
  GarageId: any,
  GarageName: any,
  InsuranceId: any,
  LabourCost: any,
  LosstypeId: any,
  PartyNo: any,
  PerHourLabourCost: any,
  PolicyNo: any,
  ProductId: any,
  RegionCode: any,
  RegionId: any,
  Response: any,
  SalvageAmount: any,
  SubStatus: any,
  SurveyorLoginId: any,
  TotalLabourHour: any,
  TotalPrice: any,
  VehpartsId: any,
}
@Component({
  selector: 'app-alloted-garages',
  templateUrl: './alloted-garages.component.html',
  styleUrls: ['./alloted-garages.component.css']
})
export class AllotedGaragesComponent implements OnInit {
  public tableData: PeriodicElement[];
  public columnHeader: any;
  logindata: any;
  selectedGarageId: any;
  selectedGarageLoginId: any;
  garageReq: { ClaimNo: any; PartyNo: any; LosstypeId: any; PolicyNo: any; SurveyorChoosenGarage: string; GarageId: any; ApprovedYn: string; ExpectedStartdate: string; LabourCost: string; Noofdays: string; Uploadquatationyn: string; GarageRemarks: string; Remarks: string; AllotedYn: string; SaveorSubmit: string; SparepartsCost: string; VehpartsId: any[]; ConsumablesCost: string; ClaimofficerRemarks: string; TotalLabourHour: string; PerHourLabourCost: string; SalvageAmount: string; TotalPrice: string; BranchCode: string; InsuranceId: string; RegionCode: string; CreatedBy: any; UserType: string; };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialogRef: MatDialogRef<AllotedGaragesComponent>,


  ) { 
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
  }

  ngOnInit(): void {
    let entry = this.data.some(ele=>ele.ApprovedYn=='Y' || ele.ApprovedYn=='A');
    let status = this.data.some(ele=>ele.SubStatus=='SD')
    if(!entry && status && this.logindata?.UserType == "surveyor"){
      this.columnHeader = [
        { key: "OaCode", display: "SELECT",
          config: {
            isGarageSelect: true
          }
        },
        { key: "GarageId", display: "GARAGE ID" },
        { key: "GarageName", display: "GARAGE NAME" },
        {
          key: "ApprovedYn", display: "GARAGE STATUS",
          config: {
            isGarage: true,
            values: { Y: "Quote Submitted", R: "Quote Rejected", N: "Quote Pending",A: "Quote Accepted",CL:"Clarified" }
          }
        },
        {
          key: "AllotedYn", display: "SURVEYOR",
          config: {
            isClaimOfficer: true,
            values: { CA: "Approved", CR: "Rejected", Y: "Pending",CL: "Clarification Want" }
          }
        },
  
        {
          key: "ViewGarage",
          display: "VIEW GARAGE",
          config: {
            isGarageViewEdit: true,
            actions: ["EDIT"]
          },
        },
        {
          key: "lopGarage",
          display: "LPO",
          config: {
            isGarageLOPEdit: true,
            actions: ["LPO"]
          },
        },
      ];
    }
    else{
      this.columnHeader = [
        { key: "GarageId", display: "GARAGE ID" },
        { key: "GarageName", display: "GARAGE NAME" },
        {
          key: "ApprovedYn", display: "GARAGE STATUSSS",
          config: {
            isGarage: true,
            values: { Y: "Quote Submitted", R: "Quote Rejected", N: "Quote Pending",A: "Quote Accepted",CL:"Clarified" }
          }
        },
        {
          key: "AllotedYn", display: "CLAIMOFFICER",
          config: {
            isClaimOfficer: true,
            values: { CA: "Approved", CR: "Rejected", Y: "Pending",CL:"Clarification Want" }
          }
        },
        {
          key: "QuoteProcessedBy", display: "QUOTE PROCESSED BY",
          
        },
        {
          key: "ViewGarage",
          display: "VIEW GARAGE",
          config: {
            isGarageViewEdit: true,
            actions: ["EDIT"]
          },
        },
        {
          key: "lopGarage",
          display: "LPO",
          config: {
            isGarageLOPEdit: true,
            actions: ["LPO"]
          },
        },
      ];
    }
    
    this.tableData = this.data;
    console.log(this.data);
  }
  onGarageSelect(row){
    console.log("Selected Covers",row);
    this.selectedGarageId = row.GarageId;
    this.selectedGarageLoginId = row.GarageLoginId;
    this.garageReq =  {
        "ClaimNo": row?.ClaimNo,
        "PartyNo": row.PartyNo,
        "LosstypeId": row.LosstypeId,
        "PolicyNo": row.PolicyNo,
        "SurveyorChoosenGarage":"true",
        "GarageId": row.GarageId,
        "ApprovedYn": "Y",
        "ExpectedStartdate": "",
        "LabourCost": "0",
        "Noofdays": "0",
        "Uploadquatationyn": "N",
        "GarageRemarks": "Garage Allotted",
        "Remarks": "",
        "AllotedYn": "CA",
        "SaveorSubmit": "Submit",
        "SparepartsCost": "0",
        "VehpartsId": [],
        "ConsumablesCost": "0",
        "ClaimofficerRemarks": "",
        "TotalLabourHour": "0",
        "PerHourLabourCost": "0",
        "SalvageAmount": "0",
        "TotalPrice": "0",
        "BranchCode": "09",
        "InsuranceId": "100002",
        "RegionCode": "09",
        "CreatedBy": row?.GarageLoginId,
        "UserType": "garage"
    }
  }
  onGetGarageDetails(row) {
    sessionStorage.setItem("GarageLossDetails", JSON.stringify(row));
    this.router.navigate(['/Home/Garage']);
    this.dialogRef.close();

  }
  onApproveGarage(){
    sessionStorage.removeItem("GarageLossDetails");
    this.dialogRef.close(this.garageReq);
  }
}
