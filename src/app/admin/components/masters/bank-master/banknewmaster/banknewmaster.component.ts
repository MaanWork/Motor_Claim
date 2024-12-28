import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
export interface DataTableElement {
  Bankcode: any,
  Bankname: any,
  Entrydate: any,
  Inscompanyid: any,
  Remarks: any,
  Status: any,
}
@Component({
  selector: 'app-banknewmaster',
  templateUrl: './banknewmaster.component.html',
  styleUrls: ['./banknewmaster.component.scss']
})
export class BankNewMasterComponent implements OnInit {
    public FormGroupData:FormGroup;
    public InsertMode: any = 'Insert';
    public panelOpen: boolean = true;
    BankListForm:FormGroup;
    InsuranceCmpyList: any=[];
    filteredInsurance: Observable<any[]>;
    filteredInsuranceComp: Observable<any[]>;
    InsuCode: any;effectiveValue:any="";
    occupationListGrid: any;public tableData: DataTableElement[];
    columnHeader: any;
    InsCompCode: any;
    logindata: any;
    minDate: Date;
    constructor(
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        private errorService: ErrorService,
        private formBuilder: FormBuilder,
        private datePipe:DatePipe,
        private router:Router
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
            "Bankcode": ['',Validators.required],
            "Bankname": ['',Validators.required],
            "Status": ['Y',Validators.required],
            "Remarks": ['',Validators.required],
            "InsuranceId": ['',Validators.required],
            "BankShortCode":['',Validators.required],
        })
      }
      async onChangeCompanyList(insuranceCode) {
        let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
        if (Code) {
          this.InsuCode = insuranceCode;
    
          this.BankListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
          //this.onLoadCityListGrid();
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
        console.log('kkkkkkkkkk',this.panelOpen);
        this.onCreateFormControl();
        this.effectiveValue = "";
        this.onChangeCompanyValue(String(this.logindata.InsuranceId))
        this.panelOpen = false;
      }
      onCloseForm(){
        //this.onCreateFormControl();
        //this.panelOpen = true;
        this.router.navigate(['Home/Admin/BankMaster']);
      }
      onEditOccupationData(userData){
        if(userData){
          console.log("Edit Values",userData);
          this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate);
          this.FormGroupData.controls['Bankcode'].setValue(userData.Bankcode);
          this.FormGroupData.controls['Bankname'].setValue(userData.Bankname);
          this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
          this.FormGroupData.controls['Status'].setValue(userData.Status);
          this.FormGroupData.controls['BankShortCode'].setValue(userData.BankShortCode);
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
        console.log('EEEEEEEE',event.data.EffectiveDate);
        let UrlLink = `api/changestatus`;
        let ReqObj = {
          Status:event.data.Status,
          InscompanyId: this.InsuCode,
          Effectivedate:event.data.EffectiveDate,
          BankShortCode:event.element.BankShortCode,
        };
        return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
          if (data.Errors) {
            this.errorService.showValidateError(data.Errors);
          }
          else{
            //await this.onLoadCityListGrid();
            //this.panelOpen = true;
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
      onSaveCityDetials() {
    
        let UrlLink = `api/insertbankmaster`;
        let effectiveDate:any;
        if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
          effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
        }
        else{
          effectiveDate = "";
        }
        let ReqObj = {
          Bankcode: this.FormGroupData.controls['Bankcode'].value,
          Bankname: this.FormGroupData.controls['Bankname'].value,
          Status: this.FormGroupData.controls['Status'].value,
          InscompanyId: this.InsuCode,
          Remarks: this.FormGroupData.controls['Remarks'].value,
          Effectivedate : effectiveDate,
          BankShortCode:this.FormGroupData.controls['BankShortCode'].value,
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
            //await this.onLoadCityListGrid();
            //this.panelOpen = true;
            Swal.fire(
              `Bank Details Created/Updated Successfully`,
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
    
        let UrlLink = "api/bankmasterid";
        let ReqObj = {
          "InscompanyId": row.InscompanyId,
          "BankShortCode": row.BankShortCode
    
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
    
