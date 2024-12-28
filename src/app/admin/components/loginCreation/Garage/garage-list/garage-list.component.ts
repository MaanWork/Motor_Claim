import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminService } from 'src/app/admin/admin.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';

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
  selector: 'app-garage-list',
  templateUrl: './garage-list.component.html',
  styleUrls: ['./garage-list.component.css']
})
export class GarageListComponent implements OnInit {

  public tableData: DataTableElement[];
  public columnHeader: any;
  public GarageForm: FormGroup;
  public GarageList: any;
  public InsertMode: any = 'Insert';
  public InsuranceCmpyList: any;
  public RegionList: any;
  public BranchList: any;
  public InsuCode: any;
  public RegionCode: any;
  public BranchCode: any;
  public panelOpen: boolean = true;
  public ChangePassword: any='N';
  public NewPassword: any;
  public ReNewPassword: any;
  public InsuGridCode:any = "";
  public GarageEditDetails: any

  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredRegionList: Observable<any[]>;
  filteredBranchList: Observable<any[]>;
  GarageInsForm: FormGroup;
  logindata: any;
  Oacode: any;
  editSection: boolean=false;
  insuranceName: any;

  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private router:Router
  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    if (!localStorage.getItem('fooGarage')) { 
      localStorage.setItem('fooGarage', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('fooGarage') 
    }
  }

