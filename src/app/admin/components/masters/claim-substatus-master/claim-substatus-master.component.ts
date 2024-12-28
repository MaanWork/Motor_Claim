import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { parentPort } from 'worker_threads';
export interface DataTableElement {
  Bankcode: any,
  CoStatusDescription: any,
  Entrydate: any,
  InsuranceId: any,
  LossYn: any,
  Parentid: any,
  Status:any, any,
  StatusCount: any,
  Statusdescrip: any,
  Statusid: any,
  SubStatusDescription: any,
  Usertype: any,
}

@Component({
  selector: 'app-claim-substatus-master',
  templateUrl: './claim-substatus-master.component.html',
  styleUrls: ['./claim-substatus-master.component.css']
})
export class ClaimSubstatusMasterComponent implements OnInit {

  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  ClaimListForm:FormGroup;
  InsuranceCmpyList: any=[];
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredBank: Observable<any []>;filteredCity: Observable<any []>;
  filteredUserTypeComp: Observable<any []>;
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
  relatedStatusList: any[]=[];
  columnHeader2: ({ key: string; display: string; config?: undefined; } | { key: string; display: string; config: { isActive: string; values: { Y: string; N: string; }; }; })[];
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private datePipe:DatePipe
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
    this.ClaimListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Usertype: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }


  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
        "Usertype": ['',Validators.required],
        "InsuranceId":['',Validators.required],
        "Statusid":['',Validators.required],
        "Substatus":['',Validators.required],
        "Status":['',Validators.required],
        "SubstatusDesc": ['',Validators.required],
        "ClaimOfficerStatusDesc" : ['',Validators.required],
    })
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      this.ClaimListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.onLoadBankList();
    }
  }
  async onChangeUserTypeList(Usertypedesc) {
    let Code = this.bankList.find((ele: any) => ele.Usertypedesc == Usertypedesc);
    if (Code) {
      this.bankCompCode = Code.Shortdesp;

      this.ClaimListForm.controls['Usertype'].setValue(Code.Usertypedesc);
      this.onLoadCityListGrid();
    }
  }
  onChangeUsertypeValue(Usertypedesc) {
    let Code = this.bankList.find((ele: any) => ele.Usertypedesc == Usertypedesc);
    if (Code) {
      this.bankCode = Code.Shortdesp;
      this.FormGroupData.controls['Usertype'].setValue(Code.Usertypedesc);
    }
  }
  onLoadBankList(){

    let ReqObj ={
      "InsuranceId":this.InsuCode,
      "Status":"Y"
    }
    let UrlLink = `api/getallusertypemaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("UserType Master List",data)
      this.bankList = data;
      this.filteredBank = this.FormGroupData.controls['Usertype'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value,"usertype")),
      );
      this.filteredUserTypeComp = this.ClaimListForm.controls['Usertype'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value,"usertype2")),
      );
      //this.getCityList();
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
      this.filteredCity =  this.FormGroupData.controls['Citycode'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, 'city')),
      );
    }, (err) => {
      this.handleError(err);
    })
  }
  onLoadCityListGrid(){
    this.tableData = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode,
      "Usertype": this.bankCompCode
    }
    let UrlLink = `api/getallclaimsubstatus`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("SubStatus Master List",data)
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
        { key: "ClaimOfficerStatusDesc", display: "STATUS DESCRIPTION" },
        { key: "StatusId", display: "STATUS CODE" },
        { key: "SubstatusDesc", display: "SUB STATUS DESCRIPTION" },
        { key: "Substatus", display: "SUB STATUS CODE" },

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
    let Code = this.cityList.find((ele: any) => ele.Sno == cityCode);
    if (Code) {
      this.CityCode = Code.Sno;
      this.FormGroupData.controls['Citycode'].setValue(Code.City);
    }
  }
  async onFetechInitialData(){
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.ClaimListForm.controls['InsuranceId'].valueChanges.pipe(
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
    this.onChangeUsertypeValue(this.ClaimListForm.controls['Usertype'].value);
    this.panelOpen = false;
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  onEditOccupationData(userData){
    if(userData){
      console.log("Edit Values",userData);
      this.FormGroupData.controls['ClaimOfficerStatusDesc'].setValue(userData.ClaimOfficerStatusDesc);
      this.FormGroupData.controls['SubstatusDesc'].setValue(userData.SubstatusDesc);
      this.FormGroupData.controls['Statusid'].setValue(userData.StatusId);
      this.FormGroupData.controls['Substatus'].setValue(userData.Substatus);
      this.FormGroupData.controls['Status'].setValue(userData.Status);
      this.FormGroupData.controls['InsuranceId'].setValue(userData.InsuranceId);
      this.FormGroupData.controls['Usertype'].setValue(userData.Usertype);
      this.columnHeader2 = [
        { key: "SubStatusDesc", display: "SUB STATUS" },
        { key: "SubStatus", display: "SUB STATUS CODE" },
        { key: "ClaimofficerStatusDesc", display: "PRIMARY STATUS" },
        { key: "StatusId", display: "STATUS CODE" },

        {
          key: "DropDownYn",
          display: "ALLOCATE",
          config: {
            isActive: 'Y',
            values: { Y: "", N: "" }
          }
        },
      ];
      this.relatedStatusList = userData.RelatedStatusList;
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
  onChangeCheckBox(event){
    console.log(event);
    let rowData = event.element;
    if(event.event.checked && rowData != undefined){
        let selectedRowData = this.relatedStatusList.find((ele: any) => ele.StatusId == rowData.StatusId);
        selectedRowData.DropDownYn = 'Y';
    }
    else{
        if(rowData){
          let selectedRowData = this.relatedStatusList.find((ele: any) => ele.StatusId == rowData.StatusId);
          selectedRowData.DropDownYn = 'N';
        }
    }
 }
  onSaveCityDetials() {

    let UrlLink = `api/saveclaimsubstatus`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "InsuranceId": this.FormGroupData.controls['InsuranceId'].value,
      "Statusid": this.FormGroupData.controls['Statusid'].value,
      "Usertype": this.FormGroupData.controls['Usertype'].value,
      "Substatus":this.FormGroupData.controls['Substatus'].value,
      "Status":"Y",
      "RelatedStatusList": this.relatedStatusList
    }
    console.log("Submit Content",ReqObj);
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
          `SubStatus Allocation Updated Successfully`,
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
    //this.spinner.show();
    let UrlLink = "api/getbyidclaimsubstatus";
    let ReqObj = {
      "InsuranceId": row.InsuranceId,
      "Usertype": row.Usertype,
      "Statusid": row.StatusId,
      "Substatus": row.Substatus
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("Final Edit Res",data);
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
    if (dropname == 'usertype') {
      return this.bankList.filter((option) => option?.Usertypedesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'usertype2') {
      console.log("Filter",this.bankList,this.bankList.filter((option) => option?.Usertypedesc?.toLowerCase().includes(filterValue)))
      return this.bankList.filter((option) => option?.Usertypedesc?.toLowerCase().includes(filterValue));
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
