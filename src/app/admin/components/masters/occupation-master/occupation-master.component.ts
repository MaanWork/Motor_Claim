import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
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
  selector: 'app-occupation-master',
  templateUrl: './occupation-master.component.html',
  styleUrls: ['./occupation-master.component.css']
})
export class OccupationMasterComponent implements OnInit {

  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  OccupationListForm:FormGroup;
  InsuranceCmpyList: any=[];
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  InsuCode: any;effectiveValue:any="";
  occupationListGrid: any;public tableData: DataTableElement[];
  columnHeader: any;
  InsCompCode: any;
  logindata: any;
  minDate: Date;
  closeResult: string;
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private datePipe:DatePipe,
    private modalService: NgbModal,
  ) {
    this.minDate = new Date();
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
    this.OccupationListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }


  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
        "Amendid":  [{ value: '', disabled: false },Validators.required],
        "Coreappcode": [{ value: '', disabled: false },Validators.required],
        "Displayorder": [{ value: '', disabled: false }],
        "Effectivedate": [{ value: '', disabled: false },Validators.required],
        "Entrydate": [{ value: '', disabled: false }],
        "InsuranceId": [{ value: '', disabled: false },Validators.required],
        "Occupationid": [{ value: '', disabled: false },Validators.required],
        "Occupationname": [{ value: '', disabled: false },Validators.required],
        "Occupationnamear": [{ value: '', disabled: false }],
        "Othrappcode1": [{ value: '', disabled: false }],
        "Othrappcode2": [{ value: '', disabled: false }],
        "Productid": [{ value: '', disabled: false }],
        "Remarks": [{ value: '', disabled: false },Validators.required],
        "Status": [{ value: 'Y', disabled: false }]
    })
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;

      this.OccupationListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.onLoadOccupationListGrid();
    }
  }
  onLoadOccupationListGrid(){
    this.tableData = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode
    }
    let UrlLink = `api/getoccupationmaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.occupationListGrid = data;
      this.columnHeader = [
        { key: "Occupationname", display: "OCCUPATION NAME" },
        { key: "Coreappcode", display: "CORE APP CODE" },
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
      this.tableData = this.occupationListGrid;
      console.log(data)
    }, (err) => {
      this.handleError(err);
    })
  }
  async onFetechInitialData(){
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.OccupationListForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance")),
    );


    this.filteredInsuranceComp = this.FormGroupData.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance2")),
    );
  }
  onAddNew(modal) {
    this.InsertMode = 'Insert';
    this.open(modal);
    this.onCreateFormControl();
    // if(this.InsertMode == 'Insert'){
    //   this.onCreateFormControl();
    // }
    this.effectiveValue = "";
    this.onChangeCompanyValue(String(this.logindata.InsuranceId))
    this.panelOpen = false;
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  onEditOccupationData(userData){
    if(userData){
      console.log("Edit Values",userData);
      this.FormGroupData.controls['Amendid'].setValue(userData.Amendid);
      this.FormGroupData.controls['Occupationid'].setValue(userData.Occupationid);
      this.FormGroupData.controls['Occupationname'].setValue(userData.Occupationname);
      this.FormGroupData.controls['Coreappcode'].setValue(userData.Coreappcode);
      this.FormGroupData.controls['Entrydate'].setValue(userData.Entrydate);
      this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
      this.FormGroupData.controls['Status'].setValue(userData.Status);
      this.FormGroupData.controls['Displayorder'].setValue(userData.Displayorder);
      this.FormGroupData.controls['Othrappcode1'].setValue(userData.Othrappcode1);
      this.FormGroupData.controls['Othrappcode2'].setValue(userData.Othrappcode2);
      this.FormGroupData.controls['Productid'].setValue(userData.Productid);
      this.onChangeCompanyValue(String(userData.Inscompanyid));
      this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate)
      this.panelOpen = false;
    }
  }
  onDateFormatInEdit(date) {
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
  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/changestatusoccuptationdetails`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: this.InsuCode,
      OccupationId:event.element.Occupationid,
      Effectivedate:event.data.EffectiveDate, 
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.onLoadOccupationListGrid();
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
  onSaveOccupationDetials(modal) {

    let UrlLink = `api/insertoccupationmaster`;
    let effectiveDate:any;
    let product =  this.FormGroupData.controls['Productid'].value;
    if(product == null || product == "" || product == undefined){
      product = "66";
    }
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "Amendid": this.FormGroupData.controls['Amendid'].value,
      "Coreappcode": this.FormGroupData.controls['Coreappcode'].value,
      "Displayorder": this.FormGroupData.controls['Displayorder'].value,
      "Effectivedate": effectiveDate,
      "InsuranceId": this.InsuCode,
      "Occupationid": this.FormGroupData.controls['Occupationid'].value,
      "Occupationname": this.FormGroupData.controls['Occupationname'].value,
      "Occupationnamear": this.FormGroupData.controls['Occupationnamear'].value,
      "Othrappcode1": this.FormGroupData.controls['Othrappcode1'].value,
      "Othrappcode2": this.FormGroupData.controls['Othrappcode2'].value,
      "Productid": product,
      "Remarks": this.FormGroupData.controls['Remarks'].value,
      "Status": this.FormGroupData.controls['Status'].value
    };
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        // for (let index = 0; index < data.Errors.length; index++) {
        //   const element: any = data.Errors[index];
        //   this.FormGroupData.controls[element.Field].setErrors({ message: element.Message });

        // }
      }
      else{
        await this.onLoadOccupationListGrid();
        this.panelOpen = true;
        Swal.fire(
          `Occupation Details Created/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#namodal").hide();
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  async onActionHandler(row,modal) {
    console.log(row);
    this.open(modal)
    let UrlLink = "api/occupationmasterid";
    let ReqObj = {
      "Occupationid": row.Occupationid,
      "Productid": row.Productid,
      "InsuranceId": row.Inscompanyid
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.onEditOccupationData(data);
      }, (err) => {
        this.handleError(err);
      })
  }
  async onChangeCompanyValue(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsCompCode = insuranceCode;
      this.FormGroupData.controls['InsuranceId'].setValue(Code.CodeDesc);
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
