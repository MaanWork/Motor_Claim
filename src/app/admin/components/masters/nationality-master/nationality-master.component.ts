import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DatePipe } from '@angular/common';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
  selector: 'app-nationality-master',
  templateUrl: './nationality-master.component.html',
  styleUrls: ['./nationality-master.component.css']
})
export class NationalityMasterComponent implements OnInit {

  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  NationalityForm: FormGroup;
  InsuranceCmpyList: any;
  filteredInsurance: Observable<any[]>;
  filteredNationalityList: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  InsuCode: any;
  nationalityListGrid: any;
  columnHeader: any;
  public tableData: DataTableElement[];
  InsCompCode: any;
  logindata: any;
  effectiveValue:any="";
  minDate: Date;
  closeResult: string;
  NationalityList:any[]=[];
  countryCode: any;
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private datePipe:DatePipe,
    private modalService: NgbModal,
  ) {
    this.minDate = new Date();
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    let reload = sessionStorage.getItem('garageLoginReload');
    if(reload){
      sessionStorage.removeItem('garageLoginReload');
      window.location.reload();
    }

   }

  ngOnInit(): void {
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.NationalityForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]

    });
  }
  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
      "Nationalityid": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Sno": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Nationalitydesc":[{ value: '', disabled: false }, [Validators.required,Validators.maxLength(50)]],
      "Amendid": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Coreappcode":[{ value: '', disabled: false }, [Validators.required,Validators.maxLength(50)]],
      "Entrydate": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "Status": [{ value: 'Y', disabled: false }, [Validators.maxLength(50)]],
      "Remarks": [{ value: '', disabled: false }, [Validators.required,Validators.maxLength(50)]],
      "Inscompanyid": [{ value: '', disabled: false }, [Validators.maxLength(50)]],

    })
  }
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    //this.onGetNationaityList(this.logindata.InsuranceId);
    this.filteredInsurance = this.NationalityForm.controls['InsuranceId'].valueChanges.pipe(
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
    }
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;

      this.NationalityForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
      this.onLoadNationalityListGrid();
      console.log("Received Country List", this.nationalityListGrid);
    }
  }
  onLoadNationalityListGrid(){
    this.tableData = null;
    let ReqObj = {
      "Status": "Y",
      "Inscompanyid": this.InsuCode
    }
    let UrlLink = `api/getnationalitymaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.nationalityListGrid = data;
      this.columnHeader = [
        { key: "Nationalitydesc", display: "NATIONALITY NAME" },
        { key: "Coreappcode", display: "CORE APP CODE" },
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
        },
      ];
      this.tableData = this.nationalityListGrid;
      console.log(data)
    }, (err) => {
      this.handleError(err);
    })
  }
  /*async onChangeCountryValue(countryCode) {

    console.log('CCCCCCCCCCCCCC',countryCode);
    let Code = this.NationalityList.find((ele: any) => ele.NationalityId == countryCode);
    if (Code) {
      this.countryCode = Code.Nationalityname;
      this.FormGroupData.controls['Nationalitydesc'].setValue(Code.Nationalityname);
      //this.FormGroupData.controls['Currencyid'].setValue("");
      //await this.ongetCurrencyListGrid();
       //this.onChangeCurrencyValue();
    }
    else {
      this.countryCode = "";
      this.FormGroupData.controls['Nationalitydesc'].setValue('');
    }
  }*/

  /*async onGetNationaityList(Code) {
    let ReqObj = {
      "Inscompanyid": Code
    }
    let UrlLink = `api/nationality`;
    let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.NationalityList = res;
        console.log('NNNNNNNNNNNNNNNNNNNN',this.NationalityList);
        this.filteredNationalityList = this.FormGroupData.controls['Nationalitydesc'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter3(value, 'Nationality')),
        );
        //console.log('MMMMMMMMMMMM',this.filteredCountryList);
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }*/

  /*private _filter3(value: string, dropname: string): string[] {
    console.log('kkkkkkkkkkk',value)
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    if (dropname == 'Nationality') {
      console.log('RRRRRRRRRRR',this.filteredNationalityList)
      return this.NationalityList.filter((option) => option?.Nationalityname?.toLocaleLowerCase().includes(filterValue));
    }
  }*/
  async onActionHandler(row,modal) {
    console.log(row);
     this.open(modal)
    let UrlLink = "api/nationalitymasterid";
    let ReqObj = {
      "Nationalityid": row.Nationalityid,
      "Inscompanyid": row.Inscompanyid
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
        this.FormGroupData.controls['Nationalityid'].setValue(userData.Nationalityid);
        this.FormGroupData.controls['Nationalitydesc'].setValue(userData.Nationalitydesc);
        this.FormGroupData.controls['Coreappcode'].setValue(userData.Coreappcode);
        this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
        this.FormGroupData.controls['Status'].setValue(userData.Status);
        this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate);
        this.onChangeCompanyValue(String(userData.Inscompanyid));
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
  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/changestatusnationalitydetails`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: event.element.Inscompanyid,
      Effectivedate:event.data.EffectiveDate,
      NationalityId:event.element.Nationalityid,


    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.onFetechInitialData(); 
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
    let effectiveDate:any;let insuranceId
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    // if(this.InsCompCode!=null){
    //   insuranceId=this.InsCompCode;
    // }
    // else if(this.InsuCode!=null){
    //   insuranceId=this.InsuCode;
    // }
    if(this.FormGroupData.controls['Inscompanyid'].value!=null && this.FormGroupData.controls['Inscompanyid'].value!=""){
   insuranceId=this.InsCompCode;
    }
    else{
      insuranceId=null;
    }
    let UrlLink = "api/insertnationalitymaster";
      let ReqObj = {
        "Nationalityid": this.FormGroupData.controls['Nationalityid'].value,
        "Sno": this.FormGroupData.controls['Sno'].value,
        "Nationalitydesc":this.FormGroupData.controls['Nationalitydesc'].value,
        "Coreappcode":this.FormGroupData.controls['Coreappcode'].value,
        "Entrydate":this.FormGroupData.controls['Entrydate'].value,
        "Status":this.FormGroupData.controls['Status'].value,
        "Remarks":this.FormGroupData.controls['Remarks'].value,
        //"Inscompanyid": this.InsCompCode,
        "Inscompanyid":insuranceId,
        "Effectivedate":effectiveDate
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
          this.onLoadNationalityListGrid();
          this.panelOpen = true;
          Swal.fire(
            `Nationality Details Inserted/Updated Successfully`,
            'success',
            'success'
          );
          modal.dismiss('Cross click');
          $("#namodal").hide();
        }

        console.log(data)
      }, (err) => {
        this.handleError(err);
      })
  }
  onAddNew(modal) {
      this.open(modal);
      this.onCreateFormControl();
      this.effectiveValue = "";
      //this.panelOpen = false;
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
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