  ngOnInit(): void {
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.GarageInsForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]

    });
  }


  onCreateFormControl() {
    this.editSection = false;
    this.GarageForm = this.formBuilder.group({
      // Username: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      // LoginId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      // CoreLoginId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      // UserMail: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      // MobileNumber: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      // Status: [{ value: 'Y', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      // Password: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      // RePassword: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      // GarageAddress: [{ value: '', disabled: false }],
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      // RegionCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      // BranchCode: [[], [Validators.required]],
      // CityId: [{ value: '1', disabled: false }],
      // CountryId: [{ value: '1', disabled: false }],
      // WilayatId: [{ value: '1', disabled: false }],
      // WilayatName: [{ value: '', disabled: false }],

    })


  }
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    let insVal = this.InsuranceCmpyList.find(ele=>ele.Code==this.logindata.InsuranceId);
    this.insuranceName = insVal?.CodeDesc;
    this.onChangeCompanyGridList(this.logindata.InsuranceId);
    console.log(this.InsuranceCmpyList);
    this.filteredInsuranceComp = this.GarageForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance')),
    );
    this.filteredInsurance = this.GarageInsForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,'insurance2')),
    );
    //this.GarageList = await this.onGetGarageList();
    this.columnHeader = [
      { key: "GarageName", display: "GARAGE NAME" },
      { key: "LoginId", display: "GARAGE LOGIN ID" },
      
      { key: "EmailId", display: "EMAIL ID" },
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
      },
      {
        key: "Regioncode",
        display: "LoginDetails",
        config: {
          isSurveyorEdit: true,
          actions: ["EDIT"]
        }
      }
    ];
    this.tableData = this.GarageList;
  }

  async onGetGarageList() {
    if(this.InsuGridCode != "" && this.InsuGridCode !=undefined){
      let ReqObj = {
        "InsuranceId": this.InsuGridCode
      }
      let UrlLink = `api/getallgarages`;
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
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      sessionStorage.setItem('loginInsCode',this.InsuCode);
      this.GarageForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.BranchList = await this.onGetBrnchList(this.InsuCode);
      this.filteredBranchList = this.GarageForm.controls['BranchCode'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'branch')),
      );
    }
  }
  async onChangeCompanyGridList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuGridCode = insuranceCode;
      this.GarageInsForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
      this.GarageList = await this.onGetGarageList();
      this.tableData = this.GarageList;
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
      this.GarageForm.controls['RegionCode'].setValue(Code.CodeDesc);
     
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
      this.GarageForm.controls['BranchCode'].setValue(Code.CodeDesc);

    }
  }

  onChangePassword() {
    if (this.ReNewPassword == undefined || this.ReNewPassword == '' || this.ReNewPassword == null) {
      Swal.fire(
        `Please Fill New Password`,
        'Invalid',
        'info'
      );
    } else if (this.NewPassword == undefined || this.NewPassword == '' || this.NewPassword == null) {
      Swal.fire(
        `Please Fill Re-New Password`,
        'Invalid',
        'info'
      );
    } else if (this.NewPassword != this.ReNewPassword) {
      Swal.fire(
        `Mismatch Password`,
        'Invalid',
        'info'
      );
    } else {
      let UrlLink = `authentication/updatenewpassword`;
      let ReqObj = {
        "InsuranceId": this.GarageEditDetails.InsuranceId,
        "Branchcode": this.GarageEditDetails.Branchcode,
        "Loginid": this.GarageEditDetails.Loginid,
        "Password": this.ReNewPassword,
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



  onSaveGarageDetails() {
    if(this.Oacode == undefined) this.Oacode = null;
    let UrlLink = `authentication/garagelogininsert`;
    let BranchCode = "";
    let branchList = this.GarageForm.controls['BranchCode'].value;
    console.log("Received Branch",branchList);
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
      this.GarageForm.controls['LoginId'].enable();
      this.GarageForm.controls['InsuranceId'].enable();
    let ReqObj = {
      "Usertype": "garage",
      "Oacode": this.Oacode,
      "Username": this.GarageForm.controls['Username'].value,
      "Loginid": this.GarageForm.controls['LoginId'].value,
      "Coreloginid": this.GarageForm.controls['CoreLoginId'].value,
      "InsuranceId": this.InsuCode,
      "Regioncode": '01',
      "Branchcode": BranchCode,
      "Mobilenumber": this.GarageForm.controls['MobileNumber'].value,
      "Productid": "66",
      "Status": this.GarageForm.controls['Status'].value,
      "Password": this.GarageForm.controls['Password'].value,
      "Usermail": this.GarageForm.controls['UserMail'].value,
      "Menuid": "1,2,3",
      "Mode": this.InsertMode
    };
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      console.log(data);
      if (data.Response == "Admin Login Details Insert Sucessfully") {
        this.panelOpen = true;
        this.onSaveGarageMaster()
        Swal.fire(
          `Garage Updated Successfully`,
          'success',
          'success'
        );
      }
      else if (data.Response == "Admin Login Details Update Sucessfully") {
        this.panelOpen = true;
        Swal.fire(
          `Garage Created/Updated Successfully`,
          'success',
          'success'
        );
      }
      else if (data.Errors) {
        if(this.editSection){
          this.GarageForm.controls['LoginId'].disable();
          this.GarageForm.controls['InsuranceId'].disable();
         }
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element: any = data.Errors[index];
          this.GarageForm.controls[element.Field].setErrors({ message: element.Message });

        }

      }


    }, (err) => {
      this.handleError(err);
    })
  }

  onSaveGarageMaster(){

    let UrlLink = `api/garagemasterdetail`;
    let BranchCode = "";
    let branchList = this.GarageForm.controls['BranchCode'].value;
    console.log("Received Branch",branchList);
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
    let ReqObj = {
      "Usertype": "garage",
      "InsuranceId": this.InsuCode,
      "RegionCode": this.RegionCode,
      "BranchCode": BranchCode,
      "Productid": "66",
      "Oacode": this.Oacode,
      "Status": this.GarageForm.controls['Status'].value,
      "Password": this.GarageForm.controls['Password'].value,
      "GarageName": this.GarageForm.controls['Username'].value,
      "GarageAddress": this.GarageForm.controls['GarageAddress'].value,
      "EmailId":this.GarageForm.controls['UserMail'].value,
      "LoginId": this.GarageForm.controls['LoginId'].value,
      "MobileNo": this.GarageForm.controls['MobileNumber'].value,
      "Menuid": "1,2,3",
      "Mode": this.InsertMode,
      "CityName":"testing",
      "CountryName":"testing",
      "StateName":"testing",
      "GarageLicenseNo":"testing",

    };
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Response == "Admin Login Details Insert Sucessfully") {
        this.GarageList = await this.onGetGarageList();
        this.tableData = this.GarageList;
        this.panelOpen = true;

        Swal.fire(
          `Claim Updated Successfully`,
          'success',
          'success'
        );
      }
      if (data.Response == "Admin Login Details Update Sucessfully") {
        this.GarageList = await this.onGetGarageList();
        this.tableData = this.GarageList;
        this.panelOpen = true;

        Swal.fire(
          `Claim Created Successfully`,
          'success',
          'success'
        );
      }
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element: any = data.Errors[index];
          this.GarageForm.controls[element.Field].setErrors({ message: element.Message });

        }

      }


    }, (err) => {
      this.handleError(err);
    })
  }


  async onActionHandler(row) {
    let entry = {
      "GarageId":row.GarageId,
      "LoginId": row.LoginId
    }
    sessionStorage.setItem('editGarageObj',JSON.stringify(entry));
    sessionStorage.setItem('garageStatus','editBasicDetails');
    sessionStorage.setItem('ADDItem','Update');
    this.router.navigate(['./Home/newGarageDetails'], {replaceUrl: true });
    // this.GarageEditDetails = await this.onGarageEditDetails(row);
    // if (this.GarageEditDetails) {
    //   this.editSection = true;
    //   this.Oacode = this.GarageEditDetails.Oacode;
    //   this.panelOpen = false;
    //   this.InsertMode = 'Update';
    //   await this.onChangeCompanyList(this.GarageEditDetails.InsuranceId);
    //   //await this.onChangeRegionList(this.GarageEditDetails.Regioncode);
    //   this.GarageForm.controls['BranchCode'].setValue(this.GarageEditDetails.Branchlist);
    //   this.GarageForm.controls['Username'].setValue(this.GarageEditDetails.Username);
    //   this.GarageForm.controls['CoreLoginId'].setValue(this.GarageEditDetails.Coreloginid);
    //   this.GarageForm.controls['LoginId'].setValue(this.GarageEditDetails.Loginid);
    //   this.GarageForm.controls['LoginId'].disable();
    //   this.GarageForm.controls['InsuranceId'].disable();
    //   this.GarageForm.controls['UserMail'].setValue(this.GarageEditDetails.Usermail);
    //   this.GarageForm.controls['MobileNumber'].setValue(this.GarageEditDetails.Mobilenumber);
    //   this.GarageForm.controls['Status'].setValue(this.GarageEditDetails.Status);
    // }
    // console.log(this.GarageEditDetails);
  }
  onAddNewGarage() {

    // this.InsuCode = '';
    // this.RegionCode = '';
    // this.BranchCode = '';
    // this.InsertMode = 'Insert';
    // this.Oacode = null;
    // this.onCreateFormControl();
    // this.onChangeCompanyList(this.logindata.InsuranceId);
    // this.panelOpen = false;
    let entry = {
      "GarageId":null,
      "LoginId": null
    }
    sessionStorage.setItem('editGarageObj',JSON.stringify(entry));
    sessionStorage.setItem('garageStatus','create');
    sessionStorage.setItem('ADDItem','Insert');
    this.router.navigate(['./Home/newGarageDetails'], {replaceUrl: true });
  }
  async onEditLoginDetails(rowData){
    let entry = {
      "GarageId":rowData.GarageId,
      "LoginId": rowData.LoginId
    }
    sessionStorage.setItem('editGarageObj',JSON.stringify(entry));
    sessionStorage.setItem('garageStatus','createLoginDetails');
    sessionStorage.setItem('ADDItem','LoginEdit');
    this.router.navigate(['./Home/newGarageDetails'], {replaceUrl: true });
    //   this.loginSection = true;
    //   this.SurveyorEditDetails = await this.onSurveyorEditDetails(rowData);
    // console.log(this.SurveyorEditDetails)
    // if (this.SurveyorEditDetails) {
    //   this.editSection = true;
    //   this.OaCode = this.SurveyorEditDetails.Oacode;
    //   this.panelOpen = false;
    // }
  }
  async onGarageEditDetails(row) {
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

  
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
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
