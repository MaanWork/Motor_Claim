import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminService } from 'src/app/admin/admin.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { LossSelectionComponent } from '../../../../shared/loss-selection/loss-selection.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

export interface DataTableElement {
  Branchcode: any,
  InsuranceId: any,
  Loginid: any,
  Menuid: any,
  Mobilenumber: any,
  Oacode: any,
  Productid: any,
  Regioncode: any,
  Status: any,
  Usermail: any,
  Username: any,
  Usertype: any,
}
@Component({
  selector: 'app-claimofficier-list',
  templateUrl: './claimofficier-list.component.html',
  styleUrls: ['./claimofficier-list.component.css']
})
export class ClaimofficierListComponent implements OnInit {
  public tableData: DataTableElement[];
  public columnHeader: any;
  public ClaimForm: FormGroup;
  public ClaimList: any;
  public InsertMode: any = 'Insert';
  public InsuranceCmpyList: any=[];
  public RegionList: any =[];
  public BranchList: any = [];
  public InsuCode: any;
  public RegionCode: any;
  public BranchCode: any;
  public panelOpen: boolean = true;
  public ChangePassword: any='N';
  public NewPassword: any;
  public ReNewPassword: any;

  public claimEditDetails:any;
  public amountdetails:any;

  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredRegionList: Observable<any[]>;
  filteredBranchList: Observable<any[]>;
  lossTypeList: any;
  receivedLossList: any;
  lossValue: any;
  finalLossList: any[];
  logindata: any;
  ClaimInsForm: FormGroup;
  InsuGridCode: any;
  OaCode: any;
  editSection: boolean = false;
  insuranceName: any;
  effectiveValue :any;
  minDate:any;
  Sno: any;


