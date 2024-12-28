import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminService } from 'src/app/admin/admin.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
export interface DataTableElement {
  //address1: any,
  //address2: any,
  //address3: any,
  //amendid: any,
  //belongingbranch: any,
  //belongingtype: any,
  branchcode: any,
  branchname: any,
  //branchprefix: any,
  city: any,
  coreappcode: any,
  country: any,
  //currencyabbreviation: any,
  //currencyacronym: null
  //currencydecimaldigit: any,
  //currencydecimalname: any,
  //currencyname: any,
  //decimalplaces: any,
  //deptcode: any,
  //destinationcountryid: any,
  effectivedate: any,
  Status: any,
  //email: any,
  //fax: any,
  //footerimg: any,
  //headerimg: any,
  inscompanyid: any,
  //longitudeyn: any,
  //originationcountryid: any,
  //pckeyclosetrn: any,
 //phone: any,
  regioncode: any,
  remarks: any,
  //signimg: any,
  //stamp: any,
  //tax: any,
}
@Component({
  selector: 'app-branch-master',
  templateUrl: './branch-master.component.html',
  styleUrls: ['./branch-master.component.css']
})
export class BranchMasterComponent implements OnInit {
  public tableData: DataTableElement[];
  public columnHeader: any;
  public BranchForm: FormGroup;
  public BranchFormValue: FormGroup;
  public BranchListGrid: any = [];
  public InsertMode: any = 'Insert';
  public InsuranceCmpyList: any;
  public RegionList: any;
  public BranchList: any;
  public InsuCode: any;
  public RegionCode: any;
  public BranchCode: any;
  public panelOpen: boolean = false;
  filteredCountry: Observable<any[]>;
  closeResult: string;
  effectiveValue:any;
  cityList:any;
  filteredCity: Observable<any[]>;

