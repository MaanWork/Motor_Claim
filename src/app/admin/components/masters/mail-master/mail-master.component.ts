import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatChipInputEvent } from '@angular/material/chips';
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
  selector: 'app-mail-master',
  templateUrl: './mail-master.component.html',
  styleUrls: ['./mail-master.component.css']
})
export class MailMasterComponent implements OnInit {

  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  MailListForm:FormGroup;
  InsuranceCmpyList: any=[];
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  InsuCode: any;effectiveValue:any="";
  occupationListGrid: any;public tableData: DataTableElement[];
  columnHeader: any;
  InsCompCode: any;
  logindata: any;
  mailList: any[] = [];
  addOnBlur = true;ccName:any="";
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
    this.MailListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      let Exist = this.mailList.some((ele:any)=>ele == value);
      if(!Exist){
        this.mailList.push(value);
      }
    }
    // Clear the input value
    this.ccName = "";
  }

  remove(fruit): void {
    const index = this.mailList.indexOf(fruit);

    if (index >= 0) {
      this.mailList.splice(index, 1);
    }
  }

  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
        "Applicationid": ['',Validators.required],
        "Mailcc": ['',Validators.required],
        "Smtphost": ['',Validators.required],
        "Smtpuser": ['',Validators.required],
        "Smtppwd": ['',Validators.required],
        "Expdate": ['45',Validators.required],
        "Exptime": ['5',Validators.required],
        "Pwdcnt": ['1',Validators.required],
        "Pwdlen": ['67',Validators.required],
        "Homeapplicationid": ['',Validators.required],
        "Address":['',Validators.required],
        "Status": ['Y',Validators.required],
        "Remarks":['',Validators.required],
        "Companyname": ['',Validators.required],
        "Toaddress": ['',Validators.required],
        "Authorizyn": ['Y',Validators.required],
        "Smtpport": ['',Validators.required],
        "Inscompanyid": ['',Validators.required]
    })
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;

      this.MailListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.onLoadMailListGrid();
    }
  }
  onLoadMailListGrid(){
    this.tableData = null;
    let ReqObj = {
      "Status": "Y",
      "Inscompanyid": this.InsuCode
    }
    let UrlLink = `api/getmailmaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("Bank Master List",data)
      this.occupationListGrid = data;
      this.columnHeader = [
        
        { key: "Smtpuser", display: "USER NAME" },
        { key: "Toaddress", display: "TO ADDRESS" },
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
            isBoolean: 'Y',
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
    this.filteredInsurance = this.MailListForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance")),
    );


    this.filteredInsuranceComp = this.FormGroupData.controls['Inscompanyid'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance2")),
    );
  }
  onAddNew(modal) {

    console.log('iiiiiiiiiiiii',this.panelOpen);
    this.open(modal);
    this.onCreateFormControl();
    this.onFetechInitialData();
    //this.onCreateFormControl();
    //this.InsertMode = 'Insert';
    /*if(this.InsertMode == 'Insert'){
      this.onCreateFormControl();
    }*/
    this.effectiveValue="";
    this.onChangeCompanyValue(String(this.logindata.InsuranceId))
    //this.panelOpen = false;
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  onEditMailData(userData){
    if(userData){
      console.log("Edit Values",userData);
      this.FormGroupData.controls['Applicationid'].setValue(userData.Applicationid);
      if(userData.Mailcc){
        this.mailList = userData.Mailcc.split(',');
      }
      this.FormGroupData.controls['Address'].setValue(userData.Address);
      this.FormGroupData.controls['Authorizyn'].setValue(userData.Authorizyn);
      this.FormGroupData.controls['Companyname'].setValue(userData.Companyname);
      this.FormGroupData.controls['Expdate'].setValue(userData.Expdate);
      this.FormGroupData.controls['Exptime'].setValue(userData.Exptime);
      this.FormGroupData.controls['Homeapplicationid'].setValue(userData.Homeapplicationid);
      this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate);
      this.onChangeCompanyValue(userData.Inscompanyid);
      this.FormGroupData.controls['Pwdcnt'].setValue(userData.Pwdcnt);
      this.FormGroupData.controls['Pwdlen'].setValue(userData.Pwdlen);
      this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
      this.FormGroupData.controls['Smtphost'].setValue(userData.Smtphost);
      this.FormGroupData.controls['Smtpport'].setValue(userData.Smtpport);
      this.FormGroupData.controls['Smtppwd'].setValue(userData.Smtppwd);
      this.FormGroupData.controls['Smtpuser'].setValue(userData.Smtpuser);
      this.FormGroupData.controls['Status'].setValue(userData.Status);
      this.FormGroupData.controls['Toaddress'].setValue(userData.Toaddress);
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
  onSaveMailDetials(modal) {

    let UrlLink = `api/insertmailmaster`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let mailcc = "";
    if(this.mailList){
        if(this.mailList.length>0){
          let i = 0;
          for(let mail of this.mailList){
              if(i != 0){
                  mailcc = mailcc+","+mail;
              }
              else{
                mailcc = mail;
              }
              i+=1;
          }
        }
    }
    let ReqObj = {
      "Applicationid": this.InsuCode,
        "Mailcc": mailcc,
        "Smtphost": this.FormGroupData.controls['Smtphost'].value,
        "Smtpuser": this.FormGroupData.controls['Smtpuser'].value,
        "Smtppwd": this.FormGroupData.controls['Smtppwd'].value,
        "Expdate": '45',
        "Exptime": '5',
        "Pwdcnt": '1',
        "Pwdlen": '67',
        "Homeapplicationid": this.FormGroupData.controls['Address'].value,
        "Address":this.FormGroupData.controls['Address'].value,
        "Status": this.FormGroupData.controls['Status'].value,
        "Remarks":this.FormGroupData.controls['Remarks'].value,
        "Companyname": this.FormGroupData.controls['Companyname'].value,
        "Toaddress": this.FormGroupData.controls['Toaddress'].value,
        "Authorizyn": this.FormGroupData.controls['Authorizyn'].value,
        "Smtpport": this.FormGroupData.controls['Smtpport'].value,
        "Inscompanyid": this.InsuCode,
        "Effectivedate":effectiveDate
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
        await this.onLoadMailListGrid();
        this.panelOpen = true;
        Swal.fire(
          `Mail Details Created/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#Mailmodal").hide();
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  async onActionHandler(row,modal) {
    console.log(row);
      this.open(modal)
    let UrlLink = "api/getmailmasterid";
    let ReqObj = {
      "Applicationid": row.Applicationid
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.onEditMailData(data);
      }, (err) => {
        this.handleError(err);
      })
  }
  async onChangeCompanyValue(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsCompCode = insuranceCode;
      this.FormGroupData.controls['Inscompanyid'].setValue(Code.CodeDesc);
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
