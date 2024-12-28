import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { startWith, map } from 'rxjs/operators';
import { AdminService } from 'src/app/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
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
  selector: 'app-exchange-master',
  templateUrl: './exchange-master.component.html',
  styleUrls: ['./exchange-master.component.css']
})
export class ExchangeMasterComponent implements OnInit {

  public FormGroupData: FormGroup;
  countrysList:any;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  SmsListForm: FormGroup;
  public tableData: DataTableElement[];
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredCountryList: Observable<any[]>;
  filteredCurrencyList: Observable<any[]>;
  columnHeader: any; effectiveValue: any = "";
  InsCompCode: any;
  InsuranceCmpyList: any;
  InsuCode: any;
  roleListGrid: DataTableElement[];
  logindata: any; minDate: Date;
  countryList: any;
  currencyList: any;
  countryCode: any;
  currencyCode: string;
  closeResult: string;
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private router:Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
  ) {
    this.minDate = new Date();
    let reload = sessionStorage.getItem('garageLoginReload');
    if(reload){
      sessionStorage.removeItem('garageLoginReload');
      window.location.reload();
    }
  }

  async ngOnInit() {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.SmsListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }


  /*onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
      "Exchangeid": ['', [Validators.required]],
      "Currencyid": ['', [Validators.required]],
      "Countryid": ['', [Validators.required]],
      "Exchangerate": ['', [Validators.required]],
      "Rsacode": ['', [Validators.required]],
      "Sno": ['', [Validators.required]],
      "Displayorder": ['', [Validators.required]],
      "InsuranceId": ['', [Validators.required]],
      "Remarks": ['', [Validators.required]],
      "Effectivedate": ['', [Validators.required]],
      "Status": ['Y', [Validators.required]]
    })
  }*/
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.onGetCountryList(this.logindata.InsuranceId)
    //this.countryList = await this.onGetCountryList(this.logindata.InsuranceId);;
    //console.log("Country List", this.countryList);
    /*this.filteredCountryList = this.FormGroupData.controls['Countryid'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value)),
    );*/
    
    this.filteredInsurance = this.SmsListForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, "insurance")),
    );


    this.filteredInsuranceComp = this.FormGroupData.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, "insurance2")),
    );
  }
  ngAfterViewInit(){
    /*this.filteredCountryList = this.FormGroupData.controls['Countryid'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value)),
    );*/
  }
  async onGetCountryList(Code) {
    let ReqObj = {
      "Inscompanyid": Code
    }
    let UrlLink = `api/newcountrydropdown`;
    let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.countryList = res;
        console.log('kkkkkkkkkkkkkkkkkkk',this.countryList)
        this.filteredCountryList = this.FormGroupData.controls['Countryid'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, 'country')),
        );
        console.log('MMMMMMMMMMMM',this.filteredCountryList);
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async ongetCurrencyListGrid() {
    let ReqObj = {
      // "Status": "Y",
      "InsuranceId": this.InsuCode,
      // "CountryCode": this.countryCode
    }
    let UrlLink = `api/currencydropdown`;
    let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.currencyList = res;
        console.log("Currency List", this.currencyList);
        this.filteredCurrencyList = this.FormGroupData.controls['Currencyid'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, 'currency')),
        );
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async onChangeCountryValue(countryCode) {

    console.log('CCCCCCCCCCCCCC',countryCode);
    let Code = this.countryList.find((ele: any) => ele.Code == countryCode);
    if (Code) {
      this.countryCode = Code.Code;
      this.FormGroupData.controls['Countryid'].setValue(Code.CodeDesc);
      this.FormGroupData.controls['Currencyid'].setValue("");
      await this.ongetCurrencyListGrid();
       //this.onChangeCurrencyValue();
    }
    else {
      this.countryCode = "";
      this.FormGroupData.controls['Countryid'].setValue('');
    }
  }
  async onChangeCurrencyValue(value) {
    console.log('JJJJJJJJJJJJJJJJJJJ',this.currencyList)
    let Code = this.currencyList.find((ele: any) => ele.Code == value);
    if (Code) {
      this.currencyCode = Code.Code;
      this.FormGroupData.controls['Currencyid'].setValue(Code.CodeDesc);
    }
    else {
      this.currencyCode = "";
      this.FormGroupData.controls['Currencyid'].setValue('');
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

      //this.SmsListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.onLoadRoleListGrid();
    }
  }
  async onChangeCompanyValue(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsCompCode = insuranceCode;
      //this.FormGroupData.controls['InsuranceId'].setValue(Code.CodeDesc);
    }
  }
  onCloseForm() {
    //this.onCreateFormControl();
    //this.panelOpen = true;
  }
  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/exchangechangestatus`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: this.InsuCode,
      Effectivedate:event.data.EffectiveDate,
      Exchangeid:event.element.Exchangeid,

    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.onLoadRoleListGrid();
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
  onSaveExchangeDetials(modal) {
  
    let UrlLink = `api/insertexchangemaster`;
    let effectiveDate: any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate = this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else {
      effectiveDate = "";
    }
    let insuranceId
    if(this.InsCompCode!=null){
      insuranceId=this.InsCompCode;
    }
    else if(this.InsuCode!=null){
      insuranceId=this.InsuCode;
    }
    let ReqObj = {
      "Exchangeid" :this.FormGroupData.controls['Exchangeid'].value,
      "CurrencyCode": this.currencyCode,
      "CountryCode":this.countryCode,
      "Countryid":"",
      "Exchangerate": this.FormGroupData.controls['Exchangerate'].value,
      "Rsacode": this.FormGroupData.controls['Rsacode'].value,
      "Sno": this.FormGroupData.controls['Sno'].value,
      "InsuranceId":insuranceId,
      "Remarks": this.FormGroupData.controls['Remarks'].value,
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
      else {
        await this.onLoadRoleListGrid();
        this.panelOpen = true;
        Swal.fire(
          `Exchange Details Created/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#mymodal").hide();
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  async onActionHandler(row,modal) {
    /*console.log('YYYYYYYY',row);
    let ReqObj = {
      "InsuranceId": row.Companyid,
      "Exchangeid": row.Exchangeid,
      "CurrencyCode": row.CurrencyId,
      "CountryCode": row.CountryCode
    } 
    sessionStorage.setItem('CategoryId', JSON.stringify(ReqObj));
    console.log('MMMMMMMM',ReqObj);
    this.router.navigate(['Home/Admin/ExchangeNewMaster'])*/
   this.open(modal);
    let UrlLink = "api/exchangemasterid";
    let ReqObj = {
      "InsuranceId": row.Companyid,
      "Exchangeid": row.Exchangeid,
      "CurrencyCode": row.CurrencyId,
      "CountryCode": row.CountryCode
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.onEditRoleData(data);
    }, (err) => {
      this.handleError(err);
    })
  }
  async onEditRoleData(userData) {
    if (userData) {
      console.log("Edit Value", userData);
      this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate);
      this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
      this.FormGroupData.controls['Exchangeid'].setValue(userData.Exchangeid)
      this.FormGroupData.controls['Exchangerate'].setValue(userData.Exchangerate);
      this.FormGroupData.controls['Status'].setValue(userData.Status);
      this.FormGroupData.controls['Rsacode'].setValue(userData.Rsacode);
      this.FormGroupData.controls['Sno'].setValue(userData.Sno);
      this.onChangeCompanyValue(userData.Companyid);
      await this.onChangeCountryValue(userData.CountryCode);
      await this.onChangeCurrencyValue(userData.CurrencyCode);
      this.panelOpen = false;
    }
  }

  // allowNumericDigitsOnlyOnKeyUp(e) {	
  //   console.log('PPPPPPPPP',e)	
	// 	const charCode = e.keyCode;
	// 	return (charCode == 133 && (charCode < 48))
	// }
  onDateFormatInEdit(date) {
    console.log(date);
    if (date) {
      let format = date.split('-');
      if (format.length > 1) {
        var NewDate = new Date(new Date(format[0], format[1], format[2]));
        NewDate.setMonth(NewDate.getMonth() - 1);
        return NewDate;
      }
      else {
        format = date.split('/');
        if (format.length > 1) {
          var NewDate = new Date(new Date(format[2], format[1], format[0]));
          NewDate.setMonth(NewDate.getMonth() - 1);
          return NewDate;
        }
      }

    }
  }
 
  onLoadRoleListGrid() {
    this.tableData = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode
    }
    let UrlLink = `api/getexchangemaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.roleListGrid = data;
      this.columnHeader = [
        { key: "Currency", display: "CURRENCY NAME" },
        { key: "Country", display: "COUNTRY NAME" },
        { key: "Rsacode", display: "CORE APP CODE" },
        { key: "Exchangerate", display: "EXCHANGE RATe" },
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

  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
      "Exchangeid": ['', [Validators.required]],
      "Currencyid": ['', [Validators.required]],
      "Countryid": ['', [Validators.required]],
      "Exchangerate": ['', [Validators.required]],
      "Rsacode": ['', [Validators.required]],
      "Sno": ['', [Validators.required]],
      "Displayorder": ['', [Validators.required]],
      "InsuranceId": ['', [Validators.required]],
      "Remarks": ['', [Validators.required]],
      "Effectivedate": ['', [Validators.required]],
      "Status": ['Y', [Validators.required]]
    })
  }
  onAddNew(modal) {
    this.open(modal);
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.effectiveValue = "";
    //this.onChangeCompanyValue(this.logindata.InsuranceId);
    //this.panelOpen = false;
    //sessionStorage.removeItem('CategoryId');
    //this.router.navigate(['Home/Admin/ExchangeNewMaster'])
  }
  private _filter(value: string, dropname: string): string[] {
    console.log('kkkkkkkkkkk',value)
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
    if (dropname == 'currency') {
      return this.currencyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'country') {
      console.log('RRRRRRRRRRR',this.filteredCountryList)
      return this.countryList.filter((option) => option?.CodeDesc?.toLocaleLowerCase().includes(filterValue));
    }
  }
  private _filter2(value: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLocaleLowerCase();
    console.log("Value", filterValue, this.countryList);
    return this.countryList.filter((option) => option?.Countryname?.toLocaleLowerCase().includes(filterValue));

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
