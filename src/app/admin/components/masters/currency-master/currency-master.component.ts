import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
export interface DataTableElement {
  Amendid: any,
  Countryid: any,
  Currencyid: any,
  Currencyname: any,
  Displayorder: any,
  Effectivedate: any,
  Entrydate: any,
  Exmaxlmt: any,
  Exminlmt: any,
  Expirydate: any,
  Inceptiondate: any,
  Inscompanyid: any,
  Remarks: any,
  Rfactor: any,
  Rsacode: any,
  Shortname: any,
  Sno: any,
  Status: any,
  Subcurrency: any,
}
@Component({
  selector: 'app-currency-master',
  templateUrl: './currency-master.component.html',
  styleUrls: ['./currency-master.component.css']
})
export class CurrencyMasterComponent implements OnInit {
  public tableData: DataTableElement[];
  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  CurrencyForm: FormGroup;
  InsuranceCmpyList: any=[];
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredCountryList: Observable<any[]>;
  InsuCode: any = "";
  currencyListGrid: any;
  columnHeader:any;
  InsCompCode: any;
  countryList: any;
  countryCode: any;effectiveValue:any="";
  minDate: Date;
  logindata: any;
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
    this.CurrencyForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]

    });

  }
  async onFetechInitialData(){
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.CurrencyForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );


    this.filteredInsuranceComp = this.FormGroupData.controls['Inscompanyid'].valueChanges.pipe(
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
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      this.CurrencyForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
      this.onLoadCurrencyListGrid();
      await this.onGetCountryList(this.InsuCode);
      console.log("Received Country List", this.currencyListGrid);
    }
  }
  onLoadCurrencyListGrid(){
    this.tableData = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode
    }
    let UrlLink = `api/getcurrencymaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.currencyListGrid = data;
      this.columnHeader = [
        { key: "Currencyname", display: "CURRENCY NAME" },
        { key: "Subcurrency", display: "SUBCURRENCY NAME" },
        { key: "Effectivedate", display: "EFFECTIVE DATE" },
        { key: "Expirydate", display: "EXPIRY DATE" },

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
      this.tableData = this.currencyListGrid;
      //console.log('FFFFFFFFFFFFFFF',this.tableData[0].Status)
      console.log(data)
    }, (err) => {
      this.handleError(err);
    })
  }
  async onActionHandler(row,modal) {
    console.log(row);
     this.open(modal)
    let UrlLink = "api/getcurrencymasterid";
    let ReqObj = {
      "Amendid": row.Amendid,
      "InsuranceId": row.InsuranceId,
      "Currencyid": row.Currencyid,
      "Countryid": row.Countryid
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.onEditCurrencyData(data);
      }, (err) => {
        this.handleError(err);
      })
  }
  onEditCurrencyData(userData){
      console.log("Edit Currency Value",userData);
      if(userData){
        this.FormGroupData.controls['Amendid'].setValue(userData.Amendid);
        this.countryCode = userData.CountryCode;
        this.onChangeCompanyValue(userData.InsuranceId);
        this.onGetCountryList(userData.InsuranceId);
        //this.FormGroupData.controls['Countryid'].setValue(userData.Countryid);
        this.FormGroupData.controls['Currencyid'].setValue(userData.Currencyid);
        this.FormGroupData.controls['Currencyname'].setValue(userData.Currencyname);
        this.FormGroupData.controls['Exmaxlmt'].setValue(userData.Exmaxlmt);
        this.FormGroupData.controls['Exminlmt'].setValue(userData.Exminlmt);
        this.FormGroupData.controls['Inceptiondate'].setValue(userData.Inceptiondate);
        this.onChangeCountryValue(userData.CountryCode);
        //this.FormGroupData.controls['Inscompanyid'].setValue(userData.Inscompanyid);
        this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
        this.FormGroupData.controls['Rfactor'].setValue(userData.Rfactor);
        this.FormGroupData.controls['Rsacode'].setValue(userData.Rsacode);
        this.FormGroupData.controls['Shortname'].setValue(userData.Shortname);
        this.FormGroupData.controls['Sno'].setValue(userData.Sno);
        this.FormGroupData.controls['Status'].setValue(userData.Status);
        this.FormGroupData.controls['Subcurrency'].setValue(userData.Subcurrency);
        this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate)
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
  async onChangeCompanyValue(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsCompCode = insuranceCode;
      this.FormGroupData.controls['Inscompanyid'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)


    }
  }

  async onGetCountryList(Code) {
    let ReqObj = {
      "Inscompanyid": Code
    }
    let UrlLink = `api/newcountrydropdown`;
    let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.countryList = res;
        console.log("Country List",this.countryList);
        this.filteredCountryList = this.FormGroupData.controls['Countryid'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter2(value)),
        );
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }




  async onChangeCountryValue(countryCode) {
    let Code = this.countryList.find((ele: any) => ele.Code == countryCode);
    if (Code) {
      this.countryCode = countryCode;
      this.FormGroupData.controls['Countryid'].setValue(Code.CodeDesc);
    }
    else{
      this.countryCode = "";
      this.FormGroupData.controls['Countryid'].setValue('');
    }
  }
  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
      "Amendid":[{ value: '0', disabled: false }, [Validators.maxLength(50)]],
      "Countryid": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Currencyid": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Currencyname": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Displayorder": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Effectivedate": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Entrydate": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Exmaxlmt": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Exminlmt": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Expirydate": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Inceptiondate": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Inscompanyid": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Remarks": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Rfactor": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Rsacode": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Shortname": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Sno": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Status": [{ value: 'Y', disabled: false }, [Validators.maxLength(50)]],
      "Subcurrency": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]]
    })
  }

  onAddNew(modal) {
    this.open(modal);
    this.effectiveValue="";
      this.onCreateFormControl();
      this.onFetechInitialData();
      this.onChangeCompanyValue(this.logindata.InsuranceId);
      //this.panelOpen = false;
  }
  /*onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }*/

  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/changestatuscurrencydetails`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId:event.element.InsuranceId,
      Effectivedate:event.data.EffectiveDate,
    CurrencyId:event.element.Currencyid,
      CountryId:event.element.Countryid
    
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.onLoadCurrencyListGrid();
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
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let UrlLink = "api/insertcurrencymaster";
      let ReqObj = {
        "Currencyid": this.FormGroupData.controls['Currencyid'].value,
        "Amendid": this.FormGroupData.controls['Amendid'].value,
        "Countryid":"",
        "CountryCode":this.countryCode,
        "InsuranceId": this.InsCompCode,
        "Currencyname": this.FormGroupData.controls['Currencyname'].value,
        "Inceptiondate": this.FormGroupData.controls['Inceptiondate'].value,
        "Expirydate": this.FormGroupData.controls['Expirydate'].value,
        "Effectivedate": effectiveDate,
        "Entrydate": this.FormGroupData.controls['Entrydate'].value,
        "Remarks": this.FormGroupData.controls['Remarks'].value,
        "Status": this.FormGroupData.controls['Status'].value,
        "Rsacode":this.FormGroupData.controls['Rsacode'].value,
        "Sno": this.FormGroupData.controls['Sno'].value,
        "Displayorder": this.FormGroupData.controls['Displayorder'].value,
        "Shortname": this.FormGroupData.controls['Shortname'].value,
        "Rfactor": this.FormGroupData.controls['Rfactor'].value,
        "Subcurrency": this.FormGroupData.controls['Subcurrency'].value,
        //"Exminlmt": this.FormGroupData.controls['Exminlmt'].value,
        //"Exmaxlmt": this.FormGroupData.controls['Exmaxlmt'].value
      }
      return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

        if (data.Errors) {
          this.errorService.showValidateError(data.Errors);

        }
        else{
          this.onLoadCurrencyListGrid();
          this.panelOpen = true;
          Swal.fire(
            `Currency Details Inserted/Updated Successfully`,
            'success',
            'success'
          );
          modal.dismiss('Cross click');
          $("#currencymodal").hide();
        }

        console.log(data)
      }, (err) => {
        this.handleError(err);
      })
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
  private _filter2(value: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLocaleLowerCase();
    return this.countryList.filter((option) => option?.CodeDesc?.toLocaleLowerCase().includes(filterValue));

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
