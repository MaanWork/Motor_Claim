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
  selector: 'app-exchangemaster',
  templateUrl: './exchangemaster.component.html',
  styleUrls: ['./exchangemaster.component.scss']
})
export class ExchangeComponent implements OnInit {

    public FormGroupData: FormGroup;
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
    CounrysList:any[]=[];
    CurrencysList:any[]=[];
    currencyList: any;
    countryCode: any;
    currencyCode: string;
    InsuranceId: any;
    Exchangei: any;
    Exchangeid: any;
    CurrencyCode: any;
    CountryCode: any;
    constructor(
      private adminService: AdminService,
      private spinner: NgxSpinnerService,
      private errorService: ErrorService,
      private formBuilder: FormBuilder,
      private datePipe: DatePipe,
      private router:Router
    ) {
      this.minDate = new Date();
      let reload = sessionStorage.getItem('garageLoginReload');
      if(reload){
        sessionStorage.removeItem('garageLoginReload');
        window.location.reload();
      }  
 
    }
  
    ngOnInit() {
      this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
      this.onCreateFormControl();
      this.onFetechInitialData();
      this.SmsListForm = this.formBuilder.group({
        InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
      });
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
        "Status": "Y",
        "Inscompanyid": Code
      }
      let UrlLink = `api/getcountrymaster`;
      let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
        .then(res => {
          this.countryList = res;
          this.filteredCountryList = this.FormGroupData.controls['Countryid'].valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value, 'country')),
          );
          let session= JSON.parse(sessionStorage.getItem('CategoryId'));
          this.InsuranceId=session?.InsuranceId,
          this.Exchangeid=session?.Exchangeid,
          this.CurrencyCode=session?.CurrencyCode,
          this.CountryCode=session?.CountryCode
          if(this.Exchangeid!=null){
            this.onActionHandler();
            console.log('GGGGGGGGGGGGGGGGGGGGG',this.CurrencyCode)
          }
        
  
        })
        .catch((err) => {
          this.handleError(err)
        });
      return response;
    }
    async ongetCurrencyListGrid() {
      let ReqObj = {
        "Status": "Y",
        "InsuranceId": this.InsuCode,
        "CountryCode": this.countryCode
      }
      let UrlLink = `api/currencyBycountry`;
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
      console.log('MMMMMMMMMMM',this.countryList);
      let Code = this.countryList.find((ele: any) => ele.Countryshortname == countryCode);
      if (Code) {
        this.countryCode = Code.Countryshortname;
        this.FormGroupData.controls['Countryid'].setValue(Code.Countryname);
        await this.ongetCurrencyListGrid();
      }
      else {
        this.countryCode = "";
        this.FormGroupData.controls['Countryid'].setValue('');
      }
    }
    async onChangeCurrencyValue(value) {
      console.log('JJJJJJJJJJJJJJJJJJJ',this.currencyList)
      let Code = this.currencyList.find((ele: any) => ele.CodeDesc == value);
      if (Code) {
        this.currencyCode = Code.CodeDesc;
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
  
        this.SmsListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
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
    onCloseForm() {
      //this.onCreateFormControl();
      //this.panelOpen = true;
      this.router.navigate(['Home/Admin/ExchangeMaster'])
    }
 
    onSaveExchangeDetials() {
  
      let insuranceId;

      if(this.InsCompCode!=null){
        insuranceId=this.InsCompCode;
      }
      else if(this.InsuCode!=null){
        insuranceId=this.InsuCode;
      }
      let UrlLink = `api/insertexchangemaster`;
      let effectiveDate: any;
      if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
        effectiveDate = this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
      }
      else {
        effectiveDate = "";
      }
      let ReqObj = {
        "Exchangeid" :this.FormGroupData.controls['Exchangeid'].value,
        "CurrencyCode": this.currencyCode,
        "CountryCode": this.countryCode,
        "Exchangerate": this.FormGroupData.controls['Exchangerate'].value,
        "Rsacode": this.FormGroupData.controls['Rsacode'].value,
        "Sno": this.FormGroupData.controls['Sno'].value,
        "InsuranceId": insuranceId,
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
          this.router.navigate(['Home/Admin/ExchangeMaster'])
        }
  
      }, (err) => {
        this.handleError(err);
      })
    }
    async onActionHandler() {
      let UrlLink = "api/exchangemasterid";
      let ReqObj = {
        "InsuranceId": this.InsuranceId,
        "Exchangeid": this.Exchangeid,
        "CurrencyCode":this.CurrencyCode,
        "CountryCode":this.CountryCode
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
        await this.onChangeCountryValue(userData.CountryCode);
        await this.onChangeCurrencyValue(userData.CurrencyId);
        this.onChangeCompanyValue(userData.Companyid);
      }
    }
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
    onAddNew() {
      this.onCreateFormControl();
      this.effectiveValue = "";
      this.onChangeCompanyValue(this.logindata.InsuranceId);
      this.panelOpen = false;
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
        return this.countryList.filter((option) => option?.Countryname?.toLocaleLowerCase().includes(filterValue));
      }
    }
    /*private _filter2(value: string): string[] {
      if (value == null) {
        value = '';
      }
      const filterValue = value.toLocaleLowerCase();
      console.log("Value", filterValue, this.countryList);
      return this.countryList.filter((option) => option?.Countryname?.toLocaleLowerCase().includes(filterValue));
  
    }*/
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
  
