import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
export interface DataTableElement {
  City: any,
  InsuranceId: any,
  Region: any,
  Remarks: any,
  Sno: any,
  Status: any,
}
@Component({
  selector: 'app-causeloss',
  templateUrl: './causeloss.component.html',
  styleUrls: ['./causeloss.component.scss']
})
export class CauseLossMasterComponent implements OnInit {

  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  CityListForm:FormGroup;
  InsuranceCmpyList: any=[];
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  filteredRegion: Observable<any[]>;
  filteredproductList: Observable<any[]>;
  InsuCode: any;effectiveValue:any="";
  occupationListGrid: any;public tableData: DataTableElement[];
  columnHeader: any;
  InsCompCode: any;
  logindata: any;
  regionList:  any[]=[];
  productList:any;
  minDate: Date;
  closeResult: string;
    productcode: any;
    CauseOflossId: any;
  insuid: any;
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
    this.insuid=this.logindata.InsuranceId;
    console.log('OOOOOOOOOOOO',this.insuid);
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.CityListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }
 

  onChangeRegionList(row){
    console.log(row)
    let Code = this.productList.find((ele: any) => ele.CodeDesc == row);
    if (Code) {
     this.productcode= Code;
      this.FormGroupData.controls['product'].setValue(Code.CodeDesc);
     this.onLoadCauseListGrid()
     
      //this.NewLoadBranch(this.RegionCode)
      //this.onLoadBranchListGrid();

    }
  }
  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
        //"Sno" :['',Validators.required],
        //"City" :['',Validators.required],
        //"Region" :['',Validators.required],
        "Status" :['Y',Validators.required],
        "Remarks" :['',Validators.required],
        //"prodectnew":['',Validators.required],
        "InsuranceId" : ['',Validators.required],
        "product":['',Validators.required],
        "CclCauseLossDesc":['',Validators.required],
        "CclProdCode":['',Validators.required],
        "Amendid": [{ value: '0', disabled: false }, [Validators.maxLength(50)]],

    })
  }

 
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;

      this.CityListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      
    }
  }

  async onLoadCauseListGrid(){
    this.tableData = null;
    let ReqObj = {
        "CclProdCode": this.FormGroupData.controls['product'].value
    }
    let UrlLink = `api/getallcauseoflossmaster`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

      this.occupationListGrid = data;
      this.columnHeader = [
        
        { key: "CclCauseLoss", display: "Ccl CauseLoss"},
        { key: "CclCauseLossDesc", display: "CclCauseLossDesc"},
        { key: "EffectiveDate", display: "EffectiveDate"},
        { key: "Remarks", display: "Remarks"},

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
        }
      ];
      this.tableData = this.occupationListGrid;
      console.log(data);
       this.onGetRegionList(this.InsuCode);
    }, (err) => {
      this.handleError(err);
    })
  }
  async onGetRegionList(Code) {
    let UrlLink = `api/regions/${Code}`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {
        this.regionList = res;
        console.log("Region Listttttt",res);
        this.filteredRegion = this.FormGroupData.controls['Region'].valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value,"region")),
        );
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async ProductList() {
    let UrlLink = `api/searchproductcode`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async onFetechInitialData(){
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.CityListForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance")),
    );
    this.filteredInsuranceComp = this.FormGroupData.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance2")),
    );
    //this.FormGroupData.controls['product'].enable();
    this.productList= await this.ProductList();
    this.filteredproductList = this.FormGroupData.controls['product'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value,"Product")),
      );
      
      
  }


  
  
  onAddNew(modal) {
    this.open(modal);
    this.InsertMode = 'Insert';
    //this.onCreateFormControl();
   
    this.FormGroupData.controls['Remarks'].reset();
    this.FormGroupData.controls['CclCauseLossDesc'].reset();
    this.FormGroupData.controls['CclProdCode'].reset();
    //this.FormGroupData.controls['product'].disable();

   
    this.effectiveValue="";
   
    /*if(this.InsertMode == 'Insert'){
      this.onCreateFormControl();
    }*/
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
    
      this.FormGroupData.controls['CclCauseLossDesc'].setValue(userData.CclCauseLossDesc);
      this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
      //this.onChangeCompanyValue(userData.InsuranceId);
      this.effectiveValue = this.onDateFormatInEdit(userData.EffectiveDate);
      this.FormGroupData.controls['CclProdCode'].setValue(userData.CclCauseLoss);
      this.FormGroupData.controls['product'].setValue(userData.CclProdCode);
      //this.FormGroupData.controls['product'].disable();
      this.FormGroupData.controls['Status'].setValue(userData.Status);
      this.FormGroupData.controls['Amendid'].setValue(userData.Amendid);
      this.CauseOflossId=userData.CauseOflossId
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
  onSaveCityDetials(modal) {

    let UrlLink = `api/insertcauseoflossmaster`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let CauseOflossId

    if(this.CauseOflossId!="" && this.CauseOflossId!=undefined){
        CauseOflossId=this.CauseOflossId;
    }
    else{
        CauseOflossId=""
    }
    let ReqObj = {
      //"Sno" : this.FormGroupData.controls['Sno'].value,
      //"City" : this.FormGroupData.controls['City'].value,
      //"Region" : this.FormGroupData.controls['Region'].value,
      "Status" : this.FormGroupData.controls['Status'].value,
      "Remarks" : this.FormGroupData.controls['Remarks'].value,
      "InscompanyId":this.insuid,
      //"InsuranceId" : this.InsCompCode,
      "EffectiveDate": effectiveDate,
      "CauseOflossId":CauseOflossId,
      "AmendId":this.FormGroupData.controls['Amendid'].value,
      "CclProdCode" :this.FormGroupData.controls['product'].value,  
      "CclCauseLoss":this.FormGroupData.controls['CclProdCode'].value,
      "CclCauseLossDesc":this.FormGroupData.controls['CclCauseLossDesc'].value,
    
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
        await this.onLoadCauseListGrid();
        this.panelOpen = true;
        Swal.fire(
          `Cause Of Loss Details Created/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#citymodal").hide();
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = "api/changestatuscauseoflossmaster";//`api/citychangestatus`;
    let ReqObj = {
      Status:event.data.Status,
      CauseOflossId:event.element.CauseOflossId,
      CclProdCode :event.element.CclProdCode, 
      EffectiveDate:event.data.EffectiveDate,
    
    
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.onLoadCauseListGrid();
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
  async onActionHandler(row,modal) {
    console.log(row);
     this.open(modal)
    let UrlLink = "api/getcauseoflossmasterbyid";
    let ReqObj = {
        "CauseOflossId": row.CauseOflossId,
        "CclProdCode": row.CclProdCode
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
    if (dropname == 'region') {
      return this.regionList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'insurance2') {
      return this.InsuranceCmpyList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'Product') {
        return this.productList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
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
