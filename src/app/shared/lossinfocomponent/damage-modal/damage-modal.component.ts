import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { ErrorService } from '../../services/errors/error.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as _ from "lodash";

export interface DamageData {
  Depreciableyn: any,
  Depreciationpercent: any,
  Entrydate: any,
  InsuranceId: any,
  Partdescription: any,
  Partdescriptionar: any,
  Partid: any,
  Remarks: any,
  Sectionid: any,
  Status: any,
}
@Component({
  selector: 'app-damage-modal',
  templateUrl: './damage-modal.component.html',
  styleUrls: ['./damage-modal.component.css']
})
export class DamageModalComponent implements OnInit, OnDestroy {

  public logindata: any;
  public claimDetails: any;
  public LossDetails:any;
  public checked = {};
  public partyId = {};
  public repairType = {};
  public rate = {};
  public salvage = {};
  public excess = {};
  public noOfHours = {};
  public discount = {};
  public depreciation = {};
  public salvagedisabled={};
  public damageIdArray: any = [];
  public damageList: any = [];
  public DamagePartId: any;
  public LossInformation: any;
  public RepairTypeLis: any = [];
  public DamagePartEditList: any = [];
  displayedColumns: string[] = [
    'select',
    'repairdescription',
    'repairtype',
    'rate',
    'noofhours',
    'discount',
    'deprecitation'
  ];
  dataSource: MatTableDataSource<DamageData>;
  public GarageLoss:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private subscription = new Subscription();
  constructor(
    private lossService: LossService,
    private errorService: ErrorService,
    private router:Router,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<DamageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,


  ) { }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.LossDetails = JSON.parse(sessionStorage.getItem("LossDetails"));
    this.GarageLoss = JSON.parse(sessionStorage.getItem("GarageLossDetails"));

    this.LossInformation = this.data.LossInformation;
    console.log("LossDetails",this.LossDetails);

