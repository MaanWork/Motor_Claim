import { Component, OnInit } from '@angular/core';
import { startWith, map } from 'rxjs/operators';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/admin/admin.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
export interface DataTableElement {
  Bankcode: any,
  Bankname: any,
  Entrydate: any,
  Inscompanyid: any,
  Remarks: any,
  Status: any,
}
@Component({
  selector: 'app-document-master',
  templateUrl: './document-master.component.html',
  styleUrls: ['./document-master.component.css']
})
export class DocumentMasterComponent implements OnInit {

  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  BankListForm:FormGroup;
  InsuranceCmpyList: any=[];
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  InsuCode: any;effectiveValue:any="";
  occupationListGrid: any;public tableData: DataTableElement[];
  public tableData2: DataTableElement[];
  public tableData3: DataTableElement[];
  public tableData4: DataTableElement[];
  public tableData5: DataTableElement[];
  columnHeader: any;columnHeader2: any;columnHeader3: any;columnHeader4: any;
  columnHeader5: any;
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
    this.BankListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }


  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
        "Documentid": ['',Validators.required],
        "Docapplicable": ['',Validators.required],
        "Productid": 66,
        "Companyid": ['',Validators.required],
        "Documentdesc": ['',Validators.required],
        "Policytype": ['',Validators.required],
        "Mandatorystatus": ['N',Validators.required],
        "Status": ['Y',Validators.required],
        "Remarks": ['',Validators.required],
        "Displayorder": ['',Validators.required],
        "Effectivedate": ['',Validators.required],
        "Amendid": ['',Validators.required],
        "Documentdescarabic": ['',Validators.required],
        "Apicheck": ['',Validators.required],
        "Apicheckname": ['',Validators.required],
        "Coreappcode": ['',Validators.required],
        "Agencycode": ['',Validators.required]
    })
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      this.BankListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.onLoadCityListGrid();
    }
  }
  onLoadCityListGrid(){
    this.tableData = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode,
      "Docapplicable": "CLAIM-INTIMATION"
    }
    let UrlLink = `api/getclaimdocmasterlist`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("Bank Master List",data)
      this.occupationListGrid = data;
      this.columnHeader = [
       
        { key: "documentDesc", display: "DOCUMENT NAME" },
        {
          key: "Mandatorystatus",
          display: "MANDATORY",
          config: {
            isBoolean: 'Y',
            values: { Y: "Mandatory", N: "Not-Mandatory" }
          }
        },
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
      console.log('HHHHHHHHHHHHHHHH',this.tableData);
      this.getAccidentDocument();
    }, (err) => {
      this.handleError(err);
    })
  }
  getAccidentDocument(){
    this.tableData2 = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode,
      "Docapplicable": "CLAIM-ACC"
    }
    let UrlLink = `api/getclaimdocmasterlist`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("Bank Master List",data)
      this.columnHeader2 = [
       
        { key: "documentDesc", display: "DOCUMENT NAME" },
        {
          key: "Mandatorystatus",
          display: "MANDATORY",
          config: {
            isBoolean: 'Y',
            values: { Y: "Mandatory", N: "Not-Mandatory" }
          }
        },
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
      this.tableData2 = data;
      console.log('KKKKKKKKKKKKKKK',this.tableData2)
      this.getLossDocument();
    }, (err) => {
      this.handleError(err);
    })
  }
  getLossDocument(){
    this.tableData3 = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode,
      "Docapplicable": "CLAIM"
    }
    let UrlLink = `api/getclaimdocmasterlist`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("Bank Master List",data)
      this.columnHeader3 = [
       
        { key: "documentDesc", display: "DOCUMENT NAME" },
        {
          key: "Mandatorystatus",
          display: "MANDATORY",
          config: {
            isBoolean: 'Y',
            values: { Y: "Mandatory", N: "Not-Mandatory" }
          }
        },
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
      this.tableData3 = data;
      this.getSurveyorDocument();
    }, (err) => {
      this.handleError(err);
    })
  }
  getSurveyorDocument(){
    this.tableData4 = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode,
      "Docapplicable": "CLAIM-ASSESSOR"
    }
    let UrlLink = `api/getclaimdocmasterlist`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("Bank Master List",data)
      this.columnHeader4 = [
      
        { key: "documentDesc", display: "DOCUMENT NAME" },
        {
          key: "Mandatorystatus",
          display: "MANDATORY",
          config: {
            isBoolean: 'Y',
            values: { Y: "Mandatory", N: "Not-Mandatory" }
          }
        },
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
            values: { Y: "Active", N: "Inactive" }
          }
        },
      ];
      this.tableData4 = data;
      this.getGarageDocuments();
    }, (err) => {
      this.handleError(err);
    })
  }

  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/docchangestatus`;
    let ReqObj = {
      Status:event.data.Status,
      Companyid: this.InsuCode,
      Effectivedate:event.data.EffectiveDate,
       Documentid: event.element.documentId,
       //Docapplicable: event.element.Docapplicable
      
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.onLoadCityListGrid();
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
  getGarageDocuments(){
    this.tableData5 = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode,
      "Docapplicable": "CLAIM-GARAGE"
    }
    let UrlLink = `api/getclaimdocmasterlist`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("Bank Master List",data)
      this.columnHeader5 = [
       
        { key: "documentDesc", display: "DOCUMENT NAME" },
        {
          key: "Mandatorystatus",
          display: "MANDATORY",
          config: {
            isBoolean: 'Y',
            values: { Y: "Mandatory", N: "Not-Mandatory" }
          }
        },
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
      this.tableData5 = data;
    }, (err) => {
      this.handleError(err);
    })
  }
  async onFetechInitialData(){
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.BankListForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance")),
    );


    this.filteredInsuranceComp = this.FormGroupData.controls['Companyid'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance2")),
    );
  }
  onAddNew(type,modal) {
    /*this.InsertMode = 'Insert';
    if(this.InsertMode == 'Insert'){
      this.onCreateFormControl();
    }*/
    this.open(modal);
    this.effectiveValue="";
    this.onCreateFormControl();
    this.FormGroupData.controls['Docapplicable'].setValue(type);
    this.onChangeCompanyValue(String(this.logindata.InsuranceId))
    //this.panelOpen = false;
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  onEditOccupationData(userData){
    if(userData){
      console.log("Edit Values",userData);
      this.FormGroupData.controls['Agencycode'].setValue(userData.Agencycode);
      this.FormGroupData.controls['Amendid'].setValue(userData.Amendid);
      this.FormGroupData.controls['Apicheck'].setValue(userData.Apicheck);
      this.FormGroupData.controls['Apicheckname'].setValue(userData.Apicheckname);
      this.FormGroupData.controls['Coreappcode'].setValue(userData.Coreappcode);
      this.FormGroupData.controls['Displayorder'].setValue(userData.Displayorder);
      this.FormGroupData.controls['Documentdescarabic'].setValue(userData.Documentdescarabic);
      this.onChangeCompanyValue(userData.companyId)
      this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate)
      this.FormGroupData.controls['Mandatorystatus'].setValue(userData.Mandatorystatus);
      this.FormGroupData.controls['Policytype'].setValue(userData.Policytype);
      this.FormGroupData.controls['Productid'].setValue(userData.ProductId);
      this.FormGroupData.controls['Docapplicable'].setValue(userData.docApplicable);
      this.FormGroupData.controls['Documentid'].setValue(userData.documentId);
      this.FormGroupData.controls['Documentdesc'].setValue(userData.documentDesc);
      this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
      this.FormGroupData.controls['Status'].setValue(userData.Status);
      //this.panelOpen = false;
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
  onSaveDocDetials(modal) {

    let UrlLink = `api/insertclaimdocmaster`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "Documentid": this.FormGroupData.controls['Documentid'].value,
      "Docapplicable": this.FormGroupData.controls['Docapplicable'].value,
      "Productid":this.FormGroupData.controls['Productid'].value,
      "Companyid": this.InsCompCode,
      "Documentdesc": this.FormGroupData.controls['Documentdesc'].value,
      "Policytype": this.FormGroupData.controls['Policytype'].value,
      "Mandatorystatus": this.FormGroupData.controls['Mandatorystatus'].value,
      "Status": this.FormGroupData.controls['Status'].value,
      "Remarks": this.FormGroupData.controls['Remarks'].value,
      "Displayorder": this.FormGroupData.controls['Displayorder'].value,
      "Effectivedate":effectiveDate,
      "Amendid": this.FormGroupData.controls['Amendid'].value,
      "Documentdescarabic": this.FormGroupData.controls['Documentdescarabic'].value,
      "Apicheck": this.FormGroupData.controls['Apicheck'].value,
      "Apicheckname": this.FormGroupData.controls['Apicheckname'].value,
      "Coreappcode": this.FormGroupData.controls['Coreappcode'].value,
      "Agencycode": this.FormGroupData.controls['Agencycode'].value
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
        await this.onLoadCityListGrid();
        this.panelOpen = true;
        Swal.fire(
          `Document Details Created/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#claimmodal").hide();
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  async onActionHandler(row,modal) {
    console.log(row);
    this.open(modal)
    let UrlLink = "api/claimdocmasterbyid";
    let ReqObj = {
      "Documentid": row.documentId,
      "Docapplicable": row.docApplicable,
      "Productid": row.ProductId,
      "InsuranceId": row.companyId
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
      this.FormGroupData.controls['Companyid'].setValue(Code.CodeDesc);
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