  constructor(
    public dialog: MatDialog,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private commonDataService:CommondataService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<LossSelectionComponent>,
    private datePipe:DatePipe,
    private router:Router
  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.minDate=new Date();
    let reload = sessionStorage.getItem('garageLoginReload');
    if(reload){
      sessionStorage.removeItem('garageLoginReload');
      window.location.reload();
    }
  }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.ClaimInsForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]

    });
  }

  onCreateFormControl() {
    this.editSection = false;
    this.ClaimForm = this.formBuilder.group({
      UserType: [{ value: 'ClaimOfficer', disabled: true }, [Validators.required]],
      Username: [{ value: '', disabled: false }, [Validators.required]],
      LoginId: [{ value: '', disabled: false }, [Validators.required]],
      CoreLoginId : [{ value: '', disabled: false }, [Validators.required]],
      InsuranceId: [{ value: '', disabled: false }, [Validators.required]],
      RegionCode: [{ value: '', disabled: false }, [Validators.required]],
      BranchCode: [[], [Validators.required]],
      Losstypeidlist: [[], Validators.required],
      Product: [{ value: 'Claim', disabled: true }, [Validators.required]],
      UserMail: [{ value: '', disabled: false }, [Validators.required]],
      MobileNumber: [{ value: '', disabled: false }, [Validators.required]],
      Status: [{ value: 'Y', disabled: false }, [Validators.required]],
      Password: [{ value: '', disabled: false }, [Validators.required]],
      RePassword: [{ value: '', disabled: false }, [Validators.required]],
      Suminsuredstart : [{ value: '', disabled: false }, [Validators.required]],
      Suminsuredend : [{ value: '', disabled: false }, [Validators.required]],
      Subusertype : [{ value: '', disabled: false }, [Validators.required]],
    })
  }
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.getLossTypeList();
    let insVal = this.InsuranceCmpyList.find(ele=>ele.Code==this.logindata.InsuranceId);
    this.insuranceName = insVal?.CodeDesc;
    this.onChangeCompanyGridList(this.logindata.InsuranceId);
    this.filteredInsuranceComp = this.ClaimForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance')),
    );
    this.filteredInsurance = this.ClaimInsForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,'insurance2')),
    );
    this.ClaimList = await this.onGetClaimList();
    this.columnHeader = [
      { key: "Loginid", display: "LOGIN ID" },
      { key: "Username", display: "USERNAME" },
      { key: "BranchNames", display: "BRANCH" },
      { key: "Usermail", display: "EMAIL ID" },
      {
        key: "Status",
        display: "STATUS",
        config: {
          isBoolean: 'Y',
          values: { Y: "Active", N: "Inactive" }
        }
      },

      {
        key: "action",
        display: "ACTION",
        config: {
          isAction: true,
          actions: ["EDIT"]
        }
      }
    ];
    this.tableData = this.ClaimList;
  }
  getLossTypeList() {
    let UrlLink = `api/claimlosstype`;
    let ReqObj = {
      "InsuranceId": this.logindata.InsuranceId,
      "PolicytypeId":"01",
      "Status":'Y'
    }
    return this.commonDataService.onGetClaimList(UrlLink,ReqObj).subscribe((data: any) => {
      console.log("Loss Type", data);
      //this.GenderTypeList = data;
      if (data != null) {
        this.lossTypeList = data;
      }
      console.log("Loss Type List", this.lossTypeList);
    }, (err) => {
      this.handleError(err);
    })
  }
  async onGetClaimList() {
    if(this.InsuGridCode!= "" && this.InsuGridCode != undefined){
      console.log("Ins Code Received",this.InsuGridCode);
      let ReqObj = {
        "Usertype": "claimofficer",
        "InsuranceId": this.InsuGridCode
      }
      let UrlLink = `authentication/existingadminlist`;
      let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
        .then(res => {
          return res;
        })
        .catch((err) => {
          this.handleError(err)
        });
      return response;
    }

  }

  private _filter(value: string, dropname: string): string[] {
    if(value == null){
      value='';
    }
    console.log("Val",value);
    const filterValue = value.toLowerCase();
    if (dropname == 'insurance') {
      return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'insurance2') {
      return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'region') {
      return this.RegionList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'branch') {
      return this.BranchList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
  }
  onLossListEdit(){
    const dialogRef = this.dialog.open(LossSelectionComponent, {
      width: '100%',
      data: this.ClaimForm.value
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result !=undefined && result !=''&& result !=null){
        this.receivedLossList = result;
        this.finalizeLossValue(this.receivedLossList);
          console.log("Received Result",result);
      }
      else{
        this.receivedLossList = [];
      }
    });
  }
  finalizeLossValue(receivedLossList){
      if(receivedLossList){
        let i=0;
        this.finalLossList = [];
        for(let loss of receivedLossList){
          this.finalLossList.push(loss.Code);
          if(this.lossValue != ""){
            this.lossValue = this.lossValue+","+loss.CodeDesc;
          }
          else{
            this.lossValue = loss.CodeDesc;
          }
        }
      }
  }
  async onInsuranceCompanyList() {
    let UrlLink = `api/insurancecompanies`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      this.ClaimForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      sessionStorage.setItem('loginInsCode',this.InsuCode);
      this.BranchList = await this.onGetBrnchList(this.InsuCode);
      //this.RegionList = await this.onGetRegionList(this.InsuCode);
      console.log("Region", this.BranchList);
      this.filteredBranchList = this.ClaimForm.controls['BranchCode'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'branch')),
      );
      this.filteredRegionList = this.ClaimForm.controls['RegionCode'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'region')),
      );
    }
  }
  async onChangeCompanyGridList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuGridCode = insuranceCode;
      this.ClaimInsForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
      this.ClaimList = await this.onGetClaimList();
      this.tableData = this.ClaimList;
    }
  }
  async onGetRegionList(Code) {
    let UrlLink = `api/regions/${Code}`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async onChangeRegionList(regionCode) {
    console.log(regionCode)
    let Code = this.RegionList.find((ele: any) => ele.Code == regionCode);
    if (Code) {
      this.RegionCode = regionCode;
      sessionStorage.setItem('loginRegionCode',regionCode);
      this.ClaimForm.controls['RegionCode'].setValue(Code.CodeDesc);
      
      console.log(this.BranchList);
      
    }
  }

  async onGetBrnchList(InsuCode) {
    let UrlLink = `api/branches/${InsuCode}`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {

        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  onChangeBranchList(branchCode) {
    let Code = this.BranchList.find((ele: any) => ele.Code == branchCode);
    if (Code) {
      this.BranchCode = branchCode;
      this.ClaimForm.controls['BranchCode'].setValue(Code.CodeDesc);

    }
  }

  onAddNewClaim() {
    // this.InsuCode = '';
    // this.RegionCode = '';
    // this.BranchCode = '';
    // this.lossValue="";
    // this.InsertMode = 'Insert';
    // this.effectiveValue=""
    // this.onCreateFormControl();
    // this.onChangeCompanyList(this.logindata.InsuranceId);
    // this.OaCode = null;
    // this.panelOpen = false;
    // this.Sno="";
    let entry = {
      "Loginid": null,
      "InsuranceId":this.logindata.InsuranceId,
      "InsertMode":'Insert'
    }
    sessionStorage.setItem('Claim',JSON.stringify(entry));
    this.router.navigate(['/Home/Admin/ClaimDetails']);
    
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  onChangePassword(){


    if(this.ReNewPassword == undefined || this.ReNewPassword == '' || this.ReNewPassword == null){
      Swal.fire(
        `Please Fill New Password`,
        'Invalid',
        'info'
      );
    }else if(this.NewPassword == undefined || this.NewPassword == '' || this.NewPassword == null){
      Swal.fire(
        `Please Fill Re-New Password`,
        'Invalid',
        'info'
      );
    }else if(this.NewPassword != this.ReNewPassword){
      Swal.fire(
        `Mismatch Password`,
        'Invalid',
        'info'
      );
    }else{
      let UrlLink = `authentication/updatenewpassword`;
      let ReqObj = {
        "InsuranceId": this.claimEditDetails.InsuranceId,
        "Branchcode": this.claimEditDetails.Branchcode,
        "Loginid": this.claimEditDetails.Loginid,
        "Password" :this.ReNewPassword,
      }
      return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

        if (data.Response == "Password updated Sucessfully") {
          this.panelOpen = true;
          Swal.fire(
            `${data.Response}`,
            'success',
            'success'
          );
        }
        if (data.Errors) {
          this.errorService.showValidateError(data.Errors);
        }
      }, (err) => {
        this.handleError(err);
      })
    }

  }

  onSaveClaimDetials() {
    if(this.OaCode == undefined) this.OaCode = null;
    this.ClaimForm.controls['Losstypeidlist'].setValue(this.finalLossList);
    let UrlLink = `authentication/claimofficerlogininsert`;
    let BranchCode = "";
    let branchList = this.ClaimForm.controls['BranchCode'].value;
    if(branchList){
      let i = 0;
      if(branchList.length!=0){
          for(let branch of branchList){
            if(i==0){
              BranchCode = branchList[0];
            }
            else{
               BranchCode = BranchCode+","+branch;
            }
            i+=1;
          }

      }
    }
    this.ClaimForm.controls['LoginId'].enable();
    this.ClaimForm.controls['InsuranceId'].enable();
    let ReqObj = {
      "Oacode":this.OaCode,
      "Usertype": "claimofficer",
      "Username": this.ClaimForm.controls['Username'].value,
      "Loginid": this.ClaimForm.controls['LoginId'].value,
      "Coreloginid": this.ClaimForm.controls['CoreLoginId'].value,
      "InsuranceId": String(this.InsuCode),
      "Regioncode": '01',
      "Branchcode": BranchCode,
      "Mobilenumber": this.ClaimForm.controls['MobileNumber'].value,
      "Productid": "66",
      "Status": this.ClaimForm.controls['Status'].value,
      "Password": this.ClaimForm.controls['Password'].value,
      "Usermail": this.ClaimForm.controls['UserMail'].value,
      "Losstypeidlist":this.ClaimForm.controls['Losstypeidlist'].value,
      "Suminsuredstart":this.ClaimForm.controls['Suminsuredstart'].value,
      "Suminsuredend" : this.ClaimForm.controls['Suminsuredend'].value,
      "Subusertype" : this.ClaimForm.controls['Subusertype'].value,
      "Menuid": "1,2,3",
      "Mode": this.InsertMode
    };
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Response == "Admin Login Details Insert Sucessfully") {
        this.anotherinsert();
        this.ClaimList = await this.onGetClaimList();
        this.tableData = this.ClaimList;
        this.panelOpen = true;

        Swal.fire(
          `Claim Updated Successfully`,
          'success',
          'success'
        );
      }
      if (data.Response == "Admin Login Details Update Sucessfully") {
        this.anotherinsert();
        this.ClaimList = await this.onGetClaimList();
        this.tableData = this.ClaimList;
        this.panelOpen = true;

        Swal.fire(
          `Claim Created/Updated Successfully`,
          'success',
          'success'
        );
      }
      if (data.Errors) {
        if(this.editSection){
          this.ClaimForm.controls['LoginId'].disable();
          this.ClaimForm.controls['InsuranceId'].disable();
         }
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element: any = data.Errors[index];
          this.ClaimForm.controls[element.Field].setErrors({ message: element.Message });
        }
      }
    }, (err) => {
      this.handleError(err);
    })
  }

  async anotherinsert(){
    let sno;
    if(this.Sno!=null ||  this.Sno!=undefined ||  this.Sno!=""){
         sno=this.Sno
    }
    else{
      sno=""
    }
    let UrlLink = `api/insertsuminsured`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "Sno":sno,
    "LoginId":this.ClaimForm.controls['LoginId'].value,
    "CompanyId":String(this.InsuCode),
    "EffectiveDateStart":effectiveDate,
    "Status":this.ClaimForm.controls['Status'].value,
    "SuminsuredStart":this.ClaimForm.controls['Suminsuredstart'].value,
    "SuminsuredEnd":this.ClaimForm.controls['Suminsuredend'].value,
    "UserType": "claimofficer",
    "UserName": this.ClaimForm.controls['Username'].value,
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data) {
       console.log('DDDDDDDDDDDDDDDDD',data);
      }
      
    }, (err) => {
      this.handleError(err);
    })
  }


  async onActionHandler(row) {
    let entry = {
      "Loginid": row.Loginid,
      "InsuranceId":row.InsuranceId,
      "InsertMode":'Update'
    }
    console.log('UUUUUUUUUU',row.Loginid)
    sessionStorage.setItem('Claim',JSON.stringify(entry));
    this.router.navigate(['/Home/Admin/ClaimDetails']);
    // this.effectiveValue="";
    // this.claimEditDetails= await this.onclaimEditDetails(row);
    // this.amountdetails=await this.amountGet(row);
    // if (this.claimEditDetails) {
    //   this.editSection = true;
    //   this.panelOpen = false;
    //   this.OaCode = this.claimEditDetails.Oacode;
    //   this.InsertMode = 'Update';
    //   console.log("Login Edit",this.claimEditDetails);
    //   await this.onChangeCompanyList(this.claimEditDetails.InsuranceId);
    //   //await this.onChangeRegionList(this.claimEditDetails.Regioncode);
    //   this.ClaimForm.controls['BranchCode'].setValue(this.claimEditDetails.Branchlist);
    //   this.ClaimForm.controls['Suminsuredstart'].setValue(this.claimEditDetails.Suminsuredstart);
    //   this.ClaimForm.controls['Suminsuredend'].setValue(this.claimEditDetails.Suminsuredend);
    //   this.ClaimForm.controls['Suminsuredend'].setValue(this.claimEditDetails.Suminsuredend);
    //   this.ClaimForm.controls['Subusertype'].setValue(this.claimEditDetails.Subusertype);
    //   this.finalLossList = this.claimEditDetails.Losstypeidlist;
    //   if(this.lossTypeList){
    //     //this.setLossValue(this.claimEditDetails.Losstypeidlist);
    //     this.editLossValue(this.claimEditDetails.Losstypeidlist);
    //   }
    //   //this.ClaimForm.controls['Losstypeidlist'].setValue(this.claimEditDetails.Losstypeidlist);
    //   this.ClaimForm.controls['UserType'].setValue(this.claimEditDetails.Usertype);
    //   this.ClaimForm.controls['Username'].setValue(this.claimEditDetails.Username);
    //   this.ClaimForm.controls['LoginId'].setValue(this.claimEditDetails.Loginid);
    //   this.ClaimForm.controls['LoginId'].disable();
    //   this.ClaimForm.controls['InsuranceId'].disable();
    //   this.ClaimForm.controls['CoreLoginId'].setValue(this.claimEditDetails.Coreloginid);
    //   this.ClaimForm.controls['Product'].setValue(this.claimEditDetails.Productid);
    //   this.ClaimForm.controls['UserMail'].setValue(this.claimEditDetails.Usermail);
    //   this.ClaimForm.controls['MobileNumber'].setValue(this.claimEditDetails.Mobilenumber);
    //   this.ClaimForm.controls['Status'].setValue(this.claimEditDetails.Status);
    //   if(this.amountdetails.EffectiveDateStart!=null){
    //   this.effectiveValue=this.onDateFormatInEdit(this.amountdetails.EffectiveDateStart);}
    //   this.Sno=this.amountdetails.Sno;

    //   console.log('fffffffffffffff',this.effectiveValue);
    // }
    // console.log("Final Form Value",this.ClaimForm.value);
  }
  onDateFormatInEdit(date) {
    console.log(date);
    if (date) {
      let format = date.split('-');
      if(format.length >1){
        var NewDate = new Date(new Date(format[0], format[1], format[2]));
        NewDate.setMonth(NewDate.getMonth() - 1);
        return NewDate;
      }
      else{
        format = date.split('/');
        if(format.length >1){
          var NewDate = new Date(new Date(format[2], format[1], format[0]));
          NewDate.setMonth(NewDate.getMonth() - 1);
          return NewDate;
        }
      }

    }
  }
  editLossValue(lossList){
    this.lossValue = ""
    if(lossList){
      if(lossList.length !=0){
        for(let loss of lossList){
          if(loss!= '' && loss!= 'null' && loss!= null && loss != undefined){
            console.log("Entered Loss",loss);
            for(let primaryloss of this.lossTypeList.Primary){
              if(primaryloss.Code == loss){
                console.log("Entered Second Entry",loss.Code);
                if(this.lossValue ==""){
                  this.lossValue = primaryloss.CodeDesc;
                }
                else{
                  this.lossValue = this.lossValue+","+primaryloss.CodeDesc;
                }
              }
            }
            for(let secloss of this.lossTypeList.Secondary){
              if(secloss.Code == loss){
                if(this.lossValue ==""){
                  this.lossValue = secloss.CodeDesc;
                }
                else{
                  this.lossValue = this.lossValue+","+secloss.CodeDesc;
                }
              }
            }
          }
        }
        console.log("Final Loss Value",this.lossValue)
      }
    }
  }
  setLossValue(lossList){
    this.lossValue = "";
    for(let loss of this.lossTypeList.Primary){
      let Exist = lossList.some((ele:any)=>ele == loss.Code);
      if(Exist){
        console.log("Exist Value",loss);
          if(this.lossValue ==""){
            this.lossValue = loss.CodeDesc;
          }
          else{
            this.lossValue = this.lossValue+","+loss.CodeDesc;
          }
      }
    }
    for(let loss of this.lossTypeList.Secondary){
      let Exist = lossList.some((ele:any)=>ele == loss.Code);
      if(Exist){
          console.log("Exist Value 2",loss);
          if(this.lossValue ==""){
            this.lossValue = loss.CodeDesc;
          }
          else{
            this.lossValue = this.lossValue+","+loss.CodeDesc;
          }
      }
      console.log("Loss Type Listt",this.lossTypeList,this.lossValue)
    }
  }
  async onclaimEditDetails(row) {
    let UrlLink = `authentication/editadminlogindetails`;
    let ReqObj = {
      "Loginid": row.Loginid,
      "InsuranceId":row.InsuranceId
    }
    let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

 async amountGet(row){
  let UrlLink = `api/getsuminsuredbyloginid`;
  let ReqObj = {
    "LoginId": row.Loginid,
    "CompanyId":row.InsuranceId
  }
  let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
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
