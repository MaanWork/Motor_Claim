import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/admin/admin.service';
import { Observable } from 'rxjs';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;

export interface DataTableElement {
  Effectivedate: any,
  Entrydate: any,
  Remarks: any,
  Shortdesp: any,
  Status: any,
  Usertypedesc: any,
  Usertypeid: any,
}
@Component({
  selector: 'app-usertype-master',
  templateUrl: './usertype-master.component.html',
  styleUrls: ['./usertype-master.component.css']
})
export class UsertypeMasterComponent implements OnInit {

  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  OccupationListForm:FormGroup;
  InsuranceCmpyList: any=[];
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  InsuCode: any;effectiveValue:any="";
  occupationListGrid: any;public tableData: DataTableElement[];
  columnHeader: any;
  InsCompCode: any;
  logindata: any;minDate:Date;
  closeResult: string;
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private datePipe:DatePipe,
    private modalService: NgbModal
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.OccupationListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }


  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
        "Usertypeid":['',Validators.required],
        "Shortdesp":['',Validators.required],
        "InsuranceId":['',Validators.required],
        "Usertypedesc":['',Validators.required],
        "Effectivedate":['',Validators.required],
        "Status":['Y',Validators.required],
        "Remarks":['',Validators.required],
    })
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;

      this.OccupationListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.onLoadOccupationListGrid();
    }
  }
  onLoadOccupationListGrid(){
    this.tableData = null;
    let ReqObj = {
      "InsuranceId":this.InsuCode,
      "Status":"Y"
  }
    let UrlLink = `api/getallusertypemaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.occupationListGrid = data;
      this.columnHeader = [
        
        { key: "Usertypedesc", display: "USERTYPE NAME" },
        { key: "Shortdesp", display: "SHORT DESCRIPTION" },
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
      console.log(data)
    }, (err) => {
      this.handleError(err);
    })
  }
  async onFetechInitialData(){
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.OccupationListForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance")),
    );


    this.filteredInsuranceComp = this.FormGroupData.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance2")),
    );
  }
  onAddNew(modal) {
    this.InsertMode = 'Insert';
    this.open(modal);
    this.onCreateFormControl();
    /*if(this.InsertMode == 'Insert'){
      this.onCreateFormControl();
    }*/
    this.effectiveValue = "";
    this.onChangeCompanyValue(String(this.logindata.InsuranceId))
    this.panelOpen = false;
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  onEditOccupationData(userData){
    if(userData){
      console.log("Edit Values",userData);
      this.FormGroupData.controls['Usertypeid'].setValue(userData.Usertypeid);
      this.FormGroupData.controls['Usertypedesc'].setValue(userData.Usertypedesc);
      this.FormGroupData.controls['Shortdesp'].setValue(userData.Shortdesp);
      this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
      this.FormGroupData.controls['Status'].setValue(userData.Status);
      this.onChangeCompanyValue(String(this.logindata.InsuranceId));
      this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate)
      console.log(this.effectiveValue);
      this.panelOpen = false;
    }
  }
  onDateFormatInEdit(date) {

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
    let UrlLink = `api/usertypechangestatus`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: event.element.InsuranceId,
      //RegionCode:event.element.Regioncode,
      Effectivedate:event.data.EffectiveDate,
      Usertypeid: event.element.Usertypeid,
  
   
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.onFetechInitialData()
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
  onSaveUserTypeDetials(modal) {

    let UrlLink = `api/insertusertypemaster`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "Usertypeid":this.FormGroupData.controls['Usertypeid'].value,
      "Shortdesp":this.FormGroupData.controls['Shortdesp'].value,
      "InsuranceId":this.InsuCode,
      "Usertypedesc":this.FormGroupData.controls['Usertypedesc'].value,
      "Effectivedate": effectiveDate,
      "Remarks": this.FormGroupData.controls['Remarks'].value,
      "Status": this.FormGroupData.controls['Status'].value
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
        await this.onLoadOccupationListGrid();
        this.panelOpen = true;
        Swal.fire(
          `UserType Details Created/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#rolemodal").hide();
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  async onActionHandler(row,modal) {
   
    this.open(modal)
    console.log(row);

    let UrlLink = "api/usertypemasterid";
    let ReqObj = {
      "InsuranceId": this.InsuCode,
      "Usertypeid": row.Usertypeid
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
