import { NgxSpinnerService } from 'ngx-spinner';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { MatDialog } from '@angular/material/dialog';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
@Component({
  selector: 'app-search-claim-details',
  templateUrl: './search-claim-details.component.html',
  styleUrls: ['./search-claim-details.component.css']
})

export class SearchClaimDetailsComponent implements OnInit {
  public columnHeader: any;
  public innerColumnHeader: any;
  public columnHeader1:any;
  public columnHeader2:any;
  public columnHeader3:any;

  public innerColumnHeader1:any;
  public innerColumnHeader2:any;
  public innerColumnHeader3:any;



  public columnHeader4: any;
  panelOpenState = false;
  policyNumber: any = "";
  public regNumber:any;
  public logindata: any;
  public statusKey: any;
  public claimStatusKey: any;
  enteredSection:any = null;
  public NotifiedClaims: any[]=[];
  public ApprovedClaims: any[]=[];
  public RejectedClaims: any[]=[];
  public ClarificationClaims: any[]=[];
  chassisSection: boolean = false;
  chassisList: any[] = [];
  MobileNumber: string;coInsuranceData:any[]=[];
  claimDetails: any;panelOpen:boolean=false;
  reserveDetails: any;
  claimInfo: any;
  constructor(
    private commondataService: CommondataService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private router: Router,
    public dialog: MatDialog,
    private lossService: LossService,

  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    sessionStorage.removeItem('claimCreatedBy')
    sessionStorage.removeItem("ClaimDetails");
    this.claimStatusKey = [
      'Y',
      'A',
      'R',
      'C',
    ]
    let userType = this.logindata.UserType;
    console.log("LoginData", this.logindata)
    if (userType == 'user') {
      this.policyNumber = sessionStorage.getItem('SearchValue');
      this.MobileNumber = sessionStorage.getItem('mobileNo');
    }
    let claimData = JSON.parse(sessionStorage.getItem('viewClaimData'));
    if(claimData){ this.getClaimDetails(claimData);}
  }

  ngOnInit(): void {
  }
  

  onLogOut(){
    sessionStorage.clear();
    this.router.navigate(['/Login'])
  }