  filteredInsurance: Observable<any[]>;
  filteredRegionList: Observable<any[]>;
  filteredRegionLists: Observable<any[]>;
  logindata: any;
  minDate: Date;
  countryList:any;
  countryCode: any;
  CityCode: any;
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe:DatePipe,
    private modalService: NgbModal,
  ) {
    this.minDate=new Date();
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
   }

  ngOnInit(): void {
    this.onCreateFormControl();
    this.onFetechInitialData();
  }

  onCreateFormControl() {
    this.BranchForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RegionCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],

    });
    this.BranchFormValue = this.formBuilder.group({
      "branchName": [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      "city": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "coreAppCode": [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      "country": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "insCompanyId": [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      "regionCode": [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      "Status": [{ value: 'Y', disabled: false }, [Validators.required]],
      "branchCode": [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      "remarks": [{ value: '', disabled: false }, [Validators.required,Validators.maxLength(50)]],
    });


  }
       
  //remarks: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
   //tax: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      //signImg: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      //stamp: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
        /*longitudeYn: ['N'],
      originationCountryId: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      pckeyCloseTrn: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      phone: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],*/
     /*address1: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      address2: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      address3: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      amendId: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      belongingBranch: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      belongingType: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      branchCode: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      branchName: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      branchPrefix: [{ value: '', disabled: false }, [Validators.maxLength(50)]],*/
        /*currencyAbbreviation: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      currencyAcronym: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      currencyDecimalDigit: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      currencyDecimalName: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      currencyName: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      decimalPlaces: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      deptCode: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      destinationCountryId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      effectiveDate: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      email: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      exchangeId: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      fax: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      footerImg: [{ value: '', disabled: false }, [Validators.maxLength(50)]],
      headerImg: [{ value: '', disabled: false }, [Validators.maxLength(50)]],*/
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    console.log(this.InsuranceCmpyList);
    this.onChangeCompanyList(this.logindata.InsuranceId);
    //this.onGetBranchListGrid();
    this.getCityList();
    if(this.BranchForm.controls['InsuranceId'].valueChanges){
      this.filteredInsurance = this.BranchForm.controls['InsuranceId'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, 'insurance')),
      );
    }

    if (this.BranchFormValue.controls['insCompanyId'].valueChanges) {
      this.filteredInsurance = this.BranchFormValue.controls['insCompanyId'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, 'insurance')),
      );
    }


  }

  // getCityList(){
  //   let ReqObj = {
  //     "InsuranceId": this.logindata.InsuranceId
  //   }
  //   let UrlLink = `api/citymasterdropdown`;
  //   return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {

  //     this.cityList = data;
  //     this.filteredCity =  this.BranchFormValue.controls['city'].valueChanges.pipe(
  //       startWith(''),
  //       map((value) => this._filter(value, 'city')),
  //     );
  //     this.getCountryList()
  //   }, (err) => {
  //     this.handleError(err);
  //   })
  // }

  /*getCountryList(){
    let ReqObj = {
      "Inscompanyid": String(this.logindata.InsuranceId),
    }
    let UrlLink = `api/newcountrydropdown`;
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (res: any) => {

      this.countryList = res;
      console.log('JJJJJJJJJJJJ',this.countryList);
      this.filteredCountry =  this.BranchFormValue.controls['country'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, 'country')),
      );

      //this.getCityList();
    }, (err) => {
      this.handleError(err);
    })
  }*/
  getCityList() {
    let UrlLink = `api/citymasterdropdown`;
    let ReqObj = {
      "InsuranceId": this.logindata.InsuranceId
      }
    let response = (this.adminService.onPostMethod(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.cityList = res;
        console.log('PPPPPPPPP',res)
            this.filteredCity =  this.BranchFormValue.controls['city'].valueChanges.pipe(
              startWith(''),
              map((value) => this._filter(value, 'city')),
            );
            console.log('MMMMMMMMMMMM',this.filteredCity)
            this.getCountryList();

      //this.getCityList();
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  getCountryList() {
    let UrlLink = `api/newcountrydropdown`;
    let ReqObj = {
      "Inscompanyid": String(this.logindata.InsuranceId),
    }
    let response = (this.adminService.onPostMethod(UrlLink, ReqObj)).toPromise()
      .then(res => {
        this.countryList = res;
      console.log('JJJJJJJJJJJJ',this.countryList);
      this.filteredCountry =  this.BranchFormValue.controls['country'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, 'country')),
      );
      console.log('COUNTRYLIST',this.filteredCountry)

      //this.getCityList();
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
      return this.RegionList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'city') {
      console.log('FFFFFFFFFFF',this.filteredCity)
      return this.cityList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'country') {
      return this.countryList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
    }
  }

  async onChangeCountryValue(CountryCode) {
    console.log('MMMMMMMMM',this.countryList);
    let Code = this.countryList.find((ele: any) => ele.Code== CountryCode);
    if (Code) {
      this.countryCode = Code.Code;
      this.BranchFormValue.controls['country'].setValue(Code.CodeDesc);
    }
  }

  async onChangeCityValue(cityCode) {
     
    console.log('kkkkkkkkkkkkkk',this.cityList);
    let Code = this.cityList.find((ele: any) => ele.Code == cityCode);
    if (Code) {
      this.CityCode = Code.Code;
      this.BranchFormValue.controls['city'].setValue(Code.CodeDesc);
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

  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      this.BranchForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.BranchFormValue.controls['insCompanyId'].setValue(Code.CodeDesc);
      console.log("Setted Company Value",insuranceCode,Code.CodeDesc)
              
      
      this.RegionList = await this.onGetRegionList(this.InsuCode);
      console.log("Region", this.RegionList);
      this.filteredRegionList = this.BranchForm.controls['RegionCode'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, 'region')),
    );
      if(this.BranchFormValue.controls['regionCode'].valueChanges){
        this.filteredRegionLists = this.BranchFormValue.controls['regionCode'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, 'region')),
        );
      }



    }
  }
  

  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/branchchangestatus`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: this.InsuCode,
      Effectivedate:event.data.EffectiveDate,
      BranchCode: event.element.branchcode,
      RegionCode:event.element.regioncode
   
    
    };
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
      }
      else{
        //await this.onLoadCityListGrid();
        //await this.onLoadBranchListGrid();
        this.NewLoadBranch();
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

  async onGetRegionList(Code) {
    let UrlLink = `api/regions/${Code}`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  async onChangeRegionList(regionCode) {
    console.log(regionCode)
    let Code = this.RegionList.find((ele: any) => ele.Code == regionCode);
    if (Code) {
      this.RegionCode = regionCode;
      this.BranchForm.controls['RegionCode'].setValue(Code.CodeDesc);
      this.BranchFormValue.controls['regionCode'].setValue(Code.CodeDesc);
      this.NewLoadBranch()
     
      //this.NewLoadBranch(this.RegionCode)
      //this.onLoadBranchListGrid();

    }
  }

  NewLoadBranch(){
    let UrlLink = `api/getallbranchlist`;
    let ReqObj = {
      "RegionCode": this.RegionCode,
      "InsuranceId": "100002"
    }
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
    //let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
    if (data) {
      this.BranchListGrid=data;
      console.log('jjjjjjjjjjjjjjjj',this.BranchListGrid);
      this.onLoadBranchListGrid();
    }
    else{

      //await this.onLoadCityListGrid();
      
    }

  }, (err) => {
    this.handleError(err);
  })
}


  async onLoadBranchListGrid() {
    //this.BranchListGrid = await this.onGetBranchListGrid();
       
     //this.NewLoadBranch(this.RegionCode)
     this.tableData = null;
    this.columnHeader = [
    
      { key: "branchname", display: "BRANCH NAME" },
      //{ key: "email", display: "EMAIL ID" },
      { key: "effectivedate", display: "EFFECTIVE DATE" },

      {
        key: "action",
        display: "ACTION",
        config: {
          isAction: true,
          actions: ["EDIT"]
        }
      },
      {
        key: "status",
        display: "STATUS",
        config: {
          isStatus: 'Y',
          values: { Y: "Active", N: "Inactive" }
        }
      }
    ];
    this.tableData = this.BranchListGrid;
  }

  async onGetBranchListGrid() {

    if (this.InsuCode != "" && this.RegionCode != undefined) {

      let UrlLink = `api/getallbranchmaster`;
      let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
        .then(res => {


          return res;
        })
        .catch((err) => {
          this.handleError(err)
        });
      return response;

    }
  }

  async onActionHandler(row,modal) {
    this.open(modal);
    console.log(row);
    this.onEditBranchListGrid(row)
  }

  async onEditBranchListGrid(row) {
    var BranchEditDetails: any = await this.onBranchEditDetails(row);

    if (BranchEditDetails) {

      this.panelOpen = true;
      this.InsertMode = 'Update';
      //this.BranchFormValue.controls['address1'].setValue(BranchEditDetails.address1);
      //this.BranchFormValue.controls['address2'].setValue(BranchEditDetails.address2);
      //this.BranchFormValue.controls['address3'].setValue(BranchEditDetails.address3);
      //this.BranchFormValue.controls['amendId'].setValue(BranchEditDetails.amendId);
      //this.BranchFormValue.controls['belongingBranch'].setValue(BranchEditDetails.belongingBranch);
      //this.BranchFormValue.controls['belongingType'].setValue(BranchEditDetails.belongingType);
      this.BranchFormValue.controls['branchCode'].setValue(BranchEditDetails.branchCode);
      this.BranchFormValue.controls['branchName'].setValue(BranchEditDetails.branchName);
     // this.BranchFormValue.controls['branchPrefix'].setValue(BranchEditDetails.branchPrefix);
      this.BranchFormValue.controls['city'].setValue(BranchEditDetails.city);
      this.BranchFormValue.controls['coreAppCode'].setValue(BranchEditDetails.coreAppCode);
      this.BranchFormValue.controls['country'].setValue(BranchEditDetails.country);
      //this.BranchFormValue.controls['currencyAbbreviation'].setValue(BranchEditDetails.currencyAbbreviation);
      //this.BranchFormValue.controls['currencyAcronym'].setValue(BranchEditDetails.currencyAcronym);
      //this.BranchFormValue.controls['currencyDecimalDigit'].setValue(BranchEditDetails.currencyDecimalDigit);
      //this.BranchFormValue.controls['currencyDecimalName'].setValue(BranchEditDetails.currencyDecimalName);
      //this.BranchFormValue.controls['currencyName'].setValue(BranchEditDetails.currencyName);
      //this.BranchFormValue.controls['decimalPlaces'].setValue(BranchEditDetails.decimalPlaces);
      //this.BranchFormValue.controls['deptCode'].setValue(BranchEditDetails.deptCode);
      //this.BranchFormValue.controls['destinationCountryId'].setValue(BranchEditDetails.destinationCountryId);
      this.effectiveValue = this.onDateFormatInEdit(BranchEditDetails.effectiveDate);
      //this.BranchFormValue.controls['effectiveDate'].setValue(BranchEditDetails.effectiveDate);
      //this.BranchFormValue.controls['email'].setValue(BranchEditDetails.email);
      //this.BranchFormValue.controls['exchangeId'].setValue(BranchEditDetails.exchangeId);
      //this.BranchFormValue.controls['fax'].setValue(BranchEditDetails.fax);
      //this.BranchFormValue.controls['footerImg'].setValue(BranchEditDetails.footerImg);
      //this.BranchFormValue.controls['headerImg'].setValue(BranchEditDetails.headerImg);
      this.onChangeCompanyList(BranchEditDetails.insCompanyId);
      //this.BranchFormValue.controls['longitudeYn'].setValue(BranchEditDetails.longitudeYn);
      //this.BranchFormValue.controls['originationCountryId'].setValue(BranchEditDetails.originationCountryId);
      //this.BranchFormValue.controls['pckeyCloseTrn'].setValue(BranchEditDetails.pckeyCloseTrn);
      //this.BranchFormValue.controls['phone'].setValue(BranchEditDetails.phone);
      this.onChangeRegionList(BranchEditDetails.regionCode);
      this.BranchFormValue.controls['regionCode'].disable();
      this.BranchFormValue.controls['remarks'].setValue(BranchEditDetails.remarks);
      //this.BranchFormValue.controls['tax'].setValue(BranchEditDetails.tax);
      this.BranchFormValue.controls['Status'].setValue(BranchEditDetails.status);

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
  async onBranchEditDetails(row) {
    let UrlLink = `api/branchmasterbybranchcode`;
    let ReqObj = {
      "branchcode": row.branchcode,
      "regioncode": row.regioncode,
      "inscompanyid": String(row.inscompanyid)
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

  onSaveBranchDetials(modal) {
    let effectiveDate:any;
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let UrlLink = `api/insertbranchmaster`;
    this.BranchFormValue.controls['insCompanyId'].setValue(this.InsuCode);
    //this.BranchFormValue.controls['regionCode'].setValue(this.RegionCode);

    //let ReqObj = {...this.BranchFormValue.value,"Mode": this.InsertMode,"EffectiveDate":effectiveDate};
    let ReqObj = {
      "BranchCode":   this.BranchFormValue.controls['branchCode'].value,
    "RegionCode":  this.RegionCode, //this.BranchFormValue.controls['regionCode'].value,
    "InsuranceId":  this.BranchFormValue.controls['insCompanyId'].value,
    "Branchname": this.BranchFormValue.controls['branchName'].value,
    "City": this.BranchFormValue.controls['city'].value,
    "Country": this.BranchFormValue.controls['country'].value,
    "Coreappcode":this.BranchFormValue.controls['coreAppCode'].value,
    "Status":this.BranchFormValue.controls['Status'].value,
    "Effectivedate": effectiveDate,
    "Remarks": this.BranchFormValue.controls['remarks'].value,
    };
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {
      if (data.Response == "Inserted Successfully") {
        //this.BranchListGrid = await this.onGetBranchListGrid();
        //this.BranchListGrid = await this.NewLoadBranch()
        this.NewLoadBranch();
        this.onLoadBranchListGrid();
        //this.panelOpen = false;
        Swal.fire(
          `Branch Created Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#branchmodal").hide();
      }
      if (data.Response == "Updated Successfully") {
        //this.BranchListGrid = await this.onGetBranchListGrid();
        this.NewLoadBranch()
        //this.onLoadBranchListGrid();
        //this.panelOpen = false;
        Swal.fire(
          `Branch Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#branchmodal").hide();
      }
      if (data.Errors) {
        this.errorService.showValidateError(data.Errors);
        for (let index = 0; index < data.Errors.length; index++) {
          const element:any = data.Errors[index];
        this.BranchFormValue.controls[element.Field].setErrors({message: element.Message });

        }

      }


    }, (err) => {
      this.handleError(err);
    })
  }

  onAddNewBranch(modal) {
    this.open(modal)
    this.InsertMode = 'Insert';
    this.BranchFormValue.controls['city'].reset();
    this.BranchFormValue.controls['coreAppCode'].reset();
    this.BranchFormValue.controls['country'].reset();
    this.BranchFormValue.controls['branchName'].reset();
    this.BranchFormValue.controls['remarks'].reset();
    this.BranchFormValue.controls['regionCode'].disable();
    //this.BranchFormValue.controls['Status'].setValue("");
    //this.onCreateFormControl();

    //this.BranchFormValue.reset();
    
    this.onFetechInitialData();

    this.effectiveValue="";

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
