import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AdminService } from 'src/app/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
export interface DataTableElement {
  Amendid: any,
  Coreappcode: any,
  Entrydate: any,
  Inscompanyid: any,
  Nationalitydesc: any,
  Nationalityid: any,
  Remarks: any,
  Sno: any,
  Status: any,
}
@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.css']
})
export class RoleMasterComponent implements OnInit {

  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  RoleListForm:FormGroup;
  public tableData: DataTableElement[];
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  columnHeader: any;effectiveValue:any="";
  InsCompCode: any;
  InsuranceCmpyList: any;
  InsuCode: any;
  roleListGrid: DataTableElement[];
  logindata: any;minDate:Date;
  closeResult: string;
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private datePipe:DatePipe,
    private modalService: NgbModal
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.RoleListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }


  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
      "InsuranceId": [{ value: '', disabled: false }, [Validators.required]],
      "Remarks": [{ value: '', disabled: false }, [Validators.required]],
      "Roledesc": [{ value: '', disabled: false }, [Validators.required]],
      "Rolehierarchy": [{ value: '', disabled: false }, [Validators.required]],
      "Roleid": [{ value: '', disabled: false }, [Validators.required]],
      "Status": [{ value: 'Y', disabled: false }, [Validators.required]]
    })
  }
  async onFetechInitialData(){
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.RoleListForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance")),
    );


    this.filteredInsuranceComp = this.FormGroupData.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance2")),
    );
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

      this.RoleListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.onLoadRoleListGrid();
    }
  }
  async onChangeCompanyValue(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsCompCode = insuranceCode;
      this.FormGroupData.controls['InsuranceId'].setValue(Code.CodeDesc);
    }
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  onSaveRoleDetials(modal) {

    let UrlLink = `api/insertrolemaster`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "InsuranceId": this.InsCompCode,
      "Remarks": this.FormGroupData.controls['Remarks'].value,
      "Roledesc": this.FormGroupData.controls['Roledesc'].value,
      "Rolehierarchy": this.FormGroupData.controls['Rolehierarchy'].value,
      "Roleid": this.FormGroupData.controls['Roleid'].value,
      "Effectivedate": effectiveDate,
      "Status": this.FormGroupData.controls['Status'].value,
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        // for (let index = 0; index < data.Errors.length; index++) {
        //   const element: any = data.Errors[index];
        //   this.FormGroupData.controls[element.Field].setErrors({ message: element.Message });

        // }
      }
      else{
        await this.onLoadRoleListGrid();
        this.panelOpen = true;
        Swal.fire(
          `Role Details Created/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#rolemodal").hide();
      }

    }, (err) => {
      this.handleError(err);
    })
  }


  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/rolechangestatus`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: event.element.InsuranceId,
      //RegionCode:event.element.Regioncode,
      Effectivedate:event.data.EffectiveDate,
      Roleid:event.element.Roleid,
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.onFetechInitialData()
        this.panelOpen = true;
        Swal.fire(
          `Change Status Updated Successfully`,
          'success',
          'success'
        );
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  async onActionHandler(row,modal) {
    console.log(row);
     this.open(modal)
    let UrlLink = "api/getrolemasterid";
    let ReqObj = {
      "InsuranceId": row.InsuranceId,
        "Roleid": row.Roleid
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.onEditRoleData(data);
      }, (err) => {
        this.handleError(err);
      })
  }
  onEditRoleData(userData){
      if(userData){
          console.log("Edit Value",userData);
          this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate);
          this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
          this.FormGroupData.controls['Roledesc'].setValue(userData.Roledesc)
          this.FormGroupData.controls['Rolehierarchy'].setValue(userData.Rolehierarchy);
          this.FormGroupData.controls['Status'].setValue(userData.Status);
          this.FormGroupData.controls['Roleid'].setValue(userData.Roleid);
          this.onChangeCompanyValue(userData.InsuranceId);
          this.panelOpen = false;
      }
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
  onLoadRoleListGrid(){
    this.tableData = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode
    }
    let UrlLink = `api/getrolemaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.roleListGrid = data;
      this.columnHeader = [
       
        { key: "Roledesc", display: "ROLE NAME" },
        { key: "Rolehierarchy", display: "ROLE HIERARCHY" },
        { key: "Effectivedate", display: "Effective Date" },
        //{ key: "Remarks", display: "REMARKS" },
        {
          key: "action",
          display: "ACTION",
          config: {
            isAction: true,
            actions: ["EDIT"]
          }
        },
        {
          key: "Status",
          display: "STATUS",
          config: {
            isStatus: 'Y',
            values: { Y: "Active", N: "Inactive", R: "Referral" }
          }
        },
      ];
      this.tableData = this.roleListGrid;
      console.log(data)
    }, (err) => {
      this.handleError(err);
    })
  }
  onAddNew(modal) {
     this.open(modal)
    this.InsertMode = 'Insert';
      this.onCreateFormControl();
      this.effectiveValue = "";
    this.onChangeCompanyValue(this.logindata.InsuranceId);
    //this.panelOpen = false;
  }
  private _filter(value: string, dropname: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    if (dropname == 'insurance') {
      return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'insurance2') {
      return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
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

  open(content) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static',ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
