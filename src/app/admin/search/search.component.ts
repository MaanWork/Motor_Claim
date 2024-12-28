declare var $:any;
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { AdminService } from '../admin.service';
import *  as  Mydatas from '../../appConfig.json';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  TableData:any=[];
  ClaimDetails:any[]=[];
  ClaimLossDetails:any[]=[];
  Claim_Details:any=[];
  RowTableData:any;
  claimdata:any;
  norecordData:any='';
  booleansection:boolean=false;

  Policy_Number:any;
  subtable:boolean=false;
  ChevronDown:boolean=false;
  ChevronUp:boolean=true;
  tableshow:boolean=false;
  searchBy: any = '';
  searchValue: any;
  public panelOpen: boolean = true;
  PolicyChassisForm:FormGroup;
  InsuranceCmpyList: any=[];
  InsuCode: any;
  logindata: any;
  closeResult: string;
  filteredInsurance: Observable<any[]>;
  filteredInsuranceComp: Observable<any[]>;
  PolicyChassisNoTable:boolean=false;
  ClaimDetailsValue:boolean=false;
  //CLAIM NUMBER SEARCH SECTION
  PolicyNumberClaim:any='';
  AssuredName:any='';
  ClaimNo:any='';
  Accidentdate:any='';
  CreatedBy:any='';
  Claimrefno:any='';
  AssignedDate:any='';
  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService,
    private errorService: ErrorService,private modalService: NgbModal){
      if (!localStorage.getItem('foo')) { 
        localStorage.setItem('foo', 'no reload') 
        location.reload() 
      } else {
        localStorage.removeItem('foo') 
      }
        // let reload = sessionStorage.getItem('adminSearchLoad');
        // if(reload==undefined){
        //   sessionStorage.setItem('adminSearchLoad','load');
        //   window.location.reload();
        // }
    }

  ngOnInit(): void {
    //$(".Data").css("display", "none");
    $(".dataone").hide();
     $(".Data").hide();
    this.onFetechInitialData();
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.PolicyChassisForm = this.formBuilder.group({
      InsuranceId: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]]
    }); 
  }

  htmlcard(modal:any,rowdata:any,index:any){
    this.RowTableData=rowdata;
    this.open(modal,rowdata);
    console.log(this.RowTableData);
  }
  open(content:any,data:any) {
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
  //Search Details API
  onSearchDetails(){
    let ReqObj={};
    let UrlLink='';
    if (this.searchBy == 'Policy Number'){
      UrlLink = "api/get/policyDetails";
      ReqObj = {
        "QuotationPolicyNo":this.searchValue,
        "InsuranceId": this.logindata.InsuranceId
      }
    }
    if(this.searchBy == 'Chassis Number'){
      UrlLink = "api/get/chassissearch";
      ReqObj = {
        "ChassisNo":this.searchValue,
        "InsuranceId": this.logindata.InsuranceId
      }
    }
    if(this.searchBy == 'Claim Number'){
      UrlLink = "api/cliamrefnobycalimno";
      ReqObj = {
        "ClaimNo":this.searchValue
      }
    }
    if(this.searchBy == 'Claim Reference Number'){
      UrlLink = "api/getbycliamrefno";
      ReqObj = {
        "Claimrefno":this.searchValue
      }
    }
     return this.adminService.onPostMethod(UrlLink,ReqObj).subscribe((data:any)=>{
      if(data){
        if(this.searchBy == 'Policy Number' || this.searchBy == 'Chassis Number'){
          $(".dataone").hide();
          $(".Data").show();
          this.TableData=data;
         
        }
        if(this.searchBy == 'Claim Number' || this.searchBy == 'Claim Reference Number'){
          $(".Data").hide();
          $(".dataone").show();
          $(".subTable").hide();
          this.claimdata=data;
          this.PolicyNumberClaim=data?.PolicyNo;
          this.AssuredName=data?.Assuredname;
          this.ClaimNo=data?.ClaimNo;
          this.Accidentdate=data?.Accidentdate;
          this.CreatedBy=data?.CreatedBy;
          this.Claimrefno=data?.Claimrefno;
          this.AssignedDate=data?.AssignedDate;
          console.log("**Data",this.claimdata);
        }
        console.log("**Data",data);
        console.log("this.PolicyNumberClaim",this.PolicyNumberClaim);
      
      }
    })
  }
  //ClaimDetails For Policy && Chassis Number
  ClaimDetailsPolicychassis(rowdata:any,index:any){
    this.ClaimDetails=[];
    console.log("ROWdata",rowdata);
    let UrlLink = "api/claimdetailsbypolicynoandchassissno";
    let ReqObj = {
      "ChassisNo":rowdata?.VehicleInfo?.ChassisNo,
      "PolicyNo":rowdata?.PolicyInfo?.PolicyNo,
      "InsuranceId":this.logindata.InsuranceId
    }
    $(".subTable").toggle();
    this.adminService.onPostMethod(UrlLink,ReqObj).subscribe((data:any)=>{
      this.ClaimDetails=[];
      if(data){
        this.ClaimDetails=[];
        console.log("ClaimDetailsPolicyChassisNumber",data);
        this.ClaimDetails=data;
      }
    })
  }
  claimlosstable(rowdata:any,index:any){
    this.ClaimDetails=[];
    console.log("ROWdata",rowdata);
    $(".subTable").toggle();
  }
  //ClaimLoss Details By ClaimNumber
  claimlossdetailsbyclaimno(rowdata:any,modal:any,index:any){
    console.log("RowDataClaim",rowdata);
    let UrlLink = "api/claimlossdetailsbyclaimno";
    let ReqObj = {
      "ClaimNo":rowdata.ClaimNo
    }
    this.adminService.onPostMethod(UrlLink,ReqObj).subscribe((data:any)=>{
      if(data){
        this.open(modal,rowdata);
        console.log("claimlossdetailsbyclaimno",data);
        this.ClaimLossDetails=data;
      }
    })
  }
  //ClaimDetails
  claimDetails(claim_No:any,modal:any){
    let UrlLink = "api/claimlossdetailsbyclaimno";
    let ReqObj = {
      "ClaimNo":this.ClaimNo
    }
    this.adminService.onPostMethod(UrlLink,ReqObj).subscribe((data:any)=>{
      if(data){
        this.open(modal,claim_No);
        console.log("claimlossdetailsbyclaimno",data);
        this.Claim_Details=data;
      }
      if(data?.Errors[0]?.Code == '01'){
        this.booleansection=true;
        this.norecordData='Claim Loss Not Available';
      }
    })
  }
  async onChangeCompanyList(insuranceCode) {
    let Code = this.InsuranceCmpyList.find((ele: any) => ele.Code == insuranceCode);
    if (Code) {
      this.InsuCode = insuranceCode;
      this.PolicyChassisForm.controls['InsuranceId'].setValue(Code.CodeDesc);
    }
  }
  onClearDetails(){
    this.searchValue='';
    this.searchBy='';
    $(".Data").hide();
    $(".dataone").hide();
    $(".subTable").hide();
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
  async onFetechInitialData(){
    this.InsuranceCmpyList = await this.onInsuranceCompanyList();
    this.onChangeCompanyList(this.logindata.InsuranceId);
    this.filteredInsurance = this.PolicyChassisForm.controls['InsuranceId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value,"insurance")),
    );
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
}
