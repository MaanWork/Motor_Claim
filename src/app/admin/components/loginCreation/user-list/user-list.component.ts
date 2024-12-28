import { Component, OnInit } from '@angular/core';
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
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public tableData: DataTableElement[];
  public columnHeader: any;
  public UserForm: FormGroup;
  public UserList: any;
  public InsertMode: any = 'Insert';
  public InsuranceCmpyList: any;
  public RegionList: any;
  public BranchList: any;
  public InsuCode: any;
  public RegionCode: any;
  public BranchCode: any;
  public panelOpen: boolean = false;
  public ChangePassword: any;
  public NewPassword: any;
  public ReNewPassword: any;

  public userEditDetails:any

  filteredInsurance: Observable<any[]>;
  filteredRegionList: Observable<any[]>;
  filteredBranchList: Observable<any[]>;


  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.onCreateFormControl();
    this.onFetechInitialData();
  }

  onCreateFormControl() {
    this.UserForm = this.formBuilder.group({
      UserType: [{ value: 'User', disabled: true }, [Validators.required, Validators.maxLength(50)]],
      Username: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      LoginId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RegionCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      BranchCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Product: [{ value: 'Claim', disabled: true }, [Validators.required, Validators.maxLength(50)]],
      UserMail: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      MobileNumber: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Status: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Password: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RePassword: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
    })
  }
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    console.log(this.InsuranceCmpyList);
    this.filteredInsurance = this.UserForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance')),
    );
    this.UserList = await this.onGetUserList();
    this.columnHeader = [
      { key: "Loginid", display: "LOGIN ID" },
      { key: "Username", display: "USERNAME" },
      { key: "InsuranceId", display: "COMPANY ID" },
      { key: "Branchcode", display: "BRANCH CODE" },
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
    this.tableData = this.UserList;
  }

  async onGetUserList() {
    let ReqObj = {
      "Usertype": "user"
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

  private _filter(value: string, dropname: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    if (dropname == 'insurance') {
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
      this.UserForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.RegionList = await this.onGetRegionList(this.InsuCode);
      console.log("Region", this.RegionList);
      this.filteredRegionList = this.UserForm.controls['RegionCode'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'region')),
      );
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
      this.UserForm.controls['RegionCode'].setValue(Code.CodeDesc);
      this.BranchList = await this.onGetBrnchList(this.RegionCode, this.InsuCode);
      console.log(this.BranchList);
      this.filteredBranchList = this.UserForm.controls['BranchCode'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'branch')),
      );
    }
  }

  async onGetBrnchList(RegionCode, InsuCode) {
    let UrlLink = `api/branches/${RegionCode}/${InsuCode}`;
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
      this.UserForm.controls['BranchCode'].setValue(Code.CodeDesc);

    }
  }

  onAddNewClaim() {
    this.InsuCode = '';
    this.RegionCode = '';
    this.BranchCode = '';
    this.InsertMode = 'Insert';
    this.UserForm.reset();

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
        "InsuranceId": this.userEditDetails.InsuranceId,
        "Branchcode": this.userEditDetails.Branchcode,
        "Loginid": this.userEditDetails.Loginid,
        "Password" :this.ReNewPassword,
      }
      return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

        if (data.Response == "Password updated Sucessfully") {
          this.panelOpen = false;
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

  onSaveUserDetials() {

    let UrlLink = `authentication/adminlogininsert`;
    let ReqObj = {
      "Usertype": "user",
      "Username": this.UserForm.controls['Username'].value,
      "Loginid": this.UserForm.controls['LoginId'].value,
      "InsuranceId": this.InsuCode,
      "Regioncode": this.RegionCode,
      "Branchcode": this.BranchCode,
      "Mobilenumber": this.UserForm.controls['MobileNumber'].value,
      "Productid": "66",
      "Status": this.UserForm.controls['Status'].value,
      "Password": this.UserForm.controls['Password'].value,
      "Usermail": this.UserForm.controls['UserMail'].value,
      "Menuid": "1,2,3",
      "Mode": this.InsertMode
    };
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Response == "Admin Login Details Insert Sucessfully") {
        this.UserList = await this.onGetUserList();
        this.tableData = this.UserList;
        this.panelOpen = false;

        Swal.fire(
          `Claim Created Successfully`,
          'success',
          'success'
        );
      }
      if (data.Response == "Admin Login Details Update Sucessfully") {
        this.UserList = await this.onGetUserList();
        this.tableData = this.UserList;
        this.panelOpen = false;

        Swal.fire(
          `Claim Updated Successfully`,
          'success',
          'success'
        );
      }
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element: any = data.Errors[index];
          this.UserForm.controls[element.Field].setErrors({ message: element.Message });

        }

      }


    }, (err) => {
      this.handleError(err);
    })
  }


  async onActionHandler(row) {
    this.userEditDetails= await this.onUserEditDetails(row);
    if (this.userEditDetails) {
      this.panelOpen = true;
      this.InsertMode = 'Update';
      await this.onChangeCompanyList(this.userEditDetails.InsuranceId);
      await this.onChangeRegionList(this.userEditDetails.Regioncode);
      await this.onChangeBranchList(this.userEditDetails.Branchcode);
      this.UserForm.controls['UserType'].setValue(this.userEditDetails.Usertype);
      this.UserForm.controls['Username'].setValue(this.userEditDetails.Username);
      this.UserForm.controls['LoginId'].setValue(this.userEditDetails.Loginid);
      this.UserForm.controls['Product'].setValue(this.userEditDetails.Productid);
      this.UserForm.controls['UserMail'].setValue(this.userEditDetails.Usermail);
      this.UserForm.controls['MobileNumber'].setValue(this.userEditDetails.Mobilenumber);
      this.UserForm.controls['Status'].setValue(this.userEditDetails.Status);
    }
    console.log(this.userEditDetails);
  }

  async onUserEditDetails(row) {
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
