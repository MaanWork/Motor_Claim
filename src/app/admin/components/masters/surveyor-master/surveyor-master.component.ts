import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminService } from 'src/app/admin/admin.service';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import Swal from 'sweetalert2';
export interface DataTableElement {
  AllotedYN: any,
  BranchCode: any,
  CityId: any,
  CityName: any,
  CountryId: any,
  CountryName: any,
  EffectiveDate: any,
  EmailId: any,
  EntryDate: any,
  LoginId: any,
  MobileNo: any,
  Remarks: any,
  Response: any,
  StateId: any,
  StateName: any,
  Status: any,
  SurveyorAddress: any,
  SurveyorId: any,
  SurveyorLicenseNo: any,
  SurveyorName: any,
  WilayatId: any,
  WilayatName: any,
}
@Component({
  selector: 'app-surveyor-master',
  templateUrl: './surveyor-master.component.html',
  styleUrls: ['./surveyor-master.component.css']
})
export class SurveyorMasterComponent implements OnInit {
  public tableData: DataTableElement[];
  public columnHeader: any;
  public SurveyorForm: FormGroup;
  public SurveyorList: any = [];
  public InsertMode: any = 'Insert';
  public InsuranceCmpyList: any;
  public RegionList: any;
  public BranchList: any;
  public InsuCode: any;
  public RegionCode: any;
  public BranchCode: any;
  public panelOpen: boolean = false;

  filteredInsurance: Observable<any[]>;
  filteredRegionList: Observable<any[]>;
  filteredBranchList: Observable<any[]>;
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.onCreateFormControl();
    this.onFetechInitialData();
  }

  onCreateFormControl() {
    this.SurveyorForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      RegionCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],
      BranchCode: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]],

    })


  }
  async onFetechInitialData() {
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    console.log(this.InsuranceCmpyList);
    this.filteredInsurance = this.SurveyorForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'insurance')),
    );

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
    if (dropname == 'branch') {
      return this.BranchList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
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
      this.SurveyorForm.controls['InsuranceId'].setValue(Code.CodeDesc);
      this.RegionList = await this.onGetRegionList(this.InsuCode);
      console.log("Region", this.RegionList);
      this.filteredRegionList = this.SurveyorForm.controls['RegionCode'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'region')),
      );
    }
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
      this.SurveyorForm.controls['RegionCode'].setValue(Code.CodeDesc);
      this.BranchList = await this.onGetBrnchList(this.RegionCode, this.InsuCode);
      console.log(this.BranchList);
      this.filteredBranchList = this.SurveyorForm.controls['BranchCode'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, 'branch')),
      );
    }
  }

  async onGetBrnchList(RegionCode, InsuCode) {
    let UrlLink = `api/branches/${RegionCode}/${InsuCode}`;
    let response = (await this.adminService.onGetMethodAsync(UrlLink)).toPromise()
      .then(res => {

        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  onChangeBranchList(branchCode) {
    let Code = this.BranchList.find((ele: any) => ele.Code == branchCode);
    if (Code) {
      this.BranchCode = branchCode;
      this.SurveyorForm.controls['BranchCode'].setValue(Code.CodeDesc);
      this.onLoadSurveyor();
    }
  }

  async onLoadSurveyor() {
    this.SurveyorList = await this.onGetSurveyorList();
    this.columnHeader = [
      {
        key: "AllotedYN",
        display: "CHOOSE",
        config: {
          isActive: 'Y',
          values: { Y: "Active", N: "Inactive" }
        }
      },
      { key: "SurveyorName", display: "SURVEYOR NAME" },
      { key: "MobileNo", display: "MOBILE NUMBER" },
      { key: "EmailId", display: "EMAIL ID" },
      {
        key: "action",
        display: "ACTION",
        config: {
          isAction: true,
          actions: ["EDIT"]
        }
      }
    ];
    this.tableData = this.SurveyorList;
  }

  async onGetSurveyorList() {

    if (this.InsuCode != "" && this.BranchCode != null && this.RegionCode != undefined) {

      let ReqObj = {
        "InsuranceId": this.InsuCode,
        "BranchCode": this.BranchCode,
        "RegionCode": this.RegionCode,
      }
      let UrlLink = `api/surveyormasterallotedlist`;
      let response = (await this.adminService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
        .then(res => {


          return res;
        })
        .catch((err) => {
          this.handleError(err)
        });
      return response;

    }
  }

  async onActionHandler(row) {
    console.log(row);
    this.router.navigate(['/Home/Admin/SurveyorLogin'])
  }

  onChangeCheckBox(event){
     console.log(event);
     this.onSetActiveDeactive(event)
  }




  onSetActiveDeactive(event){

    var UrlLink;
    var ReqObj;
    if(event.event.checked == true){
      UrlLink = `api/surveyormasterdetails`;
      ReqObj = {
      "BranchCode": this.BranchCode,
          "CityName": event.element?.CityName,
          "CountryName": event.element?.CountryName,
          "EmailId": event.element.EmailId,
          "InsuranceId": this.InsuCode,
          "MobileNo": event.element.MobileNo,
          "RegionCode": this.RegionCode,
          "Remarks": event.element?.Remarks,
          "StateName": event.element?.StateName,
          "SurveyorAddress": event.element?.SurveyorAddress,
          "SurveyorLicenseNo":event.element?.SurveyorLicenseNo,
          "SurveyorName": event.element.SurveyorName,
          "SurveyorId": event.element.SurveyorId

    };
    }
    if(event.event.checked == false){
      ReqObj = {
        "BranchCode": this.BranchCode,
        "InsuranceId": this.InsuCode,
        "RegionCode": this.RegionCode,
        "SurveyorId": event.element.SurveyorId
      }
      UrlLink = "api/deallotsurveyormaster";
    }
    console.log(ReqObj);
    return this.adminService.onPostMethod(UrlLink, ReqObj).subscribe(async (data: any) => {


      console.log(data)
      if(data.Response == 'Success'){
        this.onLoadSurveyor();

        if(event.event.checked == true){
          Swal.fire(
            `Surveyor Marked Successfully`,
            'success',
            'success'
          );
        }  else{
          Swal.fire(
            `Surveyor UnMarked Successfully`,
            'success',
            'success'
          );
        }

      }
      if(data.Errors){
        this.errorService.showValidateError(data.Errors);
    }

    }, (err) => {
      this.handleError(err);
    })
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
