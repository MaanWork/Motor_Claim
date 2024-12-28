import { Component, OnInit, NgZone, ViewChild, ElementRef, OnChanges, AfterViewInit, SimpleChanges, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AdminService } from 'src/app/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MapsAPILoader } from '@agm/core';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { DomSanitizer } from '@angular/platform-browser';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
declare var $:any;
export interface DataTableElement {
  EntryDate: any,
  ExpiryDate: any,
  InsAddress: any,
  InsCity: any,
  InsCoreAppcode: any,
  InsCountry: any,
  InsEmail: any,
  InsImageLogo: any,
  InsName: any,
  InsPhone: any,
  InsRegionCode: any,
  InsWebsite: any,
  InsZipcode: any,
  InsuranceId: any,
  Remarks: any,
  SaveStatus: any,
  Status: any,
}
@Component({
  selector: 'app-insurance-cmpy-master',
  templateUrl: './insurance-cmpy-master.component.html',
  styleUrls: ['./insurance-cmpy-master.component.css']
})
export class InsuranceCmpyMasterComponent implements OnInit,OnChanges,AfterViewInit,OnDestroy {
  logindata: any;
  InsuranceListForm: FormGroup;
  FormGroupData: FormGroup;
  filteredInsurance: Observable<any[]>;
  filteredCountry: Observable<any[]>;
  filteredCity: Observable<any[]>;
  InsuranceCmpyList: any=[];
  InsuCode: any;
  insuranceList: any=[];
  tableData:DataTableElement[];
  panelOpen: boolean = true;
  columnHeader:any;
  closeResult: string;
  public latitude:number;
  public longitude:number;
  public zoom:number=5;
  public mapClickListener: any;
  public LossInformation:any;
  private geoCoder;effectiveValue:any="";
  countryCode:any="";CityCode:any="";
  @ViewChild("search")
  public searchElementRef: ElementRef;countryList:any[]=[];
  cityList:any[]=[];
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: any;
  minDate: Date;
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private datePipe:DatePipe,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _sanitizer: DomSanitizer,
    private lossService:LossService,
    private modalService: NgbModal,
  ) {
    this.minDate = new Date();
   }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.onCreateFormControl();
    this.onFetechInitialData();
    this.InsuranceListForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    });

  }
  public ngAfterViewInit(){
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 5;
        });
      });
    });
  }
  public ngOnDestroy(): void {

    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }
  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({
      "InsuranceId":['', [Validators.required]],
      "InsAddress": ['', [Validators.required]],
      "InsCity": ['', [Validators.required]],
      "InsCoreAppcode": ['', [Validators.required]],
      "InsCountry": ['', [Validators.required]],
      "InsEmail": ['', [Validators.required]],
      "InsImageLogo": [''],
      "InsName": ['', [Validators.required]],
      "InsPhone": ['', [Validators.required]],
      "InsRegionCode": ['', [Validators.required]],
      "InsWebsite": [''],
      "InsZipcode": ['', [Validators.required]],
      "Remarks": ['', [Validators.required]],
       "ExpiryDate": ['', [Validators.required]],
       "Status": ['Y', [Validators.required]],
       "Lattitude": ['', [Validators.required]],
       "Longitude": ['', [Validators.required]],
       "InsId":['']
    })
  }
  async onFetechInitialData(){
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.InsuranceListForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance")),
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
  mapLoader(){

  }
  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      this.ngZone.run(() => {
        // Here we can get correct event
        this.latitude = e.latLng.lat();
        this.longitude = e.latLng.lng();
        this.zoom = 5;
        console.log(this.latitude,this.longitude);
        this.FormGroupData.controls['Lattitude'].setValue(this.latitude);
        this.FormGroupData.controls['Longitude'].setValue(this.longitude);

      });
    });
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log(this.latitude,this.longitude);
        console.log("Latitude Value",this.FormGroupData.controls['Lattitude'].value)
        this.zoom = 5;
        if(this.FormGroupData.controls['Lattitude'].value == null || this.FormGroupData.controls['Longitude'].value == null || this.FormGroupData.controls['Lattitude'].value == "" || this.FormGroupData.controls['Longitude'].value == ""){
          this.FormGroupData.controls['Lattitude'].setValue(this.latitude);
          this.FormGroupData.controls['Longitude'].setValue(this.longitude);
        }

      });

    }
  }
  async onChangeCityValue(cityCode) {
    let Code = this.cityList.find((ele: any) => ele.Sno == cityCode);
    if (Code) {
      this.CityCode = Code.Sno;
      this.FormGroupData.controls['InsCity'].setValue(Code.City);
    }
  }
  async onChangeCountryValue(CountryCode) {
    let Code = this.countryList.find((ele: any) => ele.Countryid == CountryCode);
    if (Code) {
      this.countryCode = Code.Countryid;
      this.FormGroupData.controls['InsCountry'].setValue(Code.Countryname);
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
  async onActionHandler(row,modal) {
    console.log(row);
      this.open(modal)
    let UrlLink = "api/inscomdetails/"+String(row.InsuranceId);

    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
    .then(res => {
      this.onEditInsuranceData(res);

    })
    .catch((err) => {
      this.handleError(err)
      });
      return response;
  }
  onEditInsuranceData(userData){
    if(userData){
      console.log("Edit Values",userData);
      this.effectiveValue = this.onDateFormatInEdit(userData.Effectivedate);
      this.FormGroupData.controls['ExpiryDate'].setValue(userData.ExpiryDate);
      this.FormGroupData.controls['InsAddress'].setValue(userData.InsAddress);
      this.onChangeCountryValue(userData.InsCountry);
      this.onChangeCityValue(userData.InsCity);
      this.FormGroupData.controls['InsId'].setValue(userData.InsuranceId);
      //this.FormGroupData.controls['InsCity'].setValue(userData.InsCity);
      this.FormGroupData.controls['InsCoreAppcode'].setValue(userData.InsCoreAppcode);
      //this.FormGroupData.controls['InsCountry'].setValue();
      this.FormGroupData.controls['InsEmail'].setValue(userData.InsEmail);
      this.FormGroupData.controls['InsImageLogo'].setValue(userData.InsImageLogo);
      this.FormGroupData.controls['InsName'].setValue(userData.InsName);
      this.FormGroupData.controls['InsPhone'].setValue(userData.InsPhone);
      this.FormGroupData.controls['InsRegionCode'].setValue(userData.InsRegionCode);
      this.FormGroupData.controls['InsWebsite'].setValue(userData.InsWebsite);
      this.FormGroupData.controls['InsZipcode'].setValue(userData.InsZipcode);
      this.FormGroupData.controls['InsuranceId'].setValue(userData.InsuranceId);
      this.FormGroupData.controls['Lattitude'].setValue(userData.Lattitude);
      this.FormGroupData.controls['Longitude'].setValue(userData.Longitude);
      this.FormGroupData.controls['Remarks'].setValue(userData.Remarks);
      this.FormGroupData.controls['Status'].setValue(userData.Status);
      this.panelOpen = false;
    }

  }
  async onChangeCompanyList(insuranceCode) {
    this.tableData = null;
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      this.InsuranceListForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.insuranceList = await this.getAllInsuranceList();
      console.log("REcevied All insurance List",this.insuranceList);
      this.tableData = this.insuranceList;
      this.columnHeader = [
      
        { key: "InsName", display: "COMPANY NAME" },
        { key: "InsAddress", display: "ADDRESS" },
        { key: "InsEmail", display: "EMAIL" },
        {key:"Effectivedate",display: "Effective Date" },
        //{key:"InsCity",display: "City" },
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
        }
      ];
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
      this.filteredCountry =  this.FormGroupData.controls['InsCountry'].valueChanges.pipe(
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
      this.filteredCity =  this.FormGroupData.controls['InsCity'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, 'city')),
      );
    }, (err) => {
      this.handleError(err);
    })
  }
  onSaveCompanyDetials(modal) {

    let UrlLink = `api/inscomdetails`;
    let effectiveDate:any;
    // if(product == null || product == "" || product == undefined){
    //   product = "66";
    // }
    if (this.effectiveValue != '' && this.effectiveValue != null && this.effectiveValue != undefined) {
      effectiveDate =  this.datePipe.transform(this.effectiveValue, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
    let ReqObj = {
      "InsuranceId": this.FormGroupData.controls['InsId'].value,
      //this.InsuranceListForm.controls['InsuranceId'].value,
      "InsAddress": this.FormGroupData.controls['InsAddress'].value,
      "InsCity": this.CityCode,
      "InsCoreAppcode": this.FormGroupData.controls['InsCoreAppcode'].value,
      "InsCountry": this.countryCode,
      "InsEmail": this.FormGroupData.controls['InsEmail'].value,
      "InsImageLogo": this.FormGroupData.controls['InsImageLogo'].value,
      "InsName": this.FormGroupData.controls['InsName'].value,
      "InsPhone": this.FormGroupData.controls['InsPhone'].value,
      "InsRegionCode": this.FormGroupData.controls['InsRegionCode'].value,
      "InsWebsite":this.FormGroupData.controls['InsWebsite'].value,
      "InsZipcode": this.FormGroupData.controls['InsZipcode'].value,
      "Remarks": this.FormGroupData.controls['Remarks'].value,
      "ExpiryDate": this.FormGroupData.controls['ExpiryDate'].value,
      "Status": this.FormGroupData.controls['Status'].value,
      "Lattitude": this.FormGroupData.controls['Lattitude'].value,
      "Longitude": this.FormGroupData.controls['Longitude'].value,
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
        await this.getAllInsuranceList();
        await this.onFetechInitialData();
        this.panelOpen = true;
        Swal.fire(
          `Insurance Company Details Created/Updated Successfully`,
          'success',
          'success'
        );
        modal.dismiss('Cross click');
        $("#insumodal").hide();

      }

    }, (err) => {
      this.handleError(err);
    })
  }
  
  onstatus(event){
    console.log('EEEEEEEE',event);
    let UrlLink = `api/companychangestatus`;
    let ReqObj = {
      Status:event.data.Status,
      InsuranceId: event.element.InsuranceId,
      //RegionCode:event.element.Regioncode,
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
  async getAllInsuranceList(){
    let UrlLink = `api/getallinsurancecompanymaster`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }
  onAddNew(modal) {
    this.open(modal)
      this.onCreateFormControl();
      this.onFetechInitialData();
      this.effectiveValue="";
    //this.panelOpen = false;
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
    if (dropname == 'country') {
      return this.countryList.filter((option) => option?.Countryname?.toLowerCase().includes(filterValue));
    }
    if (dropname == 'city') {
      console.log("City List",filterValue);
      return this.cityList.filter((option) => option?.City?.includes(filterValue));
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
