import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GarageService } from '../../garage.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-garage-terms-conditions',
  templateUrl: './garage-terms-conditions.component.html',
  styleUrls: ['./garage-terms-conditions.component.css']
})
export class GarageTermsConditionsComponent implements OnInit {

  termsList:any[]=[];
  logindata: any;
  garageData: any;
  data: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public eventReceived: any,
    private garageService: GarageService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<GarageTermsConditionsComponent>,
  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
  }

  ngOnInit(): void {
    if(this.eventReceived){
      this.data = this.eventReceived.lossDetails;
      this.garageData = this.eventReceived.garageLoss;
      console.log("Final Data",this.data);
      this.getExistingTermsList();
    }

      //this.addNewRow();
  }
  addNewRow(){
    let entry = {
      "Sno":this.termsList.length+1,
      "Claimno": this.data.ClaimNo,
      "Partyno": this.data.PartyNo,
      "Losstypeid": this.data.LosstypeId,
      "Usertype": this.data.UserType,
      "Createdby": this.logindata.LoginId,
      "Termsdesc": "",
      "Status": "Y",
      "Remarks": "",
      "Entrydate": null,
      "Inscompanyid": this.logindata.InsuranceId,
      "checked": 'Y'
    }
    this.termsList.push(entry);
  }
  getExistingTermsList(){
    let ReqObj:any;
    let UrlLink:any;
    if(this.logindata.UserType == 'garage'){
      ReqObj = {
        "Usertype": "garage",
        "Status": "Y",
        "Inscompanyid": this.logindata.InsuranceId
      }
       UrlLink = `api/claimcondmasterbyusertype`;
    }
     else{
      ReqObj = {
        "Usertype": "garage",
        "Status": "Y",
        "Createdby": this.garageData.GarageLoginId,
        "Partyno": this.data.PartyNo,
        "Claimno": this.data.ClaimNo,
        "Losstypeid": this.data.LosstypeId,
        "Inscompanyid": this.logindata.InsuranceId
      }
       UrlLink = `api/claimconddetailsbyuser`;
     }
    return this.garageService.saveGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {

      this.termsList = [];
      if(data){
        if(data.length==0){
          this.addNewRow();
        }
        else{
          if(this.logindata.UserType == 'garage'){
            this.getEditList(data);
          }
          else{
            this.setListValue(data);
          }

        }
      }
      else{
        this.addNewRow();
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  getEditList(listData){
    let createdBy = "";
    if(this.logindata.UserType == 'garage'){
      createdBy = this.logindata.LoginId;
    }
    else{
        createdBy = this.garageData.GarageLoginId;
    }
    let ReqObj = {
      "Usertype": this.logindata.UserType,
      "Status": "Y",
      "Createdby": createdBy,
      "Partyno": this.data.PartyNo,
      "Claimno": this.data.ClaimNo,
      "Losstypeid": this.data.LosstypeId,
      "Inscompanyid": this.logindata.InsuranceId
    }
    let UrlLink = `api/claimconddetailsbyuser`;
    return this.garageService.saveGarageDetails(UrlLink, ReqObj).subscribe((data: any) => {


      this.termsList = [];
      if(data){
        if(data.length==0){
          this.setEditListValue(listData);
        }
        else{
          this.setEditListValue(data);
        }
      }
      else{
        this.setEditListValue(listData);
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  setEditListValue(entryList){
    for(let entry of entryList){
      let row = {
        "Sno":entry.Sno,
        "Claimno": this.data.ClaimNo,
        "Partyno": this.data.PartyNo,
        "Losstypeid": this.data.LosstypeId,
        "Usertype": this.data.UserType,
        "Createdby": this.logindata.LoginId,
        "Termsdesc": entry.Termsdesc,
        "Status": entry.Status,
        "Remarks": entry.Remarks,
        "Entrydate": null,
        "Inscompanyid": this.logindata.InsuranceId,
        "checked": 'Y'
      }
      this.termsList.push(row);
    }
    console.log("Final Submit",this.termsList);
}
  setListValue(entryList){
      for(let entry of entryList){
        let row = {
          "Sno":this.termsList.length+1,
          "Claimno": this.data.ClaimNo,
          "Partyno": this.data.PartyNo,
          "Losstypeid": this.data.LosstypeId,
          "Usertype": this.data.UserType,
          "Createdby": this.logindata.LoginId,
          "Termsdesc": entry.Termsdesc,
          "Status": entry.Status,
          "Remarks": entry.Remarks,
          "Entrydate": null,
          "Inscompanyid": this.logindata.InsuranceId,
          "checked": 'Y'
        }
        this.termsList.push(row);
      }
  }
  onFinalSubmit(){

    let termList = [];
    for (let index = 0; index < this.termsList.length; index++) {
      const element = this.termsList[index];
      if(element.checked == 'Y'){
        element['Sno']= String(element.Sno);
        termList.push(element);
      }
      if(index == this.termsList.length-1){
        this.submitTermsConditions(termList);
      }
    }

  }
  submitTermsConditions(termList){
    let UrlLink = `api/insertclaimconddetails`;
    return this.garageService.saveGarageDetails(UrlLink,termList).subscribe((data: any) => {

      if(data.Errors){
        this.errorService.showValidateError(data.Errors);
      }
      else{
        this.dialogRef.close();
        Swal.fire(
          `Terms & Conditions Added Successfully`,
          'success',
          'success'
        );
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  onTermsSelect(event,rowData){
    if(event.checked){
        let Exist = this.termsList.findIndex((ele:any)=>ele.Sno == rowData.Sno);
        this.termsList[Exist].checked = 'Y';
    }
    else{
      let Exist = this.termsList.findIndex((ele:any)=>ele.Sno == rowData.Sno);
      this.termsList[Exist].checked = 'N';
    }
    console.log("Changed List",this.termsList);
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
