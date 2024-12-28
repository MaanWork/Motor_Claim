import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminService } from 'src/app/admin/admin.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
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
  selector: 'app-surveyor-list',
  templateUrl: './surveyor-list.component.html',
  styleUrls: ['./surveyor-list.component.css']
})
export class SurveyorListComponent implements OnInit {

  public tableData: DataTableElement[];
  public columnHeader: any;
  public SurveyorForm: FormGroup;
  public SurveyorList: any;
  public InsertMode: any = 'Insert';
  public InsuranceCmpyList: any;
  public RegionList: any;
  public BranchList: any;
  public InsuCode: any;
  public RegionCode: any;
  public BranchCode: any;
  public panelOpen: boolean = true;
  public ChangePassword: any = 'N';
  public NewPassword: any;
  public ReNewPassword: any;

  public SurveyorEditDetails: any

  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredRegionList: Observable<any[]>;
  filteredBranchList: Observable<any[]>;
  SurveyorInsForm: FormGroup;
  InsuGridCode: any;
  logindata: any;minDate:Date;
  OaCode: any;loginSection:boolean=false;
  editSection: boolean = false;
  insuranceName: any;effectiveValue:any;

  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.minDate = new Date();
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    if (!localStorage.getItem('fooSurveyor')) { 
      localStorage.setItem('fooSurveyor', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('fooSurveyor') 
    }
   }

