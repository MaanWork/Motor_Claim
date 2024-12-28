import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/admin/admin.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
export interface DataTableElement {
  partytypeDesc:any,
  partytypeId:any,
  policytypeid:any,
  remarks:any,
  status:any,
}
@Component({
  selector: 'app-notifiy-master',
  templateUrl: './notifiy-master.component.html',
  styleUrls: ['./notifiy-master.component.css']
})
export class NotifiyMasterComponent implements OnInit {
  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  NotificationForm: FormGroup;
  InsuranceCmpyList: any;
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  InsuCode: any;
  nationalityListGrid: any;
  columnHeader: any;
  public tableData: DataTableElement[];
  InsCompCode: any;
  logindata: any;effectiveValue:any="";
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
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.minDate = new Date();
    let reload = sessionStorage.getItem('garageLoginReload');
    if(reload){
      sessionStorage.removeItem('garageLoginReload');
      window.location.reload();
    }
   }

  ngOnInit(): void {
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.NotificationForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]

    });
  }
  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
      "Mailrequired": [{ value: '', disabled: false }],
      "Insid": [{ value: '', disabled: false }],
      "Sno": [{ value: '', disabled: false }],
      "Mailsubject":[{ value: '', disabled: false }],
      "Mailbody": [{ value: '', disabled: false }],
      "Mailbodyar": [{ value: '', disabled: false }],
      "Mailregards":[{ value: '', disabled: false }],
      "Mailregardsar":[{ value: '', disabled: false }],
      "Entrydate": [{ value: '', disabled: false }],
      "Status": [{ value: 'Y', disabled: false }],
      "Shortremarks": [{ value: '', disabled: false }],
      "Smsrequired": [{ value: '', disabled: false }],
      "Smssubject": [{ value: '', disabled: false }],
      "Smsbodyen": [{ value: '', disabled: false }],
      "Smsbodyar": [{ value: '', disabled: false }],
      "Smsregards": [{ value: '', disabled: false }],
      "Smsregardsar": [{ value: '', disabled: false }],
      "Whatsapprequired": [{ value: '', disabled: false }],
      "Whatsappsubject": [{ value: '', disabled: false }],
      "Whatsappbodyen": [{ value: '', disabled: false }],
      "Whatsappbodyar": [{ value: '', disabled: false }],
      "Whatsappregards": [{ value: '', disabled: false }],
      "Whatsappregardsar": [{ value: '', disabled: false }],
      "Querykey": [{ value: '', disabled: false }],
      "Remarks": [{ value: '', disabled: false }],
    })
  }
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.NotificationForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );


    this.filteredInsuranceComp = this.FormGroupData.controls['Insid'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter1(value)),
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
  async onChangeCompanyValue(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsCompCode = insuranceCode;
      this.FormGroupData.controls['Insid'].setValue(Code.CodeDesc);
    }
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;

      this.NotificationForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
      this.onLoadNotificationListGrid();
      console.log("Received Country List", this.nationalityListGrid);
    }
  }
  addNotifySetup(event,type){
    if(type == 'sms'){
      if(event){
          this.FormGroupData.controls['Smsrequired'].setValue('Y');
      }
      else{
        this.FormGroupData.controls['Smsrequired'].setValue('N');
      }
    }
    if(type == 'mail'){
      if(event){
          this.FormGroupData.controls['Mailrequired'].setValue('Y');
      }
      else{
        this.FormGroupData.controls['Mailrequired'].setValue('N');
      }
    }
    if(type == 'whatsapp'){
      if(event){
          this.FormGroupData.controls['Whatsapprequired'].setValue('Y');
      }
      else{
        this.FormGroupData.controls['Whatsapprequired'].setValue('N');
      }
    }
  }
  checkNotifySetup(type){
      if(type == 'sms'){
        return this.FormGroupData.controls['Smsrequired'].value == 'Y';
      }
      else if(type == 'mail'){
        return this.FormGroupData.controls['Mailrequired'].value == 'Y';
      }
      else if(type == 'whatsapp'){
        return this.FormGroupData.controls['Whatsapprequired'].value == 'Y';
      }
  }
  onLoadNotificationListGrid(){
    this.tableData = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode
    }
    let UrlLink = `api/getenotiftemplatemaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("Notification List",data);
      this.nationalityListGrid = data;
      this.columnHeader = [
        { key: "Mailrequired", display: "Mail", config: {
          isBoolean: 'Y',
          values: { Y: "Active", N: "Inactive"}
        } },
        { key: "Smsrequired", display: "SMS", config: {
          isBoolean: 'Y',
          values: { Y: "Active", N: "Inactive"}
        } },
        { key: "Whatsapprequired", display: "WHATSAPP", config: {
          isBoolean: 'Y',
          values: { Y: "Active", N: "Inactive"}
        } },
        { key: "Smssubject", display: "SUBJECT" },
        { key: "Effectivedate", display: "Effective Date" },

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
        }
      ];
      this.tableData = this.nationalityListGrid;
      console.log(data)
    }, (err) => {
      this.handleError(err);
    })
  }
  async onActionHandler(row,modal) {
    console.log(row);
       this.open(modal)
    let UrlLink = "api/notiftemplatemasterid";
    let ReqObj = {
      "Status": row.Status,
      "Sno": row.Sno,
      "InsuranceId": row.Insid
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.onEditNationalityData(data);
      }, (err) => {
        this.handleError(err);
      })
  }
  onEditNationalityData(userData){
      if(userData){
        console.log("Edit Values",userData);
        this.FormGroupData.controls['Sno'].setValue(userData.Sno);
        this.onChangeCompanyValue(String(userData.Insid));
        if(userData.Status == null || userData.Status == ""){
          userData.Status = 'N';
        }
        this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate);
        this.FormGroupData.controls['Status'].setValue(userData.Status);
        this.FormGroupData.controls['Mailbody'].setValue(userData.Mailbody);
        this.FormGroupData.controls['Mailbodyar'].setValue(userData.Mailbodyar);
        this.FormGroupData.controls['Mailregards'].setValue(userData.Mailregards);
        this.FormGroupData.controls['Mailregardsar'].setValue(userData.Mailregardsar);
        this.FormGroupData.controls['Mailrequired'].setValue(userData.Mailrequired);
        this.FormGroupData.controls['Mailsubject'].setValue(userData.Mailsubject);
        this.FormGroupData.controls['Querykey'].setValue(userData.Querykey);
        this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
        this.FormGroupData.controls['Shortremarks'].setValue(userData.Shortremarks);
        this.FormGroupData.controls['Smsbodyar'].setValue(userData.Smsbodyar);
        this.FormGroupData.controls['Smsbodyen'].setValue(userData.Smsbodyen);
        this.FormGroupData.controls['Smsregards'].setValue(userData.Smsregards);
        this.FormGroupData.controls['Smsregardsar'].setValue(userData.Smsregardsar);
        this.FormGroupData.controls['Smsrequired'].setValue(userData.Smsrequired);
        this.FormGroupData.controls['Smssubject'].setValue(userData.Smssubject);
        this.FormGroupData.controls['Whatsappbodyen'].setValue(userData.Whatsappbodyen);
        this.FormGroupData.controls['Whatsappregards'].setValue(userData.Whatsappregards);
        this.FormGroupData.controls['Whatsappregardsar'].setValue(userData.Whatsappregardsar);
        this.FormGroupData.controls['Whatsapprequired'].setValue(userData.Whatsapprequired);
        this.FormGroupData.controls['Whatsappsubject'].setValue(userData.Whatsappsubject);
        this.panelOpen = false;
      }
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
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
  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/changestatusnotificationdetails`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId:event.element.Insid,
      Sno:event.element.Sno,
      Effectivedate:event.data.EffectiveDate,
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.onLoadNotificationListGrid();
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
  onFormSubmit(modal){
    let UrlLink = "api/insertnotiftemplatemaster";
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
        "Sno":this.FormGroupData.controls['Sno'].value,
        "Status": this.FormGroupData.controls['Status'].value,
        "InsuranceId": this.InsCompCode,
        "Mailrequired": this.FormGroupData.controls['Mailrequired'].value,
        "Mailsubject": this.FormGroupData.controls['Mailsubject'].value,
        "Mailbody": this.FormGroupData.controls['Mailbody'].value,
        "Mailregards": this.FormGroupData.controls['Mailregards'].value,
        "Smsrequired": this.FormGroupData.controls['Smsrequired'].value,
        "Smssubject": this.FormGroupData.controls['Smssubject'].value,
        "Smsbodyen": this.FormGroupData.controls['Smsbodyen'].value,
        "Smsbodyar": this.FormGroupData.controls['Smsbodyar'].value,
        "Smsregards": this.FormGroupData.controls['Smsregards'].value,
        "Remarks": this.FormGroupData.controls['Remarks'].value,
        "Emailto": null,
        "Emailcc": null,
        "Usertype": null,
        "Smsto": null,
        "Smsregardsar": this.FormGroupData.controls['Smsregardsar'].value,
        "Productid": 66,
        "Whatsapprequired": this.FormGroupData.controls['Whatsapprequired'].value,
        "Mailbodyar": this.FormGroupData.controls['Mailbodyar'].value,
        "Mailregardsar": this.FormGroupData.controls['Mailregardsar'].value,
        "Fileyn": "N",
        "Shortremarks": this.FormGroupData.controls['Shortremarks'].value,
        "Hittype": "I",
        "Whatsappsubject": this.FormGroupData.controls['Whatsappsubject'].value,
        "Whatsappbodyen": this.FormGroupData.controls['Whatsappbodyen'].value,
        "Whatsappbodyar": this.FormGroupData.controls['Whatsappbodyar'].value,
        "Whatsappregards": this.FormGroupData.controls['Whatsappregards'].value,
        "Whatsappregardsar": this.FormGroupData.controls['Whatsappregardsar'].value,
        "Querykey": this.FormGroupData.controls['Querykey'].value,
        "Effectivedate": effectiveDate
      }

      return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

        if (data.Errors) {
          this.errorService.showValidateError(data.Errors);
          for (let index = 0; index < data.Errors.length; index++) {
            const element:any = data.Errors[index];
          this.FormGroupData.controls[element.Field].setErrors({message: element.Message });
          }
        }
        else{
          this.onLoadNotificationListGrid();
          this.panelOpen = true;
          Swal.fire(
            `Notification Details Inserted/Updated Successfully`,
            'success',
            'success'
          );
          modal.dismiss('Cross click');
          $("#notifymodal").hide();
        }

        console.log(data)
      }, (err) => {
        this.handleError(err);
      })
  }
  onAddNew(modal) {

     this.open(modal);
    this.InsertMode = 'Insert';
    this.effectiveValue="";
    this.onCreateFormControl();
    /*if(this.InsertMode == 'Insert'){
      this.onCreateFormControl();
    }*/
    this.panelOpen = false;
    this.onChangeCompanyValue(this.logindata.InsuranceId);
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
  private _filter(value: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
  }
  private _filter1(value: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));

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
