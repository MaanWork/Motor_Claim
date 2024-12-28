import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
export interface DataTableElement {
  Amendid: any,
Countrycoreappcode: any,
Countrygroupid: any,
Countryid: any,
Countrymobilecode: any,
Countryname: any,
Countrynamear: null
Countryshortname: null
Effectivedate: "2020-04-30"
Georate: any,
Inscompanyid: any,
Intportcode:any,
Nationalitycoreappcode: any,
Nationalityname: any,
Remarks: any,
Rsacode: any,
Sno: any,
Status: any,
}
@Component({
  selector: 'app-country-master',
  templateUrl: './country-master.component.html',
  styleUrls: ['./country-master.component.css']
})
export class CountryMasterComponent implements OnInit {
  public tableData: DataTableElement[];
  public FormGroupData: FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  countryListGrid: any[] = [];
  CountryForm: FormGroup;
  InsuranceCmpyList: any;
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  InsuCode: any = ""; effectiveValue: any = "";
  minDate: Date;
  columnHeader: any;
  InsCompCode: any;
  logindata: any;
  closeResult: string;
  countryCode: any;
  NationalityList:any[]=[];
  filteredNationalityList: Observable<any[]>;
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
    this.CountryForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]

    });
  }
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.onGetNationaityList(this.logindata.InsuranceId);
    this.filteredInsurance = this.CountryForm.controls['InsuranceId'].valueChanges.pipe(
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
  async onChangeCompanyValue(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsCompCode = insuranceCode;
      this.FormGroupData.controls['Inscompanyid'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
      console.log("Received Country List", this.countryListGrid);
    }
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;

      this.CountryForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
      this.onLoadCountryListGrid();
      console.log("Received Country List", this.countryListGrid);
    }
  }
  onCreateFormControl() {

    this.FormGroupData = this.formBuilder.group({
      "Amendid": [{ value: '0', disabled: false }, [Validators.maxLength(50)]],
      "Countrycoreappcode": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Countrygroupid": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Countryid": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Countrymobilecode": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Countryname": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Countrynamear": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Countryshortname": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Effectivedate": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Georate": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Inscompanyid": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Intportcode": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Nationalitycoreappcode": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Nationalityname": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Remarks": [{ value: '', disabled: false }, [Validators.maxLength(50),Validators.required]],
      "Rsacode": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Sno": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Status": [{ value: 'Y', disabled: false }, [Validators.maxLength(50)]],
    })
  }
  onLoadCountryListGrid() {
    this.tableData = null;
    let ReqObj = {
      "Status": "Y",
      "Inscompanyid": this.InsuCode
    }
    let UrlLink = `api/getcountrymaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.countryListGrid = data;
      this.columnHeader = [
        { key: "Countryname", display: "COUNTRY NAME" },
        { key: "Nationalityname", display: "NATIONALITY NAME" },
        { key: "Countrycoreappcode", display: "CORE APP CODE" },
        { key: "Effectivedate", display: "EFFECTIVE DATE" },

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
      this.tableData = this.countryListGrid;
      console.log(data)
    }, (err) => {
      this.handleError(err);
    })
  }
  async onActionHandler(row,modal) {
    this.open(modal)
    console.log(row);

    let UrlLink = "api/getcountrymasterid";
    let ReqObj = {
      "Amendid": row.Amendid,
      "Inscompanyid": row.Inscompanyid,
      "Countryid": row.Countryid
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.onEditCountryData(data);
      }, (err) => {
        this.handleError(err);
      })
  }

  async onChangeCountryValue(countryCode) {

    console.log('CCCCCCCCCCCCCC',countryCode);
    let Code = this.NationalityList.find((ele: any) => ele.CodeDesc == countryCode);
    if (Code) {
      //this.countryCode = Code.CodeDesc;
      this.FormGroupData.controls['Nationalityname'].setValue(Code.CodeDesc);
      console.log('BBBBBBBBBBBBBBBBBBB', this.FormGroupData.controls['Nationalityname'].value)
      //this.FormGroupData.controls['Currencyid'].setValue("");
      //await this.ongetCurrencyListGrid();
       //this.onChangeCurrencyValue();
    }
    else {
      //this.countryCode = "";
      this.FormGroupData.controls['Nationalityname'].setValue('');
    }
  }

  async onGetNationaityList(Code) {
    let ReqObj = {
      "InsuranceId": Code
    }
    let UrlLink = `api/nationality`;
    let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.NationalityList = res;
        console.log('NNNNNNNNNNNNNNNNNNNN',this.NationalityList);
        this.filteredNationalityList = this.FormGroupData.controls['Nationalityname'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter3(value, 'Nationality')),
        );
        //console.log('MMMMMMMMMMMM',this.filteredCountryList);
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  private _filter3(value: string, dropname: string): string[] {
    console.log('kkkkkkkkkkk',value)
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    if (dropname == 'Nationality') {
      console.log('RRRRRRRRRRR',this.filteredNationalityList)
      return this.NationalityList.filter((option) => option?.CodeDesc?.toLocaleLowerCase().includes(filterValue));
    }
  }
  onEditCountryData(userData){
    if(userData){
      console.log("Edit Country Data",userData);
      this.FormGroupData.controls['Amendid'].setValue(userData.Amendid);
      this.FormGroupData.controls['Countrycoreappcode'].setValue(userData.Countrycoreappcode)
      this.FormGroupData.controls['Countrygroupid'].setValue(userData.Countrygroupid)
      this.FormGroupData.controls['Countryid'].setValue(userData.Countryid)
      this.FormGroupData.controls['Countrymobilecode'].setValue(userData.Countrymobilecode)
      this.FormGroupData.controls['Countryname'].setValue(userData.Countryname)
      this.FormGroupData.controls['Countrynamear'].setValue(userData.Countrynamear)
      this.FormGroupData.controls['Countryshortname'].setValue(userData.Countryshortname)
      this.FormGroupData.controls['Georate'].setValue(userData.Georate)
      this.FormGroupData.controls['Intportcode'].setValue(userData.Intportcode)
      this.FormGroupData.controls['Nationalitycoreappcode'].setValue(userData.Nationalitycoreappcode)
      this.onChangeCountryValue(userData.Nationalityname)
      //this.FormGroupData.controls['Nationalityname'].setValue(userData.Nationalityname)
      this.FormGroupData.controls['Rsacode'].setValue(userData.Rsacode)
      this.FormGroupData.controls['Sno'].setValue(userData.Sno)
      this.FormGroupData.controls['Status'].setValue(userData.Status)
      this.FormGroupData.controls['Remarks'].setValue(userData.Remarks)
      this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate)
      this.onChangeCompanyValue(String(userData.Inscompanyid))
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
  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/changestatuscountrydetails`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId:event.element.Inscompanyid,
      Effectivedate:event.data.EffectiveDate,
      CountryId:event.element.Countryid,
    
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.onLoadCountryListGrid();
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
  onFormSubmit(modal) {

    let UrlLink = `api/insertcountrymaster`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "Amendid": this.FormGroupData.controls['Amendid'].value,
      "Countrycoreappcode": this.FormGroupData.controls['Countrycoreappcode'].value,
      "Countrygroupid": this.FormGroupData.controls['Countrygroupid'].value,
      "Countryid": this.FormGroupData.controls['Countryid'].value,
      "Countrymobilecode": this.FormGroupData.controls['Countrymobilecode'].value,
      "Countryname": this.FormGroupData.controls['Countryname'].value,
      "Countrynamear": this.FormGroupData.controls['Countrynamear'].value,
      "Countryshortname": this.FormGroupData.controls['Countryshortname'].value,
      "Effectivedate": effectiveDate,
      "Georate": this.FormGroupData.controls['Georate'].value,
      "Inscompanyid": Number(this.InsCompCode),
      "Intportcode": this.FormGroupData.controls['Intportcode'].value,
      "Nationalitycoreappcode": this.FormGroupData.controls['Nationalitycoreappcode'].value,
      "Nationalityname": this.FormGroupData.controls['Nationalityname'].value,
      //"Nationalityname":this.countryCode,
      "Remarks": this.FormGroupData.controls['Remarks'].value,
      "Rsacode": this.FormGroupData.controls['Rsacode'].value,
      "Sno": this.FormGroupData.controls['Sno'].value,
      "Status": this.FormGroupData.controls['Status'].value
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        // for (let index = 0; index < data.Errors.length; index++) {
        //   const element:any = data.Errors[index];
        // this.FormGroupData.controls[element.Field].setErrors({message: element.Message });

        // }

      }
      else{
        this.onLoadCountryListGrid();
        this.panelOpen = true;
        Swal.fire(
          `Country Inserted/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("countrymodal").hide();
      }

      console.log(data)
    }, (err) => {
      this.handleError(err);
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
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
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
