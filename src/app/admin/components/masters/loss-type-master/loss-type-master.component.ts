import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from './../../../admin.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith, find } from 'rxjs/operators';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { LossTypeDocumentComponent } from '../../modal/loss-type-document/loss-type-document.component';
import { DatePipe } from '@angular/common';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
export interface DataTableElement {
  categoryDesc:any,
  categoryId:any,
  compYn:any,
  coreAppcode:any,
  entryDate:any,
  garageYn:any,
  mandatoryDocList:any,
  partOfLoss:any,
  remarks:any,
  status:any,
  typeDesc:any,
  typeId:any,
}
@Component({
  selector: 'app-loss-type-master',
  templateUrl: './loss-type-master.component.html',
  styleUrls: ['./loss-type-master.component.css']
})
export class LossTypeMasterComponent implements OnInit {

  public tableData: DataTableElement[];
  public columnHeader: any;
  public tableData1: DataTableElement[];
  public columnHeader1: any;
  public LossTypeForm: FormGroup;
  public LossTypeList: any = [];
  public LossType:any=[
    { key:'Primary Loss', value:1},
    { key:'Secondary Loss', value:2}
  ]
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;
  public LossTypeId:any;effectiveValue:any="";
  public LossTypeDesc:any;
  primaryLossList:any;
  secondaryLossList: any;
  DocumentImageList: any[]=[];
  partList: any[];
  mandatoryList: any[];
  searchValue:any="";
  LossGridForm: FormGroup;
  InsCompCode: any;
  InsuranceCmpyList: any;
  InsuCode: any;
  logindata: any;
  minDate: Date;
  closeResult: string;
  panel:boolean=true;
  CeoLossType:any;
  reftype:any;
  filteredRefType: Observable<any[]>;
  filteredCoeLossType: Observable<any[]>;
  countryCode: string;
  currencyCode: any;
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LossTypeDocumentComponent>,
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
    this.LossGridForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });
  }

  onCreateFormControl() {
    this.LossTypeForm = this.formBuilder.group({
      "Categorydesc": ['',Validators.required],
      "Categoryid": [''],
      "Compyn": ['N'],
      "Coreappcode": ['',Validators.required],
      "Entrydate": [''],
      "InsuranceId":[''],
      "GarageYn": ['Y'],
      "SurveyorYn": ['Y'],
      "Mandatorydoclist":[[]],
      "Partofloss":[[]],
      "Remarks": ['',Validators.required],
      "Status": ['Y',Validators.required],
      "Typedesc": ['',Validators.required],
      "Typeid": ['',Validators.required],
      "CeolossType":['',Validators.required],
      "RefType":['',Validators.required]
    })
  }

  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.positionList();
    this.ReferenceType(); 
    this.filteredInsurance = this.LossTypeForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );


    this.filteredInsuranceComp = this.LossGridForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter1(value)),
    );
  }



  async positionList() {
    let UrlLink = `api/celosstype`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {
        this.CeoLossType = res;
        console.log('UUUUUUUUUUUUUUUUUUUU',this.CeoLossType)
      //this.userTypeCode = "";
      this.LossTypeForm.controls['CeolossType'].setValue('');
      this.filteredCoeLossType = this.LossTypeForm.controls['CeolossType'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter3(value,"CeolossType")),
      );
        //return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    //return response;
  }

  async onChangeCurrencyValue(value) {
    let Code = this.CeoLossType.find((ele: any) => ele.Code == value);
    if (Code) {
      this.countryCode = Code.Code;
      this.LossTypeForm.controls['CeolossType'].setValue(Code.CodeDesc);
    }
    else {
      this.countryCode = "";
      this.LossTypeForm.controls['CeolossType'].setValue('');
    }
  }


  
  async ReferenceType() {
    let UrlLink = `api/reftype`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {
        this.reftype= res;
        console.log('UUUUUUUUUUUUUUUUUUUU',this.CeoLossType)
      //this.userTypeCode = "";
      this.LossTypeForm.controls['RefType'].setValue('');
      this.filteredRefType = this.LossTypeForm.controls['RefType'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter3(value,"reftype")),
      );
        //return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    //return response;
  }


  async onChangeValue(value) {
    let Code = this.reftype.find((ele: any) => ele.Code == value);
    if (Code) {
      this.currencyCode = Code.Code;
      this.LossTypeForm.controls['RefType'].setValue(Code.CodeDesc);
    }
    else {
      this.currencyCode = "";
      this.LossTypeForm.controls['RefType'].setValue('');
    }
  }

  private _filter3(value: string, dropname: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    if (dropname == 'CeolossType') {
      console.log("UserType List",this.CeoLossType);
      return this.CeoLossType.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'reftype') {
      console.log("PositionList ",this.reftype);
      return this.reftype.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    
  }
  setPrimaryLoss(){
    this.tableData = null;
    if(this.LossTypeList){
      this.primaryLossList = null;
      let primaryList = [];
      let i=0;
      if(this.LossTypeList.length != 0){
        for(let loss of this.LossTypeList){
          if(loss.Typedesc == 'PrimaryLoss' || loss.Typedesc == 'Primary Loss'){
              primaryList.push(loss);
          }
          if(this.LossTypeList.length-1 == i){
              this.primaryLossList = primaryList;
              this.tableData = this.primaryLossList;
              console.log('jjjjjjjjjjjjjjjjjjj',this.tableData);
              this.columnHeader = [
                { key: "Categorydesc", display: "LOSS CATEGORY NAME" },
                { key: "Typedesc", display: "LOSS TYPE" },
                { key: "Coreappcode", display: "CORE APP CODE" },
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
          }
          i+=1;
        }
      }
    }
  }
  setSecondaryLoss(){
    this.tableData1 = null;
    if(this.LossTypeList){
      this.secondaryLossList = null;
      let secondaryList = [];
      let i=0;
      if(this.LossTypeList.length != 0){
        for(let loss of this.LossTypeList){
          if(loss.Typedesc == 'Secondary Loss' || loss.Typedesc == 'Secondary Loss'){
            secondaryList.push(loss);
          }
          if(this.LossTypeList.length-1 == i){
              this.secondaryLossList = secondaryList;
              this.tableData1 = this.secondaryLossList;
              this.columnHeader1 = [
              
                { key: "Categorydesc", display: "LOSS CATEGORY NAME" },
                { key: "Typedesc", display: "LOSS TYPE" },
                { key: "Coreappcode", display: "CORE APP CODE" },
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
          }
          i+=1;
        }
      }
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
      this.InsCompCode = insuranceCode;
      this.LossTypeForm.controls['InsuranceId'].setValue(Code.CodeDesc);
    }
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;

      this.LossGridForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      console.log("Setted Company Value", insuranceCode, Code.CodeDesc)
      this.LossTypeList = await this.onGetLossTypeList();
      await this.setPrimaryLoss();
      await this.setSecondaryLoss();
    }
  }
  getDocumentDetails(){
    this.panel=false;
    let UrlLink = `api/activeclaimdocmaster`;
    let token = sessionStorage.getItem('UserToken');
    let partofLoss = this.LossTypeForm.controls['Partofloss'].value;
    if(!partofLoss || partofLoss == undefined){
      partofLoss = [];
    }
    let ReqObj = {
      "Partofloss" : partofLoss,
      "InsuranceId": this.InsuCode,
      "Docapplicable": "CLAIM"
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("DocumentImageList", data);
      this.DocumentImageList = data;
      //this.getEditValues(this.partyTypeId);
      const dialogRef = this.dialog.open(LossTypeDocumentComponent, {
        width: '100%',
        panelClass: 'full-screen-modal',
        data:{"docList":data,"partList":this.partList,"mandatoryList":this.mandatoryList}

      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("Closed Result",result);
        this.panel=true;
        if(result.partList){
          this.LossTypeForm.controls['Partofloss'].setValue(result.partList);
        }
        if(result.mandatoryList){
          this.LossTypeForm.controls['Mandatorydoclist'].setValue(result.mandatoryList);
        }
        //this.saveMessage(result);
      });
      //this.getPartOfLossDocuments('part');
    }, (err) => {
      this.handleError(err);
    })
  }
  onCloseForm(){
    this.onCreateFormControl();
    this.panelOpen = true;
  }
  async onGetLossTypeList() {
    let UrlLink = `api/getclaimlosstypemaster`;
    let ReqObj = {
      "Status": "Y",
      "InsuranceId": this.InsuCode
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
  onChangeLossTypet(val){
    let find = this.LossType.find((ele:any)=>ele.value == String(val));
    if(find){
      this.LossTypeId = find.value
      this.LossTypeDesc = find.key;
    this.LossTypeForm.controls['Typeid'].setValue(find.key);

    }

  }
  onstatus(event){
    console.log('EEEEEEEE',event.element);
    let UrlLink = `api/changestatuslosstypemasterdetails`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: this.InsuCode,
      Effectivedate:event.data.EffectiveDate,
      CategoryId:event.element.Categoryid,
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        //await this.onGetLossTypeList;
        this.panelOpen = true;
        Swal.fire(
          `Change Status Updated Successfully`,
          'success',
          'success'
        );
        this.onFetechInitialData();
        //this.onGetLossTypeList();
        //this.setPrimaryLoss();
        //this.setSecondaryLoss();
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  onStatusSecondary(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/changestatuslosstypemasterdetails`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: this.InsuCode,
      Effectivedate:event.data.EffectiveDate,
      "CategoryId":event.element.CategoryId,
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        await this.setSecondaryLoss();
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

  onSaveLossTypeDetails(modal) {

    let UrlLink = `api/claimlosstypemaster`;
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "Categorydesc": this.LossTypeForm.controls['Categorydesc'].value,
      "Categoryid": this.LossTypeForm.controls['Categoryid'].value,
      "Compyn": this.LossTypeForm.controls['Compyn'].value,
      "Coreappcode": this.LossTypeForm.controls['Coreappcode'].value,
      "Entrydate": this.LossTypeForm.controls['Entrydate'].value,
      "InsuranceId": this.InsCompCode,
      "GarageYn": this.LossTypeForm.controls['GarageYn'].value,
      "SurveyorYn": this.LossTypeForm.controls['SurveyorYn'].value,
      "Mandatorydoclist":this.LossTypeForm.controls['Mandatorydoclist'].value,
      "Partofloss":this.LossTypeForm.controls['Partofloss'].value,
      "Remarks": this.LossTypeForm.controls['Remarks'].value,
      "Status": this.LossTypeForm.controls['Status'].value,
      "Typedesc": this.LossTypeDesc,
      "Typeid":this.LossTypeId,
      "Effectivedate":effectiveDate,
      "CeLosstypeId":this.countryCode,
      "CeLosstypeDesc":this.LossTypeForm.controls['CeolossType'].value,
       "RefType":this.currencyCode,
       "RefTypeDesc":this.LossTypeForm.controls['RefType'].value
    };
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Response == "Success") {
        this.LossTypeList = await this.onGetLossTypeList();
        this.panelOpen = true;
        Swal.fire(
          `Loss Created Successfully`,
          'success',
          'success'
        );
        this.setPrimaryLoss();
        this.setSecondaryLoss();
        modal.dismiss('Cross click');
        $("#lossmodal").hide();

      }

      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        // for (let index = 0; index < data.Errors.length; index++) {
        //   const element: any = data.Errors[index];
        //   this.LossTypeForm.controls[element.Field].setErrors({ message: element.Message });

        // }

      }


    }, (err) => {
      this.handleError(err);
    })
  }

  async onActionHandler(row,modal) {
    this.open(modal)
    this.partList = [];this.mandatoryList = [];
    var lossTypeListEdit: any = await this.onLossTypeListEdit(row);
    if (lossTypeListEdit) {
      console.log("Edit Valuessss",lossTypeListEdit);
      this.panelOpen = false;
      this.InsertMode = 'Update';
      this.LossTypeForm.controls['Categorydesc'].setValue(lossTypeListEdit.Categorydesc);
    this.LossTypeForm.controls['Categoryid'].setValue(lossTypeListEdit.Categoryid);
    this.LossTypeForm.controls['Compyn'].setValue(lossTypeListEdit.Compyn);
    this.LossTypeForm.controls['Coreappcode'].setValue(lossTypeListEdit.Coreappcode);
    this.LossTypeForm.controls['Remarks'].setValue(lossTypeListEdit.Remarks);
    this.LossTypeForm.controls['Entrydate'].setValue(lossTypeListEdit.Entrydate);
    this.LossTypeForm.controls['Status'].setValue(lossTypeListEdit.Status);
    this.effectiveValue = this.onDateFormatInEdit(lossTypeListEdit.Effectivedate);
    this.onChangeCompanyValue(lossTypeListEdit.InsuranceId);
    this.onChangeLossTypet(lossTypeListEdit.Typeid);
    this.onChangeCurrencyValue(lossTypeListEdit.CeLosstypeId);
    this.onChangeValue(lossTypeListEdit.RefType);
    this.partList = lossTypeListEdit.Partofloss;
    this.mandatoryList = lossTypeListEdit.Mandatorydoclist;
    this.LossTypeForm.controls['Mandatorydoclist'].setValue(lossTypeListEdit.Mandatorydoclist);
      this.LossTypeForm.controls['Partofloss'].setValue(lossTypeListEdit.Partofloss);

    }
  }

  async onLossTypeListEdit(row) {
    let UrlLink = `api/editlosstypemaster`;
    console.log(row);
    let ReqObj = {
      "Categoryid": String(row.Categoryid),
      "InsuranceId": row.InsuranceId,
          "Typeid" : String(row.Typeid)
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
  onAddNewLossType(type,modal) {
    this.open(modal);
    //this.panel=true;
    this.InsertMode = 'Insert';
    this.onCreateFormControl();
    this.onChangeCompanyValue(this.logindata.InsuranceId);
    this.panelOpen = false;
    this.partList = [];
    this.effectiveValue = "";
    this.mandatoryList = [];
    if(type=='primary'){
      this.onChangeLossTypet(1);
      this.panel=true;
    }
    else{
       this.panel=true;
      this.onChangeLossTypet(2);
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
