import { NgxSpinnerService } from 'ngx-spinner';
//import { AdminService } from './../../../.admin.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith, find } from 'rxjs/operators';
import { AdminService } from './../../../../admin.service';
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
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.scss']
})
export class AdminDetailsComponent implements OnInit,AfterViewInit{
    public tableData: DataTableElement[];
    public columnHeader: any;
    public AdminForm: FormGroup;
    public AdminList: any = [];
  
    public InsertMode: any = 'Insert';
    public InsuranceCmpyList: any;
    public RegionList: any;
    public BranchList: any;
    public InsuCode: any;
    public RegionCode: any;
    public BranchCode: any;
    public panelOpen: boolean = true;
    public ChangePassword:any='N';
    public NewPassword:any;
    public ReNewPassword:any;
  
    filteredInsurance: Observable<any[]>;
    filteredInsuranceComp: Observable<any[]>;
    filteredRegionList: Observable<any[]>;
    filteredBranchList: Observable<any[]>;
    AdminInsForm: FormGroup;
    InsuGridCode: any="";
    logindata: any;
    Oacode: any;
    editSection: boolean = false;
    insuranceName: any;
    insureId: any;
    LoginIds: any;
  
  
    constructor(
      private adminService: AdminService,
      private spinner: NgxSpinnerService,
      private errorService: ErrorService,
      private formBuilder: FormBuilder,
      private router:Router
    ) {
      this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
      let reload = sessionStorage.getItem('garageLoginReload');
      if(reload){
        sessionStorage.removeItem('garageLoginReload');
        window.location.reload();
      }
     }
  
    ngOnInit(): void {

        let InsObj = JSON.parse(sessionStorage.getItem('Sno'));
          this.insureId = InsObj?.InsuranceId;
          this.InsertMode =InsObj?.InsertMode;
          this.LoginIds=InsObj?.Loginid;
          console.log('KKKKKKKKKKKKKK',this.LoginIds);
          this.onCreateFormControl();
          //this.onFetechInitialData();
            this.AdminInsForm = this.formBuilder.group({
              InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
        
            });
          if(this.LoginIds!=null || this.LoginIds!=undefined){
            console.log('KKKKKKKKKKKKKK',this.LoginIds);
            this.onFetechInitialData();
            
            this.onChangeCompanyList(this.insureId);
           this.onAdminEditDetails();
    
            //this.onActionHandler() 
          }
          else{
            this.onFetechInitialData();
            //this.onCreateFormControl();
            //this.onChangeCompanyList(this.insureId);
          }
      
  
  
    }
  
  
  
    onCreateFormControl() {
      this.editSection = false;
     
      this.AdminForm = this.formBuilder.group({
        UserType: [{ value: 'Admin', disabled: true }, [Validators.required, Validators.maxLength(50)]],
        Username: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
        LoginId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
        CoreLoginId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
        InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
        RegionCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
        BranchCode: [[], [Validators.required]],
        Product: [{ value: 'Claim', disabled: true }, [Validators.required, Validators.maxLength(50)]],
        UserMail: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
        MobileNumber: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
        Status: [{ value: 'Y', disabled: false }, [Validators.required, Validators.maxLength(50)]],
        Password: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
        RePassword: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      });
      
      
    }
    ngAfterViewInit(){
  
    }
  