    this.subscription = this.lossService.getdamageId.subscribe((event: any) => {
      this.getDamagePartsLists(event);
      
    });
    this.onInitialFetchData();
  }

  async onInitialFetchData() {
    this.RepairTypeLis = await this.getRepairType();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }




  async getRepairType() {
    let UrlLink = `api/repairtype`;
    let response = (await this.lossService.getRepairType(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;

  }
  getDamagePartsLists(id) {
    this.DamagePartId = id;
    let userType = ""; 
    let createdBy = this.logindata.LoginId;
    if(this.router.url == '/Home/Garage' ){
        userType = 'garage';
    }
    else{
      // if(this.data.approvedSection == true || this.data.approvedSection=='true'){
      //  console.log("Datas",this.LossInformation,this.LossDetails);
       
      // }
      // else{
      //   userType = this.logindata.UserType
      // }
        userType = this.logindata.UserType;
      }
    let ReqObj = {
      "Sectionid": id,
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": createdBy,
      "UserType": userType,
      "UserId": this.logindata?.OaCode
    }
    console.log(ReqObj)

    let UrlLink = `api/vehiclebodypartsmasterbyinsidandsectionid`;
    return this.lossService.getDamagePartsList(UrlLink, ReqObj).subscribe((data: any) => {

      console.log("DamagePartList", data);
      this.damageList = data;
      
      this.onEditDamageParts();
      // this.dataSource = new MatTableDataSource(this.damageList);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    }, (err) => {
      this.handleError(err);
    })
  }

  damageCheck(event, id) {
    console.log(event.checked, id);
    if (event.checked === true) {
      this.damageIdArray.push(id);
    }
    if (event.checked === false) {
      var index: number = this.damageIdArray.indexOf(id);
      this.damageIdArray.splice(index, 1);
    }
    console.log(this.damageIdArray);
  }

  onSubmitDamageLoss(event) {
    var damagelist = [];
    for (let index = 0; index < this.damageIdArray.length; index++) {
      const element = this.damageIdArray[index];
      let partyDesc = this.damageList.find(ele => ele.Partid == element);
      damagelist.push(
        {
          "Sparepartscost": this.rate['rate' + element],
          "Vehdamagesidedesc": partyDesc.Partdescription,
          "ExcessAmount": "",
          "SalvageAmount": "",
          "Vehdamagesideid": element,
          "Repairorderid": this.repairType['repairType' + element],
          "Noofhours": this.noOfHours['noofhours' + element],
          "Discount": this.discount['dsicount' + element],
          "Depreciation": this.depreciation['depreciation' + element],
        }
      )
    }


    let userType = "";
    console.log("UserType in Garage",this.GarageLoss,this.router.url)
    if(this.router.url == '/Home/Garage'){
      console.log("UserType in Garage",this.GarageLoss)
      if(this.GarageLoss.SubStatus == 'QAFG' || this.GarageLoss.SubStatus == 'QS' || this.GarageLoss.SubStatus == 'SA')
        userType = 'garage';
      else userType = 'surveyor';
    }
    else{
      userType = this.logindata.UserType
    }
    let ReqObj = {
      "ClaimNo": this.LossDetails.ClaimNo,
      "Losstypeid": this.LossInformation.LosstypeId,
      "Partyno": this.LossInformation.PartyNo,
      "RepairJobCost": damagelist,
      "Serviceid": this.DamagePartId,
      "Usertype": this.logindata.UserType,
      "Vehpartsid": this.DamagePartId,
      "ChassisNo": this.LossDetails.ChassisNo,
      "PolicyNo": this.LossDetails.PolicyNo,
      "SaveorSubmit": event == 'submit' ? 'Submit' : 'Save',
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": userType,
      "UserId": this.logindata?.OaCode

    }
    console.log(ReqObj)


    let UrlLink = `api/save/repairJobCost`;
    return this.lossService.submitDamagedetails(UrlLink, ReqObj).subscribe((data: any) => {

      if (data.Response == "SUCCESS") {
        this.lossService.onGetUpdateDamageDetails(data);
        this.dialogRef.close(data);

        Swal.fire(
          'Damages Saved Successfully',
          `${this.claimDetails.ClaimNo}`,
          'success',
        )
      }
      if (data.Errors) {
        let element = '';
        for (let i = 0; i < data.Errors.length; i++) {
          element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data.Errors[i].Message + "</div>";

        }
        Swal.fire(
          'Please Fill Valid Value',
          `${element}`,
          'error',
        )
      }
    }, (err) => {
      this.handleError(err);
    })




  }
  onClosingDamage(){
    this.dialogRef.close(null);
  }
  onEditDamageParts() {
     let CreatedBy='';
     console.log("GD",this.GarageLoss,"LD",this.LossDetails)
    if(this.logindata.UserType == 'garage'){
      CreatedBy = this.logindata.LoginId;
    }else{
        if(this.data.WhoView =='GarageSide'){
          CreatedBy = this.GarageLoss?.GarageLoginId;

        }
        if(this.data.WhoView =='LossSide'){
          CreatedBy = this.LossDetails.CreatedBy;

        }
    }
    console.log(CreatedBy,this.logindata.LoginId);
    let userType = "";
    console.log("UserType in Garage",this.GarageLoss,this.router.url)
    if(this.router.url == '/Home/Garage'){
      console.log("UserType in Garage",this.GarageLoss)
      if(this.GarageLoss.SubStatus == 'QAFG' || this.GarageLoss.SubStatus == 'QS' || this.GarageLoss.SubStatus == 'SA')
        userType = 'garage';
      else userType = 'surveyor';
    }
    else if(this.router.url != '/Home/Garage' && this.LossDetails){
      userType = this.LossDetails.UserType;
    }
    else{
      userType = this.logindata.UserType
    }
    if(this.data.approvedSection == true || this.data.approvedSection=='true'){
     console.log("Datas",this.LossInformation,this.LossDetails);
      if(this.logindata?.UserType == 'garage'){
        //userType = 'surveyor';
        CreatedBy = this.data.surveyorLoginId;
      }
    }
    console.log("edit damage loss details",this.LossDetails,this.LossInformation)
    let ReqObj = {
      "QuotationPolicyNo": sessionStorage.getItem('PolicyNumber'),
      "ClaimNo": this.LossDetails.ClaimNo,
      "ChassisNo": this.LossDetails.ChassisNo,
      "Losstypeid": this.LossInformation.LosstypeId,
      "Partyno": this.LossInformation.PartyNo,
      "Serviceid": this.DamagePartId,
      "PolicyNo": this.LossDetails.PolicyNo,
      "Usertype": userType,
      "Vehpartsid": this.DamagePartId,
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": CreatedBy,
      "UserId": this.logindata?.OaCode

    }
    let UrlLink = `api/getrepairJobcost`;
    return this.lossService.onEditDamageParts(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("EditDamagePonits", data);
      console.log("EditDamagePonits Req", ReqObj);
      this.DamagePartEditList = data;
      if (data && data.length) {
        this.damageIdArray = [];
          this.sortDamageList();
          for (let index = 0; index < this.DamagePartEditList.length; index++) {
            const element = this.DamagePartEditList[index];
            let event = { checked: true };
            this.damageCheck(event, element.VehdamagesideId);
            this.partyId['partyId' + element.VehdamagesideId] = true;
            this.rate['rate' + element.VehdamagesideId] = element.SparepartsCost
            //this.excess['excess' + element.VehdamagesideId] = element.ExcessAmount
            //this.salvage['salvage' + element.VehdamagesideId] = element.SalvageAmount
            this.repairType['repairType' + element.VehdamagesideId] = element.RepairorderId;
            this.noOfHours['noofhours' + element.VehdamagesideId] = element.Noofhours;
            this.discount['dsicount' + element.VehdamagesideId] = element.Discount;
            this.depreciation['depreciation' + element.VehdamagesideId] = element.Depreciation;
            // if(index==this.DamagePartEditList.length){
            //   this.dataSource = new MatTableDataSource(this.damageList);
            //     this.dataSource.paginator = this.paginator;
            //     this.dataSource.sort = this.sort;
            // }
          }
      }
      else{
        this.dataSource = new MatTableDataSource(this.damageList);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
      }
    }, (err) => {
      this.handleError(err);
    })
  }
  sortDamageList(){
      let FinalArray:any[]=[]
      let Filterchoosed:any[]=[];
      let FilterUnchoosed:any[]=[];
      console.log(this.DamagePartEditList,this.damageList)
      for (let index = 0; index < this.DamagePartEditList.length; index++) {
        const element = this.DamagePartEditList[index];
        let findObj = this.damageList.find((ele:any)=>ele.Partid == this.DamagePartEditList[index].VehdamagesideId);
        // let filterdunChoosed = this.damageList.filter((ele:any)=>ele.Partid != this.DamagePartEditList[index].VehdamagesideId);
        // FilterUnchoosed =[...filterdunChoosed];
        if(findObj){
          Filterchoosed.push(findObj);
        }
      }
      FilterUnchoosed = _.differenceBy(this.damageList, Filterchoosed);
      FinalArray=[...Filterchoosed,...FilterUnchoosed];
      console.log("FilterUnchoosed",FinalArray,FilterUnchoosed);
      this.damageList = FinalArray;
      this.dataSource = new MatTableDataSource(this.damageList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  }

  setDamageValues(){
    
  }





  damageListDisabled() {
    if (this.logindata?.UserType == "claimofficer" || (this.router.url == '/Home/Garage' && this.logindata.UserType == 'garage')) {
      return true;
    }
  }

  onRepairTypeChange(val,id){
    console.log(val,id);

    if(val == 2){
      this.salvagedisabled['salvagedisabled'+id] = false;
    }else{
      this.salvagedisabled['salvagedisabled'+id] = true;

    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
