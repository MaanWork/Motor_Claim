import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from './../../../admin.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith, find } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
export interface DataTableElement {
  partytypeDesc:any,
  partytypeId:any,
  policytypeid:any,
  remarks:any,
  status:any,
}
@Component({
  selector: 'app-party-type-master',
  templateUrl: './party-type-master.component.html',
  styleUrls: ['./party-type-master.component.css']
})
export class PartyTypeMasterComponent implements OnInit {
  public tableData: DataTableElement[];
  public columnHeader: any;
  public PartyTypeForm: FormGroup;
  public PartyTypeList: any = [];
  effectiveValue:any="";
  filteredPolicyTypes: Observable<any[]>;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  logindata: any;
  minDate: Date;
  policyTypeList: any;
  policyTypeCode: any;
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

  async ngOnInit() {
    this.onCreateFormControl();
    this.policyTypeList = await this.getPolicyTypeList();
    this.onFetechInitialData();

  }

  onCreateFormControl() {
    this.PartyTypeForm = this.formBuilder.group({
        "Partytypedesc": ['',Validators.required],
        "Partytypeid": [''],
        "Policytypeid": [''],
        "Remarks": ['',Validators.required],
        "Status": ['Y',Validators.required]
    })
  }

  async onFetechInitialData() {
    this.tableData = null;
    this.PartyTypeList = await this.onGetPartyTypeList();
    this.filteredPolicyTypes = this.PartyTypeForm.controls['Policytypeid'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    this.columnHeader = [
      { key: "Partytypedesc", display: "PARTY TYPE NAME" },
      { key: "Effectivedate", display: "EFFECTIVE DATE" },
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
          values: { Y: "Active", N: "Inactive" }
        }
      },
    ];
    this.tableData = this.PartyTypeList;
  }
  async getPolicyTypeList(){
    let UrlLink = "api/policytypeids";

    let response = (await this.adminService.onGetLossType(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async onChangePolicyTypes(countryCode) {
    console.log('kkkkkkkkkkk',this.policyTypeList)
    console.log('MMMMMMMMM',countryCode);
    let Code = this.policyTypeList.find((ele: any) => ele.Code == countryCode);
    if (Code) {
      this.policyTypeCode = countryCode;
      console.log('llllllllll',Code.CodeDesc);
      this.PartyTypeForm.controls['Policytypeid'].setValue(Code.CodeDesc);
    }
    else{
      this.policyTypeCode = "";
      this.PartyTypeForm.controls['Policytypeid'].setValue('');
    }
  }
  async onGetPartyTypeList() {

    let UrlLink = `api/getclaimpartytypemaster`;
    let ReqObj = {
      "Inscompanyid":this.logindata.InsuranceId
    }
    let response = (await this.adminService.onPostMethod(UrlLink,ReqObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/changestatuspartytypemasterdetails`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: event.element.Inscompanyid,
      OccupationId:event.element.Occupationid,
      PartyTypeId:event.element.Partytypeid,
      Effectivedate:event.data.EffectiveDate,
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
  onSavePartyTypeDetials(modal) {

    let UrlLink = `api/claimpartytypemaster`;
    let effectiveDate="";
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "Partytypedesc": this.PartyTypeForm.controls['Partytypedesc'].value,
      "Partytypeid":this.PartyTypeForm.controls['Partytypeid'].value,
      "Policytypeid":this.policyTypeCode,
      "Remarks": this.PartyTypeForm.controls['Remarks'].value,
      "Status": this.PartyTypeForm.controls['Status'].value,
      "Effectivedate": effectiveDate,
      "Inscompanyid":this.logindata.InsuranceId
    };
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element: any = data.Errors[index];
          this.PartyTypeForm.controls[element.Field].setErrors({ message: element.Message });
        }

      }
      else{
        this.onFetechInitialData();
        this.panelOpen = true;
        Swal.fire(
          `Party Type Created/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#patmodal").hide();
      }


    }, (err) => {
      this.handleError(err);
    })
  }

  async onActionHandler(row,modal) {
    this.open(modal)
    var partyTypeListEdit: any = await this.onPartyTypeListEdit(row);
    if (partyTypeListEdit) {
      this.panelOpen = false;
      this.InsertMode = 'Update';
      this.effectiveValue = this.onDateFormatInEdit(partyTypeListEdit.Effectivedate);
      this.PartyTypeForm.controls['Remarks'].setValue(partyTypeListEdit.Remarks);
      this.PartyTypeForm.controls['Partytypedesc'].setValue(partyTypeListEdit.Partytypedesc);
      this.PartyTypeForm.controls['Partytypeid'].setValue(partyTypeListEdit.Partytypeid);
      this.onChangePolicyTypes(partyTypeListEdit.Policytypeid);
      this.PartyTypeForm.controls['Status'].setValue(partyTypeListEdit.Status);
    }
  }

  async onPartyTypeListEdit(row) {
    let UrlLink = `api/editpartytypemaster`;
    let ReqObj = {
      "Inscompanyid": row.Inscompanyid,
      "Partytypeid": row.Partytypeid
    }
    let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
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
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  onAddNewPartyType(modal) {
    this.open(modal);
    this.InsertMode = 'Insert';
    this.onCreateFormControl();
    this.effectiveValue = "";
    this.policyTypeCode='';
    this.panelOpen = false;
  }
  private _filter(value: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    console.log("Policy Typesssss",this.policyTypeList);
    return this.policyTypeList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
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
