import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
export interface DataTableElement {
  EffectiveDate: any,
  EntryDate: any,
  Inscompanyid: any,
  Remarks: any,
  SectionDesc: any,
  SectionId: any,
  Status: any,
}
@Component({
  selector: 'app-vehicle-parts-group-master',
  templateUrl: './vehicle-parts-group-master.component.html',
  styleUrls: ['./vehicle-parts-group-master.component.css']
})
export class VehiclePartsGroupMasterComponent implements OnInit {

  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  effectiveValue:any="";
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  VehicleListForm: FormGroup;
  InsuranceCmpyList: any=[];
  InsuCode: any;
  InsuListCode: any;
  VehicleBodyPartsList: any[];
  public tableData: DataTableElement[];
  minDate:any;
  public columnHeader: any;
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
    let reload = sessionStorage.getItem('garageLoginReload');
    if(reload){
      sessionStorage.removeItem('garageLoginReload');
      window.location.reload();
    }
  }

  ngOnInit(): void {
    this.minDate = new Date();
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    console.log("Ins Valueeeeeee",this.logindata)
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.VehicleListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]

    });

  }
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.FormGroupData.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance')),
    );
    this.filteredInsuranceComp = this.VehicleListForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance2')),
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
    console.log("Ins Code",insuranceCode)
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      this.FormGroupData.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.FormGroupData.controls['InsuranceId'].disable();
    }
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuListCode = insuranceCode;
      this.VehicleListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
      this.onGetVehicleBodyPartsList();
    }
  }
  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
      "EffectiveDate": [''],
      "InsuranceId": [''],
      "Remarks": [''],
      "SectionDescp": [''],
      "SectionId": [''],
      "Status": ['Y']
    })
  }
  async onvehiclePartsEditDetails(row) {
    console.log(row)
    let UrlLink = `api/vehiclepartsgroupmasterid`;
    let ReqObj = {
      "SectionId": row.SectionId,
      "InsuranceId" : row.Inscompanyid
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
  async onActionHandler(row,modal) {
    this.open(modal)
    var vehiclePartsEditDetails: any = await this.onvehiclePartsEditDetails(row);
    if (vehiclePartsEditDetails) {
      //this.panelOpen = false;
      this.InsertMode = 'Update';
      this.FormGroupData.controls['Remarks'].setValue(vehiclePartsEditDetails.Remarks);
      this.FormGroupData.controls['SectionId'].setValue(vehiclePartsEditDetails.SectionId);
      this.FormGroupData.controls['SectionDescp'].setValue(vehiclePartsEditDetails.SectionDesc);
      this.onChangeCompanyValue(vehiclePartsEditDetails.Inscompanyid)
      this.FormGroupData.controls['InsuranceId'].disable();
      this.FormGroupData.controls['Status'].setValue(vehiclePartsEditDetails.Status);
      this.effectiveValue = this.onDateFormatInEdit(vehiclePartsEditDetails.EffectiveDate)
    }
    console.log(vehiclePartsEditDetails,this.effectiveValue);
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
  onAddNew(modal) {
    this.open(modal);
      this.onCreateFormControl();
      this.panelOpen = false;
      this.effectiveValue="";
      this.onChangeCompanyValue(this.logindata.InsuranceId);
  }
  async onGetVehicleBodyPartsList() {
    this.tableData = null;
    if(this.InsuListCode!="" && this.InsuListCode != undefined){
      let UrlLink = `api/getvehiclepartsgroupmaster`;
      let ReqObj = {
        "InsuranceId": this.InsuListCode,
        "Status": "Y"
      }
      let response = (await this.adminService.onPostMethod(UrlLink,ReqObj)).toPromise()
        .then(res => {
          this.VehicleBodyPartsList = res;
          this.columnHeader = [
           
            { key: "SectionDesc", display: "SECTION Name" },
            { key: "EffectiveDate", display: "EFFECTIVE DATE" },
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
            }
          ];
          this.tableData = this.VehicleBodyPartsList;
        })
        .catch((err) => {
          this.handleError(err)
        });
      return response;
    }
  }

  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/vehiclepartsgroupchangestatus`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: event.element.Inscompanyid,
      SectionId:event.element.SectionId,
      //RegionCode:event.element.Regioncode,
      EffectiveDate:event.data.EffectiveDate,
    
   
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
  onSaveVehiclePartsGroupDetials(modal) {

    let UrlLink = `api/insertvehiclepartsgroupmaster`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "EffectiveDate": effectiveDate,
      "InsuranceId": this.InsuCode,
      "Remarks": this.FormGroupData.controls['Remarks'].value,
      "SectionDescp": this.FormGroupData.controls['SectionDescp'].value,
      "SectionId": this.FormGroupData.controls['SectionId'].value,
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
        await this.onGetVehicleBodyPartsList();
        this.panelOpen = true;
        Swal.fire(
          `Parts Group Details Created Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#vemodal").hide();
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
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
