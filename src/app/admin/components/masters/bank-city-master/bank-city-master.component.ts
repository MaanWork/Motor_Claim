import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DatePipe } from '@angular/common';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
export interface DataTableElement {
  Bankcode: any,
  Citycode: any,
  Cityname: any,
  Entrydate: any,
  InscompanyId: any,
  Remarks: any,
  Status: any,
}
@Component({
  selector: 'app-bank-city-master',
  templateUrl: './bank-city-master.component.html',
  styleUrls: ['./bank-city-master.component.css']
})
export class BankCityMasterComponent implements OnInit {

  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  BankListForm:FormGroup;
  InsuranceCmpyList: any=[];
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredBank: Observable<any []>;filteredCity: Observable<any []>;
  filteredBankComp: Observable<any []>;
  InsuCode: any;effectiveValue:any="";
  occupationListGrid: any;public tableData: DataTableElement[];
  columnHeader: any;
  InsCompCode: any;
  logindata: any;
  bankList: any=[];
  bankCode: any;
  bankCompCode: any;
  minDate: Date;
  cityList: any[]=[];
  CityCode: any;
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private datePipe:DatePipe
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.BankListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Bankcode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }


  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
        "Bankcode": ['',Validators.required],
        "Citycode": ['',Validators.required],
        "Cityname": ['',Validators.required],
        "Status": ['Y',Validators.required],
        "Entrydate": ['',Validators.required],
        "Remarks": ['',Validators.required],
        "InsuranceId": ['',Validators.required],
    })
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      this.BankListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.onLoadBankList();
    }
  }
  async onChangeBankList(bankCode) {
    let Code = this.bankList.find((ele: any) => ele.Bankcode == bankCode);
    if (Code) {
      this.bankCompCode = bankCode;
      this.BankListForm.controls['Bankcode'].setValue(Code.Bankname);
      this.onLoadCityListGrid();
    }
  }
  onChangeBankValue(bankCode) {
    let Code = this.bankList.find((ele: any) => ele.Bankcode == bankCode);
    if (Code) {
      this.bankCode = bankCode;
      this.FormGroupData.controls['Bankcode'].setValue(Code.Bankname);
    }
  }
  onLoadBankList(){

    let ReqObj = {
      "Status": "Y",
      "InscompanyId": this.InsuCode
    }
    let UrlLink = `api/getbankmaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("Bank Master List",data)
      this.bankList = data;
      this.filteredBank = this.FormGroupData.controls['Bankcode'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value,"bank")),
      );
      this.filteredBankComp = this.BankListForm.controls['Bankcode'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value,"bank2")),
      );
      this.getCityList();
      console.log(data)
    }, (err) => {
      this.handleError(err);
    })
  }
  getCityList(){
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.logindata.InsuranceId
    }
    let UrlLink = `api/getallcitymasterdetails`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.cityList = data;
      this.filteredCity =  this.FormGroupData.controls['Cityname'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, 'city')),
      );
    }, (err) => {
      this.handleError(err);
    })
  }
  onLoadCityListGrid(){

    let ReqObj = {
      "Status": "Y",
      "InscompanyId": this.InsuCode,
      "Bankcode": this.bankCompCode
    }
    let UrlLink = `api/getBankCityMaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("Bank Master City List",data)
      this.occupationListGrid = data;
      this.columnHeader = [
        {
          key: "Status",
          display: "STATUS",
          config: {
            isBoolean: 'Y',
            values: { Y: "Active", N: "Inactive", R: "Referral" }
          }
        },
        { key: "Cityname", display: "CITY NAME" },
        { key: "Remarks", display: "REMARKS" },

        {
          key: "action",
          display: "ACTION",
          config: {
            isAction: true,
            actions: ["EDIT"]
          }
        }
      ];
      this.tableData = this.occupationListGrid;
      console.log(data)
    }, (err) => {
      this.handleError(err);
    })
  }
  async onChangeCityValue(cityCode) {
    let Code = this.cityList.find((ele: any) => ele.City == cityCode);
    if (Code) {
      this.CityCode = Code.Sno;
      this.FormGroupData.controls['Cityname'].setValue(Code.City);
    }
  }
  async onFetechInitialData(){
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.BankListForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance")),
    );
    this.filteredInsuranceComp = this.FormGroupData.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance2")),
    );
  }
  onAddNew() {
    this.InsertMode = 'Insert';
    if(this.InsertMode == 'Insert'){
      this.onCreateFormControl();
    }
    this.onChangeCompanyValue(String(this.logindata.InsuranceId))
    this.onChangeBankValue(this.bankCompCode);
    this.panelOpen = false;
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  onEditOccupationData(userData){
    if(userData){
      console.log("Edit Values",userData);
      this.onChangeBankValue(userData.Bankcode);
      this.FormGroupData.controls['Citycode'].setValue(userData.Citycode);
      this.onChangeCityValue(userData.Cityname)
      //this.FormGroupData.controls['Cityname'].setValue();
      this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate)
      this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
      this.FormGroupData.controls['Status'].setValue(userData.Status);
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
  onSaveCityDetials() {

    let UrlLink = `api/insertbankcitymaster`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "Bankcode": this.bankCode,
        "Citycode":this.CityCode,
        "Cityname":this.FormGroupData.controls['Cityname'].value,
        "Status":this.FormGroupData.controls['Status'].value,
        "Remarks": this.FormGroupData.controls['Remarks'].value,
        "InscompanyId": this.InsuCode,
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
        await this.onLoadCityListGrid();
        this.panelOpen = true;
        Swal.fire(
          `Bank City Details Created/Updated Successfully`,
          'success',
          'success'
        );
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  async onActionHandler(row) {
    console.log(row);

    let UrlLink = "api/bankcitymasterid";
    let ReqObj = {
      "InscompanyId": row.InscompanyId,
      "Bankcode": row.Bankcode,
      "Citycode": row.Citycode,
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
    if (dropname == 'bank') {
      return this.bankList.filter((option) => option?.Bankname?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'bank2') {
      console.log("Filter",this.bankList,this.bankList.filter((option) => option?.Bankname?.toLowerCase().includes(filterValue)))
      return this.bankList.filter((option) => option?.Bankname?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'city') {
      return this.cityList.filter((option) => option?.City?.includes(filterValue));
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


}