  getClaimDetails(event){
    let UrlLink = `api/viewclaimdetails/${event?.Claimrefno}`;
    this.lossService.getGender(UrlLink).subscribe((data: any) => {
      if(data){
        this.claimDetails = data;
        
        this.claimDetails = {
          "PolicyInfo": {
              "PolicyNo": "P11/120/2020/1002/10/0000040",
              "PolicyFrom": "21/12/2021",
              "PolicyTo": "21/12/2022",
              "Uwyear": "2022",
              "ProductDesc": "Motor Private",
              "ProductCode": "1001",
              "Endtno": "null",
              "Customer": "10120959",
              "Contactpername": "WARDAT AHMED HUSSEIN",
              "Civilid": "101117041",
              "Divisioncode": "100",
              "Department": "10",
              "Insured": "1",
              "Product": "01",
              "OutstandingAmt": "10000",
              "CurrencyCode": "TZS",
              "CurrencyName": "Tanzanian Shillings",
              "BranchCode": "09",
              "RegionCode": "09",
              "InsuranceId": "100002",
              "SectionCode": "01"
          },
          "VehicleInfo": {
              "Vehiclemakemodel": "null",
              "Platenocharacter": "456456SDD",
              "ChassisNo": "456456SDD",
              "Engineno": null,
              "Suminsured": "1",
              "Vehicletypedesc": "1",
              "Vehiclemodeldesc": "1",
              "Praihsifc": "1",
              "Praihpremfc": "1",
              "Vehtype": "1",
              "Vehmake": "null",
              "Vehmodel": "1",
              "Vehbodytype": "1",
              "Manufactureyear": "2022",
              "Vehiclecc": "345",
              "Seating": "30",
              "Tonnage": "4",
              "Tiraprodcode": "3",
              "Tiraprodcodedesc": "3",
              "VechRegNo": "456456SDD"
          },
          "CoInsuranceInfo": [{
              "PolicyNo": "P11/120/2020/1002/10/0000040",
              "CompanyName": "MO ASSURANCE COMPANY LIMITED",
              "SumInsured": "33600",
              "SharePercent": "80"
          }],
          "ClaimInfo": {
              "ClaimRefNo": "CI-23149",
              "Policereportno": null,
              "Policereportsource": null,
              "Accidentdate": "06/06/2022",
              "Claimchannnel": null,
              "Accidentdescription": null,
              "Accidenttime": "03:00",
              "Accidentplace": "Chennai",
              "Contactno": "5675676577",
              "Faxno": null,
              "Email": null,
              "Assuredaddress": null,
              "AssuredName": "WARDAT AHMED HUSSEIN",
              "ClaimStatus": "A",
              "Remarks": "",
              "EntryDate": "10/01/2024 13:05:41",
              "PolicyNo": "P11/120/2020/1002/10/0000040",
              "InsuranceId": "100002",
              "BranchCode": "09",
              "RegionCode": "09",
              "CustMobCode": "+255",
              "ClaimNo": "CLM/100002/09/24/30061",
              "ClaimApprovedBy": "Urusula_Mtanda",
              "ClaimApprovedDate": "10/01/2024",
              "ApprovedRemarks": null,
              "ClaimIntimatedDate": "10/01/2024",
              "ClaimIntimatedBy": "Urusula_Mtanda",
              "DrivenBy": "Driver",
              "LossDetails": [{
                  "CategoryId": 1,
                  "CategoryDesc": "Primary Loss",
                  "LossTypeId": 16,
                  "LossTypeDesc": "Own Damage",
                  "EntryDate": "10/01/2024 13:09:41",
                  "CurrentStatus": "AFA",
                  "CurrentStatusDesc": "Approved From Approver",
                  "Remarks": "Approved From Approver",
                  "ApprovedDate": "11/01/2024 12:42:33",
                  "ApproverId": "SuganyaClaimOfficer",
                  "PartyNo": 1,
                  "PartyName": "WARDAT AHMED HUSSEIN",
                  "LossClaimAmounts": {
                      "OwnDamageYn": "Y",
                      "OwnDamageDetails": {
                          "SparePartsCost": "18",
                          "Consumables": "100",
                          "TotalLabourHours": "20",
                          "LabourCostPerHour": "1000.00",
                          "LabourCost": "20000",
                          "LessBetterment": "100.00",
                          "LessExcess": "200.00",
                          "YoungAgeDriver": "300",
                          "UnderInsurance": "400.00",
                          "SalvageAmount": "500.00",
                          "TotalAmount": "19218",
                          "VatYn": "N",
                          "VatAmount": "",
                          "TotalPayable": "19218",
                          "DamageDetails": [{
                              "SparepartsCost": "10",
                              "Noofhours": "10",
                              "Depreciation": "10",
                              "Discount": "10",
                              "DepreciationAmount": "10",
                              "DiscountAmount": "1",
                              "RepairorderId": "2",
                              "RepairorderDesc": "Replace",
                              "EntryDate": "11/01/2024",
                              "Vehdamagesideid": 3,
                              "Vehdamagesidedesc": "Bumper Grille"
                          }, {
                              "SparepartsCost": "10",
                              "Noofhours": "10",
                              "Depreciation": "10",
                              "Discount": "10",
                              "DepreciationAmount": "10",
                              "DiscountAmount": "1",
                              "RepairorderId": "2",
                              "RepairorderDesc": "Replace",
                              "EntryDate": "11/01/2024",
                              "Vehdamagesideid": 2,
                              "Vehdamagesidedesc": "Hood or Bonnet         "
                          }]
                      },
                      "TppdPrimaryLossYn": "N",
                      "TppdPrimaryLossDetails": null,
                      "OtherPrimaryLossYn": "N",
                      "OtherPrimaryLossDetails": null,
                      "TheftLossYn": "N",
                      "TheftLossDetails": null,
                      "TotalLossYn": "N",
                      "TotalLossDetails": null,
                      "SecondaryLossYn": "N",
                      "SecondaryLossDetails": null
                  },
                  "CompletedStatuses": [{
                      "StatusCode": "CI",
                      "StatusDesc": "Claim Intimation",
                      "Substatus": "Y",
                      "Substatusdescription": "Claim Intimated",
                      "UserType": "claimofficer",
                      "Trackingid": "241006374758",
                      "Entrydate": "10/01/2024 13:07:04 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "CI",
                      "StatusDesc": "Claim Intimation",
                      "Substatus": "Y",
                      "Substatusdescription": "Intimated Claim Updated",
                      "UserType": "claimofficer",
                      "Trackingid": "2410063717388",
                      "Entrydate": "10/01/2024 13:07:17 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "CI",
                      "StatusDesc": "Claim Intimation",
                      "Substatus": "R",
                      "Substatusdescription": "Claim Rejected",
                      "UserType": "claimofficer",
                      "Trackingid": "2410063729393",
                      "Entrydate": "10/01/2024 13:07:29 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "CI",
                      "StatusDesc": "Claim Intimation",
                      "Substatus": "C",
                      "Substatusdescription": "Clarification Requested",
                      "UserType": "claimofficer",
                      "Trackingid": "241006375543",
                      "Entrydate": "10/01/2024 13:07:55 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "CI",
                      "StatusDesc": "Claim Approved",
                      "Substatus": "PPC",
                      "Substatusdescription": "Pending Party Created",
                      "UserType": "claimofficer",
                      "Trackingid": "241006393259",
                      "Entrydate": "10/01/2024 13:09:03 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "CI",
                      "StatusDesc": "Pending Loss Created",
                      "Substatus": "PLC",
                      "Substatusdescription": "Pending Loss Created",
                      "UserType": "claimofficer",
                      "Trackingid": "2410063941575",
                      "Entrydate": "10/01/2024 13:09:41 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "PFSS",
                      "StatusDesc": "Allocate Surveyor",
                      "Substatus": "AS",
                      "Substatusdescription": "Allocate Surveyor",
                      "UserType": "claimofficer",
                      "Trackingid": "2411043133131",
                      "Entrydate": "11/01/2024 11:01:33 am",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": "sdfsdf",
                      "AllocatedTo": "Viren_Tulsi",
                      "Days": "0"
                  }, {
                      "StatusCode": "PFSS",
                      "StatusDesc": "Quote Awaited From Garage",
                      "Substatus": "QAFG",
                      "Substatusdescription": "Quote Awaited From Garage",
                      "UserType": "claimofficer",
                      "Trackingid": "241104326348",
                      "Entrydate": "11/01/2024 11:02:06 am",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": "sdfsdf",
                      "AllocatedTo": "garage1alliance",
                      "Days": "0"
                  }, {
                      "StatusCode": "PFSS",
                      "StatusDesc": "Appraisal Approved",
                      "Substatus": "SA",
                      "Substatusdescription": "Surveyor Approved",
                      "UserType": "surveyor",
                      "Trackingid": "2411043344981",
                      "Entrydate": "11/01/2024 11:03:44 am",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": null,
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "0"
                  }, {
                      "StatusCode": "PFSS",
                      "StatusDesc": "Appraisal Approved",
                      "Substatus": "SA",
                      "Substatusdescription": "Appraisal Approved",
                      "UserType": "surveyor",
                      "Trackingid": "2411043345497",
                      "Entrydate": "11/01/2024 11:03:45 am",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": null,
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "0"
                  }, {
                      "StatusCode": "PFSS",
                      "StatusDesc": "Appraisal Approved",
                      "Substatus": "SA",
                      "Substatusdescription": "Surveyor Approved",
                      "UserType": "surveyor",
                      "Trackingid": "2411044525724",
                      "Entrydate": "11/01/2024 11:15:25 am",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": null,
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "0"
                  }, {
                      "StatusCode": "SS",
                      "StatusDesc": "Appraisal Submitted",
                      "Substatus": "SD",
                      "Substatusdescription": "Appraisal Submitted",
                      "UserType": "surveyor",
                      "Trackingid": "2411044539852",
                      "Entrydate": "11/01/2024 11:15:39 am",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": "Appraisal Submitted",
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "0"
                  }, {
                      "StatusCode": "QS",
                      "StatusDesc": "Quotation Submitted",
                      "Substatus": "QS",
                      "Substatusdescription": "Quotation Submitted",
                      "UserType": "garage",
                      "Trackingid": "241104584410",
                      "Entrydate": "11/01/2024 11:28:04 am",
                      "CreatedBy": "garage1alliance",
                      "Remarks": "None",
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "0"
                  }, {
                      "StatusCode": "SS",
                      "StatusDesc": "Claim Intimation",
                      "Substatus": null,
                      "Substatusdescription": null,
                      "UserType": "garage",
                      "Trackingid": "2411045816447",
                      "Entrydate": "11/01/2024 11:28:16 am",
                      "CreatedBy": "garage1alliance",
                      "Remarks": "Quote Submitted",
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "0"
                  }, {
                      "StatusCode": "SLP",
                      "StatusDesc": "Supplementary LPO",
                      "Substatus": "SLP",
                      "Substatusdescription": "Supplementary LPO",
                      "UserType": "surveyor",
                      "Trackingid": "241106100130",
                      "Entrydate": "11/01/2024 12:40:00 pm",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": "Lpo Pending",
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "0"
                  }, {
                      "StatusCode": "SLPR",
                      "StatusDesc": "Suppliementary LPO Processed",
                      "Substatus": "SLPR",
                      "Substatusdescription": "Suppliementary LPO Processed",
                      "UserType": "surveyor",
                      "Trackingid": "2411061029970",
                      "Entrydate": "11/01/2024 12:40:29 pm",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": "Lpo Proccessed",
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "0"
                  }, {
                      "StatusCode": "PFA",
                      "StatusDesc": "Pending From Approver",
                      "Substatus": "PFA",
                      "Substatusdescription": "Pending From Approver",
                      "UserType": "surveyor",
                      "Trackingid": "2411061116646",
                      "Entrydate": "11/01/2024 12:41:16 pm",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": "Pending From Approver",
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "0"
                  }, {
                      "StatusCode": "AFA",
                      "StatusDesc": "Approved From Approver",
                      "Substatus": "AFA",
                      "Substatusdescription": "Approved From Approver",
                      "UserType": "claimofficer",
                      "Trackingid": "2411061233641",
                      "Entrydate": "11/01/2024 12:42:33 pm",
                      "CreatedBy": "SuganyaClaimOfficer",
                      "Remarks": "Approved From Approver",
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "0"
                  }],
                  "NotCompletedStatuses": [{
                      "StatusCode": "RGFR",
                      "StatusDesc": "Vehicle Under Process",
                      "Substatus": "UP",
                      "Substatusdescription": "Vehicle Under Process",
                      "UserType": "garage",
                      "Days": "1"
                  }, {
                      "StatusCode": "RG",
                      "StatusDesc": "Vehicle Release Generated",
                      "Substatus": "RG",
                      "Substatusdescription": "Vehicle Release Generated",
                      "UserType": "claimofficer",
                      "Days": "1"
                  }, {
                      "StatusCode": "PFS",
                      "StatusDesc": "Settlement Processed",
                      "Substatus": "PFS",
                      "Substatusdescription": "Settlement Processed",
                      "UserType": "claimofficer",
                      "Days": "1"
                  }],
                  "GarageQuotes": [{
                      "GarageId": "20025",
                      "GarageName": "Garage one",
                      "GarageAddress": "Tanzania",
                      "AllotedYn": "CA",
                      "ApprovedYn": "Y",
                      "LabourCost": "100000",
                      "ConsumablesCost": "100",
                      "TotalLabourHour": "100",
                      "PerHourLabourCost": "1000",
                      "SalvageAmount": "1000",
                      "TotalPrice": "110100",
                      "GarageLoginId": "garage1alliance"
                  }],
                  "PaymentHistory": [{
                      "PaymentId": "10103",
                      "ReserveId": "30124",
                      "PaymentTypeId": "Cash",
                      "PaymentType": "1",
                      "PaidTo": "Samilla",
                      "PaidDate": "12/01/2024 00:00:00",
                      "EntryDate": "12/01/2024 07:43:43",
                      "Remarks": "None",
                      "CreatedBy": "Urusula_Mtanda",
                      "PaidAmountFc": "9.75",
                      "PaidAmount": "22678",
                      "CurrencyCode": null,
                      "CurrencyName": null,
                      "InsuranceId": "100002",
                      "BranchCode": "09",
                      "ChequeNumber": null,
                      "ChequeDate": null,
                      "AccountNumber": null,
                      "BankShortCode": null,
                      "AccountHolderName": null,
                      "UserType": "claimofficer",
                      "Status": "Y",
                      "BankName": null,
                      "ChargeOrRefund": "C",
                      "ChargeOrRefundDesc": "Charge",
                      "PayeeRoleId": "2",
                      "PayeeRole": "Garage"
                  }]
              }, {
                  "CategoryId": 2,
                  "CategoryDesc": "Sub Loss",
                  "LossTypeId": 9,
                  "LossTypeDesc": "Total Theft",
                  "EntryDate": "10/01/2024 13:10:30",
                  "CurrentStatus": "AFA",
                  "CurrentStatusDesc": "Approved From Approver",
                  "Remarks": "aproved",
                  "ApprovedDate": "11/01/2024 13:18:42",
                  "ApproverId": "SuganyaClaimOfficer",
                  "PartyNo": 1,
                  "PartyName": "WARDAT AHMED HUSSEIN",
                  "LossClaimAmounts": {
                      "OwnDamageYn": "N",
                      "OwnDamageDetails": null,
                      "TppdPrimaryLossYn": "N",
                      "TppdPrimaryLossDetails": null,
                      "OtherPrimaryLossYn": "N",
                      "OtherPrimaryLossDetails": null,
                      "TheftLossYn": "Y",
                      "TheftLossDetails": {
                          "TheftDate": "10/01/2024",
                          "TheftTime": "04:00",
                          "TheftPlace": "Chennai",
                          "TheftStolen": "Mirror , Bumper",
                          "TheftEstReplace": "50000",
                          "TheftDiscovredBy": "Cctv",
                          "TheftReportedTo": "P3 Station",
                          "TheftReportedWhen": "Chennai",
                          "TheftReportedWhich": "11/01/2024",
                          "TheftCrDairyno": "P-546756756",
                          "TotalAmount": "50000",
                          "VatYn": "N",
                          "VatAmount": "",
                          "TotalPayable": "50000"
                      },
                      "TotalLossYn": "N",
                      "TotalLossDetails": null,
                      "SecondaryLossYn": "N",
                      "SecondaryLossDetails": null
                  },
                  "CompletedStatuses": [{
                      "StatusCode": "CI",
                      "StatusDesc": "Claim Intimation",
                      "Substatus": "Y",
                      "Substatusdescription": "Claim Intimated",
                      "UserType": "claimofficer",
                      "Trackingid": "241006374758",
                      "Entrydate": "10/01/2024 13:07:04 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "CI",
                      "StatusDesc": "Claim Intimation",
                      "Substatus": "Y",
                      "Substatusdescription": "Intimated Claim Updated",
                      "UserType": "claimofficer",
                      "Trackingid": "2410063717388",
                      "Entrydate": "10/01/2024 13:07:17 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "CI",
                      "StatusDesc": "Claim Intimation",
                      "Substatus": "R",
                      "Substatusdescription": "Claim Rejected",
                      "UserType": "claimofficer",
                      "Trackingid": "2410063729393",
                      "Entrydate": "10/01/2024 13:07:29 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "CI",
                      "StatusDesc": "Claim Intimation",
                      "Substatus": "C",
                      "Substatusdescription": "Clarification Requested",
                      "UserType": "claimofficer",
                      "Trackingid": "241006375543",
                      "Entrydate": "10/01/2024 13:07:55 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "CI",
                      "StatusDesc": "Claim Approved",
                      "Substatus": "PPC",
                      "Substatusdescription": "Pending Party Created",
                      "UserType": "claimofficer",
                      "Trackingid": "241006393259",
                      "Entrydate": "10/01/2024 13:09:03 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "CI",
                      "StatusDesc": "Pending Loss Created",
                      "Substatus": "PLC",
                      "Substatusdescription": "Pending Loss Created",
                      "UserType": "claimofficer",
                      "Trackingid": "2410064030910",
                      "Entrydate": "10/01/2024 13:10:30 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": null,
                      "AllocatedTo": null,
                      "Days": "0"
                  }, {
                      "StatusCode": "PFSS",
                      "StatusDesc": "Allocate Surveyor",
                      "Substatus": "AS",
                      "Substatusdescription": "Allocate Surveyor",
                      "UserType": "claimofficer",
                      "Trackingid": "2411063835132",
                      "Entrydate": "11/01/2024 13:08:35 pm",
                      "CreatedBy": "Urusula_Mtanda",
                      "Remarks": "Allocated",
                      "AllocatedTo": "Viren_Tulsi",
                      "Days": "1"
                  }, {
                      "StatusCode": "PFSS",
                      "StatusDesc": "Appraisal Approved",
                      "Substatus": "SA",
                      "Substatusdescription": "Appraisal Approved",
                      "UserType": "surveyor",
                      "Trackingid": "241106392342",
                      "Entrydate": "11/01/2024 13:09:02 pm",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": null,
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "1"
                  }, {
                      "StatusCode": "PFSS",
                      "StatusDesc": "Appraisal Approved",
                      "Substatus": "SA",
                      "Substatusdescription": "Surveyor Approved",
                      "UserType": "surveyor",
                      "Trackingid": "24110639217",
                      "Entrydate": "11/01/2024 13:09:02 pm",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": null,
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "1"
                  }, {
                      "StatusCode": "SS",
                      "StatusDesc": "Appraisal Submitted",
                      "Substatus": "SD",
                      "Substatusdescription": "Appraisal Submitted",
                      "UserType": "surveyor",
                      "Trackingid": "2411064010316",
                      "Entrydate": "11/01/2024 13:10:10 pm",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": "Apparaisal Submitted",
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "1"
                  }, {
                      "StatusCode": "SLP",
                      "StatusDesc": "Supplementary LPO",
                      "Substatus": "SLP",
                      "Substatusdescription": "Supplementary LPO",
                      "UserType": "surveyor",
                      "Trackingid": "2411064028844",
                      "Entrydate": "11/01/2024 13:10:28 pm",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": "Lpo Pending",
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "1"
                  }, {
                      "StatusCode": "SLPR",
                      "StatusDesc": "Suppliementary LPO Processed",
                      "Substatus": "SLPR",
                      "Substatusdescription": "Suppliementary LPO Processed",
                      "UserType": "surveyor",
                      "Trackingid": "2411064055780",
                      "Entrydate": "11/01/2024 13:10:55 pm",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": "lpo processed",
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "1"
                  }, {
                      "StatusCode": "PFA",
                      "StatusDesc": "Pending From Approver",
                      "Substatus": "PFA",
                      "Substatusdescription": "Pending From Approver",
                      "UserType": "surveyor",
                      "Trackingid": "2411064113844",
                      "Entrydate": "11/01/2024 13:11:13 pm",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": "Pending From Approver",
                      "AllocatedTo": "Urusula_Mtanda",
                      "Days": "1"
                  }, {
                      "StatusCode": "AFA",
                      "StatusDesc": "Approved From Approver",
                      "Substatus": "AFA",
                      "Substatusdescription": "Approved From Approver",
                      "UserType": "claimofficer",
                      "Trackingid": "2411064252387",
                      "Entrydate": "11/01/2024 13:12:52 pm",
                      "CreatedBy": "SuganyaClaimOfficer",
                      "Remarks": "Approved",
                      "AllocatedTo": "SuganyaClaimOfficer",
                      "Days": "1"
                  }, {
                      "StatusCode": "AFA",
                      "StatusDesc": "Approved From Approver",
                      "Substatus": "AFA",
                      "Substatusdescription": "Approved From Approver",
                      "UserType": "claimofficer",
                      "Trackingid": "241106484211",
                      "Entrydate": "11/01/2024 13:18:42 pm",
                      "CreatedBy": "SuganyaClaimOfficer",
                      "Remarks": "Approved",
                      "AllocatedTo": "SuganyaClaimOfficer",
                      "Days": "1"
                  }, {
                      "StatusCode": "AFA",
                      "StatusDesc": "Approved From Approver",
                      "Substatus": "AFA",
                      "Substatusdescription": "Approved From Approver",
                      "UserType": "surveyor",
                      "Trackingid": "2411065015361",
                      "Entrydate": "11/01/2024 13:20:15 pm",
                      "CreatedBy": "Viren_Tulsi",
                      "Remarks": "aproved",
                      "AllocatedTo": "SuganyaClaimOfficer",
                      "Days": "1"
                  }],
                  "NotCompletedStatuses": [{
                      "StatusCode": "RGFR",
                      "StatusDesc": "Vehicle Under Process",
                      "Substatus": "UP",
                      "Substatusdescription": "Vehicle Under Process",
                      "UserType": "garage",
                      "Days": "1"
                  }, {
                      "StatusCode": "RG",
                      "StatusDesc": "Vehicle Release Generated",
                      "Substatus": "RG",
                      "Substatusdescription": "Vehicle Release Generated",
                      "UserType": "claimofficer",
                      "Days": "1"
                  }, {
                      "StatusCode": "PFS",
                      "StatusDesc": "Settlement Processed",
                      "Substatus": "PFS",
                      "Substatusdescription": "Settlement Processed",
                      "UserType": "claimofficer",
                      "Days": "1"
                  }],
                  "GarageQuotes": null,
                  "PaymentHistory": []
              }],
              "ReserveDetails": {
                  "ReserveAmount": "200000",
                  "EntryDate": "12/01/2024 07:11:29",
                  "CreatedBy": "Urusula_Mtanda",
                  "UserType": "claimofficer",
                  "Status": "Y",
                  "BalanceReserveAmount": "177322",
                  "TotalPaidAmount": "22678",
                  "ReserveId": "30124",
                  "CurrencyCode": "TZS",
                  "CurrencyName": "Tanzanian Shillings"
              }
          }
        }
        this.reserveDetails = this.claimDetails?.ClaimInfo?.ReserveDetails;
        this.coInsuranceData = this.claimDetails?.CoInsuranceInfo;
        this.claimInfo = this.claimDetails?.ClaimInfo;
      }
    }, (err) => {

    this.handleError(err);
    })
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