  ngOnInit(): void {

    this.onCreateFormControl();
    this.onFetechInitialData();
    this.SurveyorInsForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]

    });
  }



  onCreateFormControl() {
    this.editSection = false;
    this.SurveyorForm = this.formBuilder.group({

      Username: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      LoginId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      CoreLoginId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      UserMail: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      MobileNumber: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Status: [{ value: 'Y', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Password: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RePassword: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      SurveyorAddress: [{ value: '', disabled: false }, [Validators.required]],
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RegionCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Remarks: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(150)]],
      BranchCode: [[], [Validators.required]],
      CityId: [{ value: '1', disabled: false }],
      CountryId: [{ value: '1', disabled: false }],
      WilayatId: [{ value: '1', disabled: false }],
      WilayatName: [{ value: '', disabled: false }],
      SurveyorId: [{ value: '', disabled: false }]
    })


  }
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    console.log(this.InsuranceCmpyList);
    let insVal = this.InsuranceCmpyList.find(ele=>ele.Code==this.logindata.InsuranceId);
    this.insuranceName = insVal?.CodeDesc;
    this.onChangeCompanyGridList(this.logindata.InsuranceId);
    this.filteredInsuranceComp = this.SurveyorForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance')),
    );
    this.filteredInsurance = this.SurveyorInsForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,'insurance2')),
    );
    //this.SurveyorList = await this.onGetSurveyorList();
    this.columnHeader = [
      { key: "SurveyorName", display: "ASSESSOR NAME" },
      { key: "LoginId", display: "LOGIN ID" },
     
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
    this.tableData = this.SurveyorList;
  }

  async onGetSurveyorList() {
    if(this.InsuGridCode != "" && this.InsuGridCode != undefined){
      let ReqObj = {
        "Usertype": "surveyor",
        "InsuranceId":this.InsuGridCode
      }
      let UrlLink = `api/getallsurveyors`;
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
      this.SurveyorForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      //this.RegionList = await this.onGetRegionList(this.InsuCode);
      this.BranchList = await this.onGetBrnchList(this.InsuCode);
      console.log(this.BranchList);
      this.filteredBranchList = this.SurveyorForm.controls['BranchCode'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'branch')),
      );
    }
  }
  async onChangeCompanyGridList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuGridCode = insuranceCode;
      sessionStorage.setItem('loginInsCode',this.InsuGridCode);
      this.SurveyorInsForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
      this.SurveyorList = await this.onGetSurveyorList();
      this.tableData = this.SurveyorList;
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
      this.SurveyorForm.controls['RegionCode'].setValue(Code.CodeDesc);
      
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
      this.SurveyorForm.controls['BranchCode'].setValue(Code.CodeDesc);

    }
  }

  onAddNewClaim() {
    this.InsuCode = '';
    this.RegionCode = '';
    this.BranchCode = '';
    this.InsertMode = 'Insert';
    this.onCreateFormControl();

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
        "InsuranceId": this.SurveyorEditDetails.InsuranceId,
        "Branchcode": this.SurveyorEditDetails.Branchcode,
        "Loginid": this.SurveyorEditDetails.Loginid,
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
  onFormSubmit(){

  }

  onSaveSurveyorDetails() {
    if(this.OaCode == undefined) this.OaCode = null;
    let UrlLink = `authentication/surveyorlogininsert`;
    let BranchCode = "";
    let branchList = this.SurveyorForm.controls['BranchCode'].value;
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
    this.SurveyorForm.controls['LoginId'].enable();
          this.SurveyorForm.controls['InsuranceId'].enable();
    let ReqObj = {
      "Oacode":this.OaCode,
      "Usertype": "surveyor",
      "Username": this.SurveyorForm.controls['Username'].value,
      "Loginid": this.SurveyorForm.controls['LoginId'].value,
      "Coreloginid": this.SurveyorForm.controls['CoreLoginId'].value,
      "InsuranceId": this.InsuCode,
      "Regioncode": '01',
      "Branchcode": BranchCode,
      "Mobilenumber": this.SurveyorForm.controls['MobileNumber'].value,
      "Productid": "66",
      "Status": this.SurveyorForm.controls['Status'].value,
      "Password": this.SurveyorForm.controls['Password'].value,
      "Usermail": this.SurveyorForm.controls['UserMail'].value,
      "Menuid": "1,2,3",
      "Mode": this.InsertMode
    };
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      console.log(data);
      if (data.Response == "Assessor Login Details Insert Sucessfully") {
        this.onSaveSurveyorMaster();
      }
      if (data.Response == "Assessor Login Details Update Sucessfully") {
        this.onSaveSurveyorMaster();
      }
      if (data.Errors) {
        if(this.editSection){
          this.SurveyorForm.controls['LoginId'].disable();
          this.SurveyorForm.controls['InsuranceId'].disable();
         }
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element: any = data.Errors[index];
          this.SurveyorForm.controls[element.Field].setErrors({ message: element.Message });

        }

      }


    }, (err) => {
      this.handleError(err);
    })
  }

  onSaveSurveyorMaster(){

    let UrlLink = `api/surveyormasterdetails`;
    let BranchCode = "";
    let branchList = this.SurveyorForm.controls['BranchCode'].value;
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
      "Usertype": "surveyor",
      "InsuranceId": this.InsuCode,
      "RegionCode": '01',
      "BranchCode": BranchCode,
      "Productid": "66",
      "Status": this.SurveyorForm.controls['Status'].value,
      "Password": this.SurveyorForm.controls['Password'].value,
      "SurveyorName": this.SurveyorForm.controls['Username'].value,
      "SurveyorAddress": this.SurveyorForm.controls['SurveyorAddress'].value,
      "EmailId":this.SurveyorForm.controls['UserMail'].value,
      "LoginId": this.SurveyorForm.controls['LoginId'].value,
      "MobileNo": this.SurveyorForm.controls['MobileNumber'].value,
      "Menuid": "1,2,3",
      "Mode": this.InsertMode,
      "CityName":"testing",
      "CountryName":"testing",
      "StateName":"testing",
      "SurveyorLicenseNo":"testing",
      "SurveyorId":this.SurveyorForm.controls['SurveyorId'].value
    };
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Response == "Success") {
        this.SurveyorList = await this.onGetSurveyorList();
        this.tableData = this.SurveyorList;
        this.panelOpen = true;
        Swal.fire(
          `Surveyor Created/Updated Successfully`,
          'success',
          'success'
        );
      }
      if (data.Response == "Admin Login Details Update Sucessfully") {
        this.SurveyorList = await this.onGetSurveyorList();
        this.tableData = this.SurveyorList;
        this.panelOpen = true;
        Swal.fire(
          `Surveyor Created/Updated Successfully`,
          'success',
          'success'
        );
      }
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element: any = data.Errors[index];
          this.SurveyorForm.controls[element.Field].setErrors({ message: element.Message });
        }
      }
    }, (err) => {
      this.handleError(err);
    })
  }

  async onActionHandler(row) {
    let entry = {
      "SurveyorId":row.SurveyorId,
      "LoginId": row.LoginId
    }
    sessionStorage.setItem('editSurveyorObj',JSON.stringify(entry));
    sessionStorage.setItem('SurveyorStatus','editBasicDetails');
    sessionStorage.setItem('AddSur','Update');

    this.router.navigate(['/Home/newSurveyorDetails'], {replaceUrl: true });
    // this.SurveyorEditDetails = await this.onSurveyorEditDetails(row);
    // if (this.SurveyorEditDetails) {
    //   this.editSection = true;
    //   this.Oacode = this.SurveyorEditDetails.Oacode;
    //   this.panelOpen = false;
    //   this.InsertMode = 'Update';
    //   await this.onChangeCompanyList(this.SurveyorEditDetails.InsuranceId);
    //   //await this.onChangeRegionList(this.SurveyorEditDetails.Regioncode);
    //   this.SurveyorForm.controls['BranchCode'].setValue(this.SurveyorEditDetails.Branchlist);
    //   this.SurveyorForm.controls['Username'].setValue(this.SurveyorEditDetails.Username);
    //   this.SurveyorForm.controls['CoreLoginId'].setValue(this.SurveyorEditDetails.Coreloginid);
    //   this.SurveyorForm.controls['LoginId'].setValue(this.SurveyorEditDetails.Loginid);
    //   this.SurveyorForm.controls['LoginId'].disable();
    //   this.SurveyorForm.controls['InsuranceId'].disable();
    //   this.SurveyorForm.controls['UserMail'].setValue(this.SurveyorEditDetails.Usermail);
    //   this.SurveyorForm.controls['MobileNumber'].setValue(this.SurveyorEditDetails.Mobilenumber);
    //   this.SurveyorForm.controls['Status'].setValue(this.SurveyorEditDetails.Status);
    // }
    // console.log(this.SurveyorEditDetails);
  }
  onAddNewSurveyor() {

    // this.InsuCode = '';
    // this.RegionCode = '';
    // this.BranchCode = '';
    // this.InsertMode = 'Insert';
    // this.Oacode = null;
    // this.onCreateFormControl();
    // this.onChangeCompanyList(this.logindata.InsuranceId);
    // this.panelOpen = false;
    let entry = {
      "SurveyorId":null,
      "LoginId": null
    }
    sessionStorage.setItem('editSurveyorObj',JSON.stringify(entry));
    sessionStorage.setItem('SurveyorStatus','create');
    sessionStorage.setItem('AddSur','Insert');
    this.router.navigate(['/Home/newSurveyorDetails'], {replaceUrl: true });
  }
  async onEditLoginDetails(rowData){
    let entry = {
      "SurveyorId":rowData.SurveyorId,
      "LoginId": rowData.LoginId
    }
    sessionStorage.setItem('editSurveyorObj',JSON.stringify(entry));
    sessionStorage.setItem('SurveyorStatus','createLoginDetails');
    sessionStorage.setItem('ADDItem','LoginEdit');
    this.router.navigate(['/Home/newSurveyorDetails'], {replaceUrl: true });
    //   this.loginSection = true;
    //   this.SurveyorEditDetails = await this.onSurveyorEditDetails(rowData);
    // console.log(this.SurveyorEditDetails)
    // if (this.SurveyorEditDetails) {
    //   this.editSection = true;
    //   this.OaCode = this.SurveyorEditDetails.Oacode;
    //   this.panelOpen = false;
    // }
  }
  async onSurveyorEditDetails(row) {
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
