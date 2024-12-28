import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LossService } from '../../loss.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
export interface DataTableElement {
  "Usertype": any,
  "Username": any,
  "Loginid": any,
  "InsuranceId": any,
  "Regioncode": any,
  "Branchcode": any,
  "Productid": any,
  "Status": any,
  "Menuid": any,
  "Usermail": any,
  "Mobilenumber": any,
  "Oacode": any,
  "CompanyName": any,
  "RegionName": any
  "BranchName": any,
  "SubUserType": any,
  "Branchlist": any
}
@Component({
  selector: 'app-claim-allot-modal',
  templateUrl: './claim-allot-modal.component.html',
  styleUrls: ['./claim-allot-modal.component.css']
})

export class ClaimAllotModalComponent implements OnInit {

  panelOpen = false;
  LossTypeDes:any="";
  subLossTypeId:any="";
  logindata: any;
  public tableData: DataTableElement[];
  columnHeader:any;
  constructor(
    private lossService: LossService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    private LossService: LossService,
    private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ClaimAllotModalComponent>,
  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
  }

  ngOnInit(): void {
    console.log("Received Data",this.data);
    if(this.data){
        this.subLossTypeId = this.data.LosstypeId;
        this.LossTypeDes = this.data.Losstypedescp;
    }
   this.getSubOfficerList();
  }
  onViewInfo(){
    this.panelOpen = !this.panelOpen;
  }
  getSubOfficerList(){
      let ReqObj = {
        "BranchCode": this.logindata.BranchCode,
        "InsuranceId": this.logindata.InsuranceId,
        "UserType":  this.logindata.UserType,
        "SubUserType":"Officer"
      }
      let UrlLink = "api/subuserslist";
      this.lossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {


        if (data.ErrorsList) {
          console.log(data.ErrorsList);
          this.errorService.showLossErrorList(data.ErrorsList);
        }
        else {
            if(data){
              this.columnHeader = [
                {
                key: "action",
                display: "SELECT",
                config: {
                  isCheck: true,
                  actions: ["SELECT"]
                }
              },
              { key: "Username", display: "USERNAME" },
             { key: "RegionName", display: "REGION"},
              { key: "BranchName", display: "BRANCH" },
              { key: "Mobilenumber", display: "MOBILE NO" }
            ];
            this.tableData = data;
            }
        }
      }, (err) => {
        this.handleError(err);
      })
  }
  onActionHandler(action){
    console.log("Event Received Is ",action);
    this.dialogRef.close();
    if(action.event.checked == true){
      console.log("Row Data",action.element);
      Swal.fire({
        title: 'Are you sure?',
        text: "You Want To Allot Loss to "+"'"+action.element.Username+"'",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
            this.allotClaimOfficer(action);
        }
        else{

        }
      });
    }
  }
  allotClaimOfficer(action){
      console.log("Final Action",action,this.data);


      let ReqObj = {
        "ChassisNo": this.data.ChassisNo,
        "ClaimNo": this.data.ClaimNo,
        "LossNo": this.data.LossNo,
        "Partyno": this.data.PartyNo,
        "PolicyNo": this.data.PolicyNo,
        "Losstypeid": this.data.LosstypeId,
        "CreatedBy": action.element.Loginid,
        "UserType": action.element.Usertype
    }
      console.log(ReqObj)

      let UrlLink = `api/allocateclaimofficerloss`;
      return this.LossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {

        console.log("saveloss", data);
        if (data.ErrorsList) {
          this.errorService.showLossErrorList(data.ErrorsList);

        }
        if(data.Errors){
          this.errorService.showValidateError(data.Errors);
        }
        else{
          Swal.fire(
            `Loss Alloted to `+action.element.Username+` Successfully`,
            'success',
            'success'
          );
          this.router.navigate(['./Home/Dashboard']);
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
