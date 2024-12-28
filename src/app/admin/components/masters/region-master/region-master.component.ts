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
  address1:any,
  address2:any,
  address3:any,
  city:any,
  country:any,
  effectiveDate:any,
  email:any,
  insCompanyId:any,
  phone:any,
  regionCode:any,
  regionName:any,
  remarks:any,
  Status:any,
}
@Component({
  selector: 'app-region-master',
  templateUrl: './region-master.component.html',
  styleUrls: ['./region-master.component.css']
})
export class RegionMasterComponent implements OnInit {
  public tableData: DataTableElement[];
  public columnHeader: any;
  public RegionForm: FormGroup;
  public RegionListGrid: any = [];

  public InsertMode: any = 'Insert';
  public InsuranceCmpyList: any;
  public RegionList: any;
  public BranchList: any;
  public InsuCode: any;
  public RegionCode: any;
  public BranchCode: any;
  public panelOpen: boolean = true;
  public ChangePassword:any;
  public NewPassword:any;
  public ReNewPassword:any;
  effectiveValue:any="";
  filteredInsurance: Observable<any[]>;
  filteredRegionList: Observable<any[]>;
  filteredBranchList: Observable<any[]>;
  filteredCountry: Observable<any[]>;
  filteredCity: Observable<any[]>;
  logindata: any;RegionListForm:FormGroup;
  InsuCompCode: any;
  minDate: Date;
  countryList: any;
  cityList: any;CityCode:any="";
  countryCode:any = "";
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
    this.RegionListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }

  onCreateFormControl() {
    this.RegionForm = this.formBuilder.group({
      Address1:[{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Address2:[{ value: '', disabled: false }, [ Validators.maxLength(50)]],
      City:[{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Country:[{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Email:[{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Phone: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RegionCode:[{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RegionName:[{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      Remarks:[{ value: '', disabled: false }, [ Validators.maxLength(50)]],
      Status:[{ value: 'N', disabled: false }],
    })
  }

  async onFetechInitialData() {
    this.tableData = null;
    this.RegionListGrid = await this.onGetRegionListGrid();
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    console.log(this.InsuranceCmpyList)
    this.filteredInsurance =  this.RegionForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance')),
    );
    this.columnHeader = [
      { key: "Regionname", display: "REGION NAME" },
      { key: "Address1", display: "ADDRESS" },
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
          values: { Y: "Active", N: "Inactive" }
        }
      },
    ];
    this.tableData = this.RegionListGrid;
  }

  async onGetRegionListGrid() {

    let UrlLink = `api/getregionmaster`;
    let ReqObj = {
      "InsuranceId":String(this.logindata.InsuranceId),
      "Status":'Y'
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

  private _filter(value: string, dropname: string): string[] {
    console.log('jjjjjjjjjjjjjj',value);
    if(value == null){
      value='';
    }
    console.log(value)
    const filterValue = value.toLowerCase();
    if (dropname == 'insurance') {
      return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'country') {
      console.log("kkkkkkkkkkkk");
      return this.countryList.filter((option) => option?.Countryname?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'city') {
      console.log("City List",filterValue);
      return this.cityList.filter((option) => option?.City?.includes(filterValue));
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

  async onChangeCompanyValue(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      this.RegionForm.controls['InsuranceId'].setValue(Code.CodeDesc);

    }
  }
  async onChangeCityValue(cityCode) {
     
    console.log('kkkkkkkkkkkkkk',this.cityList);
    let Code = this.cityList.find((ele: any) => ele.Sno == cityCode);
    if (Code) {
      this.CityCode = Code.Sno;
      this.RegionForm.controls['City'].setValue(Code.City);
      console.log("Code",this.CityCode,this.RegionForm.controls['City'].value);
    }
  }
  async onChangeCountryValue(CountryCode) {
    console.log('MMMMMMMMM',this.countryList);
    let Code = this.countryList.find((ele: any) => ele.Countryid== CountryCode);
    if (Code) {
      this.countryCode = Code.Countryid;
      this.RegionForm.controls['Country'].setValue(Code.Countryname);
    }
  }
  async onChangeCompanyList(insuranceCode) {
    console.log('JJJJJJJJJJJJJJJ')
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCompCode = insuranceCode;
      this.RegionListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.getCountryList();
    }
  }
  getCountryList(){
    let ReqObj = {
      "Status": "Y",
      "Inscompanyid": String(this.logindata.InsuranceId),
    }
    let UrlLink = `api/getcountrymaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.countryList = data;
      console.log('JJJJJJJJJJJJ',this.countryList);
      this.filteredCountry =  this.RegionForm.controls['Country'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, 'country')),
      );

      this.getCityList();
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
      this.filteredCity =  this.RegionForm.controls['City'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, 'city')),
      );
    }, (err) => {
      this.handleError(err);
    })
  }
  onSaveRegionDetials(modal) {

    let UrlLink = `api/insertregionmaster`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      Address1:this.RegionForm.controls['Address1'].value,
      Address2:this.RegionForm.controls['Address2'].value,
      //City: String(this.CityCode),
      Country: String(this.countryCode),
      Effectivedate: effectiveDate,
      //Email:this.RegionForm.controls['Email'].value,
      InsuranceId: this.InsuCode,
      Phone: this.RegionForm.controls['Phone'].value,
      Regioncode:this.RegionForm.controls['RegionCode'].value,
      Regionname:this.RegionForm.controls['RegionName'].value,
      Remarks:this.RegionForm.controls['Remarks'].value,
      Status:this.RegionForm.controls['Status'].value,
      Address3:""
    }
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element:any = data.Errors[index];
        this.RegionForm.controls[element.Field].setErrors({message: element.Message });

        }

      }
      else if(data.Response == "Inserted SucessFully" || "Updated SucessFully") {
        this.RegionListGrid = await this.onGetRegionListGrid();
        this.panelOpen = true;
        this.onFetechInitialData()
        Swal.fire(
          `Region Details Inserted/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#regionmodal").hide();
      }
    }, (err) => {
      this.handleError(err);
    })
  }

  async onActionHandler(row,modal) {
    console.log(row);
    this.open(modal)
    var regionEditDetails: any = await this.onRegionEditDetails(row);
    console.log("Edit Values",regionEditDetails)
    if (regionEditDetails) {
      this.panelOpen = false;
      this.InsertMode = 'Update';
      this.effectiveValue = this.onDateFormatInEdit(regionEditDetails.Effectivedate);
      this.RegionForm.controls['Address1'].setValue(regionEditDetails.Address1);
      this.RegionForm.controls['Address2'].setValue(regionEditDetails.Address2);
      //this.RegionForm.controls['City'].setValue(regionEditDetails.City);
      this.onChangeCityValue(regionEditDetails.City);
      this.onChangeCountryValue(regionEditDetails.Country);
      //this.RegionForm.controls['Country'].setValue(regionEditDetails.Country);
      this.RegionForm.controls['Email'].setValue(regionEditDetails.Email);
      this.RegionForm.controls['Phone'].setValue(regionEditDetails.Phone);
      await this.onChangeCompanyValue(regionEditDetails.InsuranceId);
      this.RegionForm.controls['Remarks'].setValue(regionEditDetails.Remarks);
      this.RegionForm.controls['RegionCode'].setValue(regionEditDetails.Regioncode);
      this.RegionForm.controls['RegionName'].setValue(regionEditDetails.Regionname);
      this.RegionForm.controls['Remarks'].setValue(regionEditDetails.Remarks);
      this.RegionForm.controls['Status'].setValue(regionEditDetails.Status);

    }
  }

  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/changestatusregiondetails`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: event.element.InsuranceId,
      RegionCode:event.element.Regioncode,
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
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  async onRegionEditDetails(row) {
    let UrlLink = `api/regionmasterid`;
    let ReqObj = {
      "Regioncode": row.Regioncode,
      "InsuranceId":String(row.InsuranceId)
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
  onAddNewRegion(modal) {
    this.open(modal)
    this.InsertMode = 'Insert';
    this.RegionForm.reset();
    this.RegionForm.controls['Status'].setValue('Y'),
    this.effectiveValue="";
    this.panelOpen = false;
    this.onChangeCompanyValue(this.logindata.InsuranceId);
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
