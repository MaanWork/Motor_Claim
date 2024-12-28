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
  Depreciableyn: any,
  Depreciationpercent: any,
  Entrydate: any,
  InsuranceId: any,
  Partdescription: any,
  Partdescriptionar: any,
  Partid: any,
  Remarks: any,
  Sectionid: any,
  Status: any,
}
@Component({
  selector: 'app-vehicle-body-master',
  templateUrl: './vehicle-body-master.component.html',
  styleUrls: ['./vehicle-body-master.component.css']
})
export class VehicleBodyMasterComponent implements OnInit {
  public tableData: DataTableElement[];
  public columnHeader: any;
  public VehicleBodyFrom: FormGroup;
  public VehicleBodyPartsList: any = [];
  public InsuranceCmpyList: any = [];
  public SectionList: any = [];

  public InsuCode: any;
  public SectionCode: any;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  effectiveValue:any="";
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredSectionList: Observable<any[]>;
  filteredSectionListComp: Observable<any[]>;
  VehicleListForm: FormGroup;
  InsuListCode: any="";
  SectionListCode: any;
  logindata: any;
  minDate: Date;
  closeResult: string;
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private datePipe:DatePipe,
    private modalService: NgbModal,
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.VehicleListForm = this.formBuilder.group({
      InsuranceId: ['', [Validators.required, Validators.maxLength(50)]],
      Sectionid: ['', [Validators.required, Validators.maxLength(50)]]
    });
    this.onCreateFormControl();
    this.onFetechInitialData();

    this.filteredInsurance = this.VehicleBodyFrom.controls['Insid'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance')),
    );
    this.filteredSectionList = this.VehicleBodyFrom.controls['Sectionid'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'sectionid')),
    );

    this.filteredInsuranceComp = this.VehicleListForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance2')),
    );

  }



  onCreateFormControl() {

    this.VehicleBodyFrom = this.formBuilder.group({
      Depreciableyn: ['N'],
      Depreciationpercent: [''],
      Entrydate: [''],
      Insid: [''],
      Partdescription: ['', Validators.required],
      Partdescriptionar: [''],
      Partid: [''],
      Remarks: [''],
      Sectionid: [''],
      Status: ['N'],
      Amendid: [{ value: '0', disabled: false }, [Validators.maxLength(50)]],
    })

  }
  ngAfterViewInit() {

  }
  private _filter(value: string, dropname: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    if (dropname == 'insurance') {
      console.log("Ins")
      return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'insurance2') {
      console.log("Ins2")
      return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'sectionid') {
      console.log("Sec")
      return this.SectionList.filter((option) => option?.SectionDesc?.toLowerCase().includes(filterValue));
    }

  }
  private _filterSectionId(value: string, dropname: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return this.SectionList.filter((option) => option?.SectionDesc?.toLowerCase().includes(filterValue));
  }

  async onFetechInitialData() {

    this.VehicleBodyPartsList = await this.onGetVehicleBodyPartsList();
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);

  }

  async onGetVehicleBodyPartsList() {
    this.tableData = null;
    if(this.InsuListCode!="" && this.InsuListCode != undefined){
      let UrlLink = `api/getvehiclebodypartsmaster`;
      let ReqObj = {
        "InsuranceId": this.InsuListCode,
        "Status": "Y",
        "Sectionid":this.SectionListCode
      }
      let response = (await this.adminService.onPostMethod(UrlLink,ReqObj)).toPromise()
        .then(res => {
          this.VehicleBodyPartsList = res;
          this.columnHeader = [
           
            { key: "Sectiondescp", display: "SECTION TYPE" },
            { key: "Partdescription", display: "BODY PARTS NAME" },
            { key: "Depreciationpercent", display: "DEPRECIATION PERCENT" },
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
  async onSectionList() {
    let UrlLink = `api/getvehiclepartsgroupmaster`;
    let ReqObj = {
      "InsuranceId": this.InsuListCode,
      "Status": "Y"
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

  async onChangeCompanyValue(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      this.VehicleBodyFrom.controls['Insid'].setValue(Code.CodeDesc);
      this.VehicleBodyFrom.controls['Insid'].disable();
    }
  }
  onChangeSectionList(sectionid) {
    let Code = this.SectionList.find((ele: any) => ele.SectionId == sectionid);
    if (Code) {
      this.SectionCode = sectionid;
      this.VehicleBodyFrom.controls['Sectionid'].setValue(Code.SectionDesc);

    }
  }
  onChangeSectionGridList(sectionid){
    let Code = this.SectionList.find((ele: any) => ele.SectionId == sectionid);
    console.log("Section ",sectionid)
    if (Code) {

      this.SectionListCode = sectionid;
      console.log("Selected Code List",Code)
      this.VehicleListForm.controls['Sectionid'].setValue(Code.SectionDesc);
      this.onGetVehicleBodyPartsList();
    }
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuListCode = insuranceCode;
      this.VehicleListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.SectionList = await this.onSectionList();
      console.log("SectionList", this.SectionList);
      this.filteredSectionListComp = this.VehicleListForm.controls['Sectionid'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filterSectionId(value, 'sectionid2')),
      );
      console.log("Final Section List",this.filteredSectionListComp)

    }
  }
  getSectionTypeList(){

  }
  onSaveVehiclePartsDetials(modal) {

    let UrlLink = `api/insertvehiclebodypartsmaster`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "Depreciableyn": this.VehicleBodyFrom.controls['Depreciableyn'].value,
      "Depreciationpercent": this.VehicleBodyFrom.controls['Depreciationpercent'].value,
      "InsuranceId": this.InsuCode,
      "Partdescription": this.VehicleBodyFrom.controls['Partdescription'].value,
      "Partdescriptionar": this.VehicleBodyFrom.controls['Partdescriptionar'].value,
      "Partid": this.VehicleBodyFrom.controls['Partid'].value,
      "Remarks": this.VehicleBodyFrom.controls['Remarks'].value,
      "Sectionid": this.SectionCode,
      "Status": this.VehicleBodyFrom.controls['Status'].value,
      "Effectivedate": effectiveDate,
      "Amendid":this.VehicleBodyFrom.controls['Amendid'].value
    };
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
        this.VehicleBodyPartsList = await this.onGetVehicleBodyPartsList();


      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element: any = data.Errors[index];
          this.VehicleBodyFrom.controls[element.Field].setErrors({ message: element.Message });

        }
      }
      else{
        this.panelOpen = true;
        Swal.fire(
          `Parts Created Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#vemmodal").hide();
      }


    }, (err) => {
      this.handleError(err);
    })
  }

  async onActionHandler(row,modal) {
    this.open(modal);
    var vehiclePartsEditDetails: any = await this.onvehiclePartsEditDetails(row);
    if (vehiclePartsEditDetails) {
      //this.panelOpen = false;
      this.InsertMode = 'Update';
      this.VehicleBodyFrom.controls['Depreciableyn'].setValue(vehiclePartsEditDetails.Depreciableyn);
      this.VehicleBodyFrom.controls['Depreciationpercent'].setValue(vehiclePartsEditDetails.Depreciationpercent);
      this.VehicleBodyFrom.controls['Entrydate'].setValue(vehiclePartsEditDetails.Entrydate);
      this.onChangeCompanyValue(vehiclePartsEditDetails.InsuranceId)
      this.VehicleBodyFrom.controls['Insid'].disable();
      this.VehicleBodyFrom.controls['Partdescription'].setValue(vehiclePartsEditDetails.Partdescription);
      this.VehicleBodyFrom.controls['Partid'].setValue(vehiclePartsEditDetails.Partid);
      this.VehicleBodyFrom.controls['Remarks'].setValue(vehiclePartsEditDetails.Remarks);
      this.onChangeSectionList(vehiclePartsEditDetails.Sectionid)
      this.effectiveValue = this.onDateFormatInEdit(vehiclePartsEditDetails.Effectivedate)
      this.VehicleBodyFrom.controls['Sectionid'].disable();
      this.VehicleBodyFrom.controls['Status'].setValue(vehiclePartsEditDetails.Status);
      this.VehicleBodyFrom.controls['Amendid'].setValue(vehiclePartsEditDetails.Amendid);
    }
    console.log(vehiclePartsEditDetails);
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
  async onvehiclePartsEditDetails(row) {
    let UrlLink = `api/vehiclebodypartsmasterbyid`;
    let ReqObj = {
      "InsuranceId": row.InsuranceId,
      "Sectionid": row.Sectionid,
      "Partid": row.Partid
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
  onAddNewParts(modal) {
    this.InsertMode = 'Insert';
    this.VehicleBodyFrom.reset();
    //this.panelOpen = false;
    this.open(modal);
    this.effectiveValue = "";
    this.onChangeCompanyValue(this.logindata.InsuranceId);
    this.VehicleBodyFrom.controls['Depreciableyn'].setValue('N');
    this.onChangeSectionList(this.SectionListCode);
    this.VehicleBodyFrom.controls['Status'].setValue('Y');
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

  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/vehiclebodytypechangestatus`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: event.element.InsuranceId,
      //RegionCode:event.element.Regioncode,
      Effectivedate:event.data.EffectiveDate,
       Partid:event.element.Partid,
   
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
}
