import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommondataService } from '../../services/commondata.service';
import { ErrorService } from '../../services/errors/error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  @Output() public GetCustomerInfo = new EventEmitter<any>();

  @Input() public createCustomerInfoForm: FormGroup;
  @Input() public assuredName:any;
  @Input() public claimInformation:any;
  public MobileCode:any='';
  public MobileNumber:any='';
  public mobileCodeList:any[]=[];occupationList:any[]=[];
  logindata: any;
  claimRefNo: any;
  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private commondataService: CommondataService,
    private errorService: ErrorService,) {


    console.log(this.createCustomerInfoForm);
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    if(this.logindata){
      this.MobileCode = this.logindata?.MobileCode
      this.MobileNumber = this.logindata?.MobileNumber
    }
    this.onCreateFormControl();

  }



  onCreateFormControl(){
    this.createCustomerInfoForm = this.formBuilder.group({
      Claimrefno: [''],
      CustomerName: [''],
      AssuredName: ['', Validators.required],
      AssuredArabic: [''],
      AssuredGroup: [''],
      CustomerOccupation: ['', Validators.required],
      CustMobCode:[this.MobileCode,Validators.required],
      ContactNo: [this.MobileNumber, Validators.required],
      FaxNo: [''],
      Email: [''],
      Address: [''],
    })
  }

  ngOnInit(): void {
    this.getOccupationList();
    this.getMobileCodeList();

    if(this.claimInformation){
      if(this.claimInformation.Claimrefno){
        this.claimRefNo = this.claimInformation.Claimrefno;
        this.setEditValues();
      }
      else{
        this.claimRefNo = null;
        console.log("Assured Name Received",this.assuredName)
        this.createCustomerInfoForm.controls['AssuredName'].setValue(this.assuredName);
        this.claimInformation = {};
      }
    }
    else{
      console.log("Assured Name Received",this.assuredName)
      this.createCustomerInfoForm.controls['AssuredName'].setValue(this.assuredName);
      this.claimInformation = {};
    }
  }
  setEditValues(){

    this.createCustomerInfoForm.controls['Claimrefno'].setValue(this.claimInformation.Claimrefno);
    this.createCustomerInfoForm.controls['CustomerName'].setValue(this.claimInformation.CustName);
    this.createCustomerInfoForm.controls['AssuredName'].setValue(this.claimInformation.Assuredname);
    this.createCustomerInfoForm.controls['AssuredArabic'].setValue(this.claimInformation.Assuredarabic);
    this.createCustomerInfoForm.controls['AssuredGroup'].setValue(this.claimInformation.Assuredgroup);
    this.createCustomerInfoForm.controls['CustomerOccupation'].setValue(this.claimInformation.Occupation);
    this.createCustomerInfoForm.controls['ContactNo'].setValue(this.claimInformation.Contactno);
    this.createCustomerInfoForm.controls['FaxNo'].setValue(this.claimInformation.Faxno);
    this.createCustomerInfoForm.controls['Email'].setValue(this.claimInformation.Email);
    this.createCustomerInfoForm.controls['Address'].setValue(this.claimInformation.Assuredaddress);
    this.createCustomerInfoForm.controls['CustMobCode'].setValue(this.claimInformation.CustMobCode);
  }
  ongetBackGrid(){
    this.router.navigate(['./Home/ClaimIntimate']);
  }
  getOccupationList(){
    let UrlLink = "api/owneroccupation";
    let ReqObj = {
        "InsuranceId": this.logindata.InsuranceId
    }
    return this.commondataService.onGetClaimList(UrlLink,ReqObj).subscribe((data: any) => {

      console.log("Occupation List",data);
      this.occupationList = data;
    }, (err) => {

      this.handleError(err);
    })
  }
  getMobileCodeList(){
    let UrlLink = `api/mobilecode`;
    return this.commondataService.onGetDropDown(UrlLink).subscribe((data: any) => {
      if(data != null){
        this.mobileCodeList = data;
        if(this.logindata?.UserType == 'user'){
          this.createCustomerInfoForm.controls['CustMobCode'].setValue(this.MobileCode);

        }else{
          this.createCustomerInfoForm.controls['CustMobCode'].setValue(this.claimInformation?.CustMobCode);

        }
      }
    }, (err) => {
      this.handleError(err);
    })
  }

  onCustomerInfoSubmit(){
    this.GetCustomerInfo.emit(this.createCustomerInfoForm.value);

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