    async onFetechInitialData() {
      this.InsuranceCmpyList = await this.onInsuranceCompanyList();
      console.log(this.InsuranceCmpyList)
      let insVal = this.InsuranceCmpyList.find(ele=>ele.Code==this.logindata.InsuranceId);
      console.log('JJJJJJJJJJJJJJJJ',this.InsuranceCmpyList);
      this.insuranceName = insVal?.CodeDesc;
      this.onChangeCompanyGridList(this.logindata.InsuranceId);
      this.filteredInsurance = this.AdminInsForm.controls['InsuranceId'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value,'insurance2')),
      );
  
  
      this.filteredInsuranceComp = this.AdminForm.controls['InsuranceId'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value,'insurance')),
      );
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
      if(this.LoginIds==null || this.LoginIds==undefined){
        this.onChangeCompanyList(this.insureId);
      }
  
    }
  
    async onGetAdminList() {
      if(this.InsuGridCode != "" && this.InsuGridCode != undefined){
        let ReqObj = {
          "Usertype": "admin",
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
        console.log('YYYYYYYYYYYY',this.InsuranceCmpyList)
        console.log('SSSSSSSSSSSS',insuranceCode)
      let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
      if (Code) {
        this.InsuCode = insuranceCode;
        sessionStorage.setItem('loginInsCode',this.InsuCode);
        this.AdminForm.controls['InsuranceId'].setValue(Code.CodeDesc);
        this.BranchList = await this.onGetBrnchList(this.InsuCode);
        //this.RegionList = await this.onGetRegionList(this.InsuCode);
        console.log("Region", this.BranchList);
        this.filteredBranchList = this.AdminForm.controls['BranchCode'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, 'branch')),
        );
        this.filteredRegionList = this.AdminForm.controls['RegionCode'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, 'region')),
        );
      }
    }
    async onChangeCompanyGridList(insuranceCode) {
      let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
      if (Code) {
        this.InsuGridCode = insuranceCode;
        this.AdminInsForm.controls['InsuranceId'].setValue(Code.CodeDesc);
        console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
        this.AdminList = await this.onGetAdminList();
        this.tableData = this.AdminList;
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
        this.AdminForm.controls['RegionCode'].setValue(Code.CodeDesc);
        //this.BranchList = await this.onGetBrnchList(this.RegionCode, this.InsuCode);
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
        this.AdminForm.controls['BranchCode'].setValue(Code.CodeDesc);
  
      }
    }

    onsave(){
      if(this.InsertMode == 'Insert'){
        let password = this.AdminForm.controls['Password'].value;
          let rePassword = this.AdminForm.controls['RePassword'].value;
           if (rePassword == undefined || rePassword == '' || rePassword == null) {
            Swal.fire(
              `Please Fill Re-Password`,
              'info'
            );
          } 
          else{
           this.onSaveAdminDetials();
          }
        
        console.log('UUUUUUUUUUU',this.InsertMode);
      }
      else if(this.InsertMode == 'Update'){
      this.onSaveAdminDetials();
      }

    }
  
    onSaveAdminDetials() {
      let BranchCode = "";
      let branchList = this.AdminForm.controls['BranchCode'].value;
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
  let login
      if(this.LoginIds==null){
        login= this.AdminForm.controls['LoginId'].value
      }
      else{
        login=this.LoginIds
      }
      console.log('BBBBBBB',BranchCode)
      let UrlLink = `authentication/adminlogininsert`;
      this.AdminForm.controls['LoginId'].enable();
      this.AdminForm.controls['InsuranceId'].enable();
      let ReqObj = {
        "Usertype": "admin",
        "Oacode": this.Oacode,
        "Username": this.AdminForm.controls['Username'].value,
        "Loginid": login,//this.AdminForm.controls['LoginId'].value,
        "Coreloginid": this.AdminForm.controls['CoreLoginId'].value,
        "InsuranceId": this.insureId,//this.InsuCode,
        "Regioncode": '01',
        "Branchcode": BranchCode,
        "Mobilenumber": this.AdminForm.controls['MobileNumber'].value,
        "Productid": "66",
        "Status": this.AdminForm.controls['Status'].value,
        "Password": this.AdminForm.controls['Password'].value,
        "Usermail": this.AdminForm.controls['UserMail'].value,
        "Menuid": "1,2,3",
        "Mode": this.InsertMode,
      };
      console.log(ReqObj);
      return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
        if (data.Response == "Admin Login Details Insert Sucessfully") {
          this.AdminList = await this.onGetAdminList();
          this.panelOpen = true;
          Swal.fire(
            `Admin Created Successfully`,
            'success',
            'success'
          );
          this.router.navigate(['/Home/Admin'])
        }
        if (data.Response == "Admin Login Details Update Sucessfully") {
          this.AdminList = await this.onGetAdminList();
          this.panelOpen = true;
          Swal.fire(
            `Admin Updated Successfully`,
            'success',
            'success'
          );
          this.router.navigate(['/Home/Admin'])
        }
        if (data.Errors) {
          if(this.editSection){
            this.AdminForm.controls['LoginId'].disable();
            this.AdminForm.controls['InsuranceId'].disable();
          }
          //this.AdminForm.controls['LoginId'].disable();
          this.errorService.showValidateError(data.Errors);
          for (let index = 0; index < data.Errors.length; index++) {
            const element:any = data.Errors[index];
          this.AdminForm.controls[element.Field].setErrors({message: element.Message });
  
          }
  
        }
  
  
      }, (err) => {
        this.handleError(err);
      })
    }
  
    async onActionHandler(row) {
      var adminEditDetails: any  //await this.onAdminEditDetails(row);
      if (adminEditDetails) {
        this.panelOpen = false;
        this.InsertMode = 'Update';
        this.Oacode = adminEditDetails.Oacode;
        await this.onChangeCompanyList(adminEditDetails.InsuranceId);
        //await this.onChangeRegionList(adminEditDetails.Regioncode);
        //await this.onChangeBranchList(adminEditDetails.Branchcode);
        this.AdminForm.controls['BranchCode'].setValue(adminEditDetails.Branchlist);
        this.AdminForm.controls['UserType'].setValue(adminEditDetails.Usertype);
        this.AdminForm.controls['Username'].setValue(adminEditDetails.Username);
        this.AdminForm.controls['LoginId'].setValue(adminEditDetails.Loginid);
        this.AdminForm.controls['LoginId'].disable();
        this.AdminForm.controls['InsuranceId'].disable();
        this.AdminForm.controls['CoreLoginId'].setValue(adminEditDetails.Coreloginid);
        this.AdminForm.controls['Product'].setValue(adminEditDetails.Productid);
        this.AdminForm.controls['UserMail'].setValue(adminEditDetails.Usermail);
        this.AdminForm.controls['MobileNumber'].setValue(adminEditDetails.Mobilenumber);
        this.AdminForm.controls['Status'].setValue(adminEditDetails.Status);
      }
      console.log(adminEditDetails);
    }
  
    async onAdminEditDetails() {
      let UrlLink = `authentication/editadminlogindetails`;
      let ReqObj = {
        "Loginid": this.LoginIds,
        "InsuranceId":this.insureId
      }
      let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
        .then(res => {
            var adminEditDetails:any = res;
            this.Oacode = adminEditDetails.Oacode;
            this.onChangeCompanyList(adminEditDetails.InsuranceId);

            console.log('MMMMMMMMMMMMM',adminEditDetails)
            //await this.onChangeRegionList(adminEditDetails.Regioncode);
            //await this.onChangeBranchList(adminEditDetails.Branchcode);
            this.AdminForm.controls['BranchCode'].setValue(adminEditDetails.Branchlist);
            this.AdminForm.controls['UserType'].setValue(adminEditDetails.Usertype);
            this.AdminForm.controls['Username'].setValue(adminEditDetails.Username);
            this.AdminForm.controls['LoginId'].setValue(adminEditDetails.Loginid);
            this.AdminForm.controls['LoginId'].disable();
            this.AdminForm.controls['InsuranceId'].disable();
            this.AdminForm.controls['CoreLoginId'].setValue(adminEditDetails.Coreloginid);
            this.AdminForm.controls['Product'].setValue(adminEditDetails.Productid);
            this.AdminForm.controls['UserMail'].setValue(adminEditDetails.Usermail);
            this.AdminForm.controls['MobileNumber'].setValue(adminEditDetails.Mobilenumber);
            this.AdminForm.controls['Status'].setValue(adminEditDetails.Status);
          //return res;
        })
        .catch((err) => {
          this.handleError(err)
        });
      //return response;
    }


    AdminDetails(){
        let ReqObj={
        "Loginid": this.LoginIds,
        "InsuranceId":this.insureId
        }
        let urlLink = `authentication/editadminlogindetails`;
        this.adminService.onPostMethod(urlLink, ReqObj).subscribe(
          (data: any) => {
            console.log(data);
            let res:any = data;
            if(res?.Result){
            var adminEditDetails = res.Result;
            this.Oacode = adminEditDetails.Oacode;
            this.onChangeCompanyList(adminEditDetails.InsuranceId);

            console.log('MMMMMMMMMMMMM',adminEditDetails)
            //await this.onChangeRegionList(adminEditDetails.Regioncode);
            //await this.onChangeBranchList(adminEditDetails.Branchcode);
            this.AdminForm.controls['BranchCode'].setValue(adminEditDetails.Branchlist);
            this.AdminForm.controls['UserType'].setValue(adminEditDetails.Usertype);
            this.AdminForm.controls['Username'].setValue(adminEditDetails.Username);
            this.AdminForm.controls['LoginId'].setValue(adminEditDetails.Loginid);
            this.AdminForm.controls['LoginId'].disable();
            this.AdminForm.controls['InsuranceId'].disable();
            this.AdminForm.controls['CoreLoginId'].setValue(adminEditDetails.Coreloginid);
            this.AdminForm.controls['Product'].setValue(adminEditDetails.Productid);
            this.AdminForm.controls['UserMail'].setValue(adminEditDetails.Usermail);
            this.AdminForm.controls['MobileNumber'].setValue(adminEditDetails.Mobilenumber);
            this.AdminForm.controls['Status'].setValue(adminEditDetails.Status);
            }
          },
          (err) => { },
        );
      }
    onAddNewAdmin() {
        this.onCreateFormControl();
        this.onChangeCompanyList(this.InsuGridCode);
        this.Oacode = null;
        this.panelOpen = false;
    }
    private _filter1(value: string): string[] {
      if (value == null) {
        value = '';
      }
      const filterValue = value.toLowerCase();
      return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
  
    }
    onCloseForm(){
      //this.onCreateFormControl();
      //this.panelOpen = true;
      this.router.navigate(['/Home/Admin']);
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