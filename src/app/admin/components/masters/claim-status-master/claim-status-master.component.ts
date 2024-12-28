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
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
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
  selector: 'app-claim-status-master',
  templateUrl: './claim-status-master.component.html',
  styleUrls: ['./claim-status-master.component.css']
})
export class ClaimStatusMasterComponent implements OnInit {


  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  BankListForm:FormGroup;
  InsuranceCmpyList: any=[];
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredUserType: Observable<any[]>;
  filteredPositionType: Observable<any[]>;
  InsuCode: any;effectiveValue:any="";
  occupationListGrid: any;public tableData: DataTableElement[];
  columnHeader: any;
  InsCompCode: any;
  logindata: any;
  userTypeList: any;
  positionLists:any;
  userTypeCode: string;
  minDate: Date;
  closeResult: string;
  position:any;
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
    this.BankListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }


  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
        "CoStatusDescription": ['',Validators.required],
        "InsuranceId": ['',Validators.required],
        "LossYn": ['Y',Validators.required],
        "Parentid": ['',Validators.required],
        "RegionCode": ['',Validators.required],
        "Status": ['Y',Validators.required],
        "StatusCount": ['',Validators.required],
        "Statusdescrip": ['',Validators.required],
        "Statusid": ['',Validators.required],
        "SubStatus": ['',Validators.required],
        "SubStatusDescription": ['',Validators.required],
        "Usertype":['',Validators.required],
        "Position":['',Validators.required]
    })
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;

      this.BankListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.onLoadCityListGrid();
    }
  }
  onLoadCityListGrid(){
    this.tableData = null;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode
    }
    let UrlLink = `api/getallclaimstatusdetails`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("Bank Master List",data)
      this.occupationListGrid = data;
      this.columnHeader = [
        { key: "Statusdescrip", display: "STATUS NAME" },
        { key: "SubStatusDescription", display: "SUBSTATUS NAME" },
        { key: "Usertype", display: "USERTYPE" },
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
      this.tableData = this.occupationListGrid;
      this.getUsertypeList();
      this.positionList();
      console.log(data)
    }, (err) => {
      this.handleError(err);
    })
  }
  /*getUsertypeList(){

    let UrlLink = "api/getallusertypemaster";
    let ReqObj = {
      "InsuranceId":this.InsuCode,
      "Status":"Y"
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.userTypeList = data;
      this.userTypeCode = "";
      this.FormGroupData.controls['Usertype'].setValue('');
      this.filteredUserType = this.FormGroupData.controls['Usertype'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value,"usertype")),
      );
      }, (err) => {
        this.handleError(err);
      })
  }*/

  async getUsertypeList() {
    let UrlLink = `api/usertype`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {
        this.userTypeList = res;
        console.log('UUUUUUUUUUUUUUUUUUUU',this.userTypeList)
      this.userTypeCode = "";
      this.FormGroupData.controls['Usertype'].setValue('');
      this.filteredUserType = this.FormGroupData.controls['Usertype'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value,"usertype")),
      );
        //return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    //return response;
  }

  async positionList() {
    let UrlLink = `api/usertype`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {
        this.positionLists = res;
        console.log('UUUUUUUUUUUUUUUUUUUU',this.userTypeList)
      //this.userTypeCode = "";
      this.FormGroupData.controls['Position'].setValue('');
      this.filteredPositionType = this.FormGroupData.controls['Position'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value,"position")),
      );
        //return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    //return response;
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

  onAddNew(modal) {
    this.open(modal);
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.effectiveValue="";
    /*this.InsertMode = 'Insert';
    if(this.InsertMode == 'Insert'){
      this.onCreateFormControl();
    }*/
    this.onChangeCompanyValue(String(this.logindata.InsuranceId))
    //this.panelOpen = false;
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
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  onEditOccupationData(userData){
    if(userData){
      console.log("Edit Values",userData);
      this.FormGroupData.controls['CoStatusDescription'].setValue(userData.CoStatusDescription);
      this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate);
      this.onChangeCompanyValue(userData.InsuranceId);
      this.FormGroupData.controls['LossYn'].setValue(userData.LossYn);
      this.FormGroupData.controls['Parentid'].setValue(userData.Parentid);
      this.FormGroupData.controls['Status'].setValue(userData.Status);
      this.FormGroupData.controls['StatusCount'].setValue(userData.SubStatus);
      this.FormGroupData.controls['Statusdescrip'].setValue(userData.Statusdescrip);
      this.FormGroupData.controls['Statusid'].setValue(userData.Statusid);
      this.FormGroupData.controls['SubStatus'].setValue(userData.SubStatus);
      this.FormGroupData.controls['SubStatusDescription'].setValue(userData.SubStatusDescription);
      this.FormGroupData.controls['Usertype'].setValue(userData.Usertype);
      this.FormGroupData.controls['Position'].setValue(userData.Position);
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
    let UrlLink = `api/changestatusclaimstatus`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: this.InsuCode,
      EffectiveDate:event.data.EffectiveDate,
      Statusid:event.element.Statusid,
       Usertype:event.element.Usertype,
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.onLoadCityListGrid();
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
  onSaveClaimStatusDetials(modal) {

    let UrlLink = `api/insertdeclaimstatusdetails`;
    let parentId = this.FormGroupData.controls['Parentid'].value;
    if(parentId == "" || parentId == null || parentId == undefined){
      this.FormGroupData.controls['Parentid'].setValue('9999');
    }
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
        "CoStatusDescription": this.FormGroupData.controls['CoStatusDescription'].value,
        "InsuranceId": this.InsuCode,
        "LossYn": this.FormGroupData.controls['LossYn'].value,
        "Parentid": this.FormGroupData.controls['Parentid'].value,
        "Status": this.FormGroupData.controls['Status'].value,
        "StatusCount": this.FormGroupData.controls['StatusCount'].value,
        "Statusdescrip": this.FormGroupData.controls['Statusdescrip'].value,
        "Statusid": this.FormGroupData.controls['Statusid'].value,
        "SubStatus": this.FormGroupData.controls['StatusCount'].value,
        "SubStatusDescription": this.FormGroupData.controls['SubStatusDescription'].value,
        "Usertype":this.FormGroupData.controls['Usertype'].value,
        "Position":this.FormGroupData.controls['Position'].value,
        "Effectivedate": effectiveDate
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
          `Claim Status Created/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#claimmodal").hide();
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  async onActionHandler(row,modal) {
    console.log(row);
    this.open(modal);
    let UrlLink = "api/getclaimstatusdetails";
    let ReqObj = {
          "Parentid":row.Parentid,
          "InsuranceId": row.InsuranceId,
          "Statusid":row.Statusid,
          "SubStatus": row.SubStatus,
          "Usertype": row.Usertype
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
    if (dropname == 'usertype') {
      console.log("UserType List",this.userTypeList);
      return this.userTypeList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'position') {
      console.log("PositionList ",this.positionLists);
      return this.positionLists.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
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
