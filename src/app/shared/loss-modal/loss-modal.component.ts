import { ClaimjourneyService } from '../../commonmodule/claimjourney/claimjourney.service';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { PolicyService } from '../../commonmodule/policy/policy.service';
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, Inject } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatusUpdateComponent } from 'src/app/shared/lossinfocomponent/status-update/status-update.component';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-loss-modal',
  templateUrl: './loss-modal.component.html',
  styleUrls: ['./loss-modal.component.css']
})
export class LossModalComponent implements OnInit, OnDestroy {
  public LossTypeId: any;
  public LossTypeDes: any;
  public LossTypeList: any;
  public logindata: any;
  public claimDetails: any;
  public PolicyInformation: any
  public LossInformation: any;
  public LossDetails: any;
  public lossDriverInformation: any;
  public DocumentReasonList: any = [];
  public VatYN:any="N";
  public primaryLossFrom: FormGroup;
  public isDisabled: boolean = true;
  public DamagePoints: any;


  private subscription = new Subscription();
  // @Output() StatusUpdated = new EventEmitter<any>();
  private StatusUpdated: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  subLossTypeId: any;

  WhoView:any='LossSide'
  panelOpen: boolean = false;
  totalAmount: any;
  garageYN: any;
  approverName: any;

  constructor(
    private policyService: PolicyService,
    private lossService: LossService,
    private claimjourneyService: ClaimjourneyService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<LossModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    this.VatYN = 'N';
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.LossDetails = JSON.parse(sessionStorage.getItem("LossDetails"));
    this.LossInformation = this.data.MylossData;
    this.garageYN = this.LossInformation?.GarageYn;
    this.approverName = this.LossDetails?.AllocatedBy
    if(this.garageYN==undefined || this.garageYN==null) this.garageYN = 'N';
    console.log("Loss Information",this.LossInformation);
    this.LossTypeDes = this.LossInformation.Losstypedescp;
    this.subscription = this.claimjourneyService.getpolicyInfo.subscribe(async (event: any) => {
      this.PolicyInformation = event;
    });

    this.subscription = this.lossService.getLossType.subscribe(async (event: any) => {
      this.LossTypeList = event;

    });
    this.subscription = this.lossService.getdocumentReasonList.subscribe((event: any) => {
      this.DocumentReasonList = event;
      if (event == null) {
        this.DocumentReasonList = [];
      }
    })

    this.subscription = this.lossService.getClaimIntimateval.subscribe((event: any) => {
      this.lossDriverInformation = event;

    });

  }

  ngOnInit(): void {

    let allLossType = [...this.LossTypeList.Primary, ...this.LossTypeList.Secondary];
    let findId = allLossType.find((ele: any) => ele.Code == this.LossInformation.LosstypeId);

    if (findId != undefined) {
      this.LossTypeId = findId.TypeId;
      this.subLossTypeId = findId.Code;
    }

    if (this.logindata?.UserType == "claimofficer") {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
    this.createFromControl();
    this.onBindingLossValues();
    this.primaryLossFrom.controls['LabourCost'].setValue(Number(this.primaryLossFrom.controls['TotalLabourHours'].value * this.primaryLossFrom.controls['LabourCostPerHour'].value));

  }



  createFromControl() {
    this.primaryLossFrom = this.formBuilder.group({
      Latitude: [{ value: '', disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      Longitude: [{ value: '', disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      YoungAgeDriver: [{ value: 0, disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      SparePartsCost: [{ value: 0, disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      Consumables: [{ value: 0, disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      TotalLabourHours: [{ value: 0, disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      LabourCostPerHour: [{ value: 0, disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      LabourCost: [{ value: 0, disabled: true }, [Validators.required, Validators.maxLength(50)]],
      LessBetterment: [{ value: 0, disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      LessExcess: [{ value: 0, disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      UnderInsurance: [{ value: 0, disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      SalvageAmount: [{ value: 0, disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      DriverName: [{ value: '', disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      Gender: [{ value: '', disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      Email: [{ value: '', disabled: this.isDisabled }],
      LicenseExpiryDate: [{ value: '', disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      Address: [{ value: '', disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      Dob: [{ value: '', disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      MobileNo: [{ value: '', disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      MobileCode: [{ value: '', disabled: this.isDisabled }],
      LicenseNo: [{ value: '', disabled: this.isDisabled }, [Validators.required, Validators.maxLength(50)]],
      Nationality: [{ value: '215', disabled: this.isDisabled }],
    })
  }

  onDateFormatInEdit(date) {
    if (date) {
      let format = date.split('/');
      var NewDate = new Date(new Date(format[2], format[1], format[0]));
      NewDate.setMonth(NewDate.getMonth() - 1);
      return NewDate;
    }
  }

  onBindingLossValues() {
    this.primaryLossFrom.controls['Latitude'].setValue(this.LossInformation.IncidentLatitudeLongitude);
    this.primaryLossFrom.controls['Longitude'].setValue(this.LossInformation.IncidentLocationLongitude);
    this.DamagePoints = this.LossInformation.SectionIds;
    this.primaryLossFrom.controls['SparePartsCost'].setValue(this.LossInformation.SparepartsCost);
    this.primaryLossFrom.controls['YoungAgeDriver'].setValue(this.LossInformation.YoungAgeDriver);
    this.primaryLossFrom.controls['TotalLabourHours'].setValue(this.LossInformation.TotalLabourHour);
    this.primaryLossFrom.controls['LabourCostPerHour'].setValue(this.LossInformation.PerHourLabourCost),
      this.primaryLossFrom.controls['LabourCost'].setValue(Number(this.LossInformation.TotalLabourHour * this.LossInformation.PerHourLabourCost))
    this.primaryLossFrom.controls['SalvageAmount'].setValue(this.LossInformation.SalvageAmount);
    this.primaryLossFrom.controls['Consumables'].setValue(this.LossInformation.ConsumablesCost),
      this.primaryLossFrom.controls['LessBetterment'].setValue(this.LossInformation.LessBetterment),
      this.primaryLossFrom.controls['LessExcess'].setValue(this.LossInformation.LessExcess),
      this.primaryLossFrom.controls['UnderInsurance'].setValue(this.LossInformation.UnderInsurance);
      if(this.LossInformation.VatYn!=null){
        this.totalAmount = this.LossInformation.TotalPayable;
        this.VatYN = this.LossInformation.VatYn;
      }
      this.onSetDriverDetails();

  }

  getDamageListValues(event) {
    this.primaryLossFrom.controls['LessBetterment'].setValue(event.TotalLessBetterment);
    this.primaryLossFrom.controls['SparePartsCost'].setValue(event.TotalSparePartsCost);
    this.primaryLossFrom.controls['TotalLabourHours'].setValue(event.TotalNoOfHours);
    this.primaryLossFrom.controls['SalvageAmount'].setValue(event.TotalSalvageAmount);
  }

  onSetDriverDetails() {
    if (this.LossInformation.DriverName != null) {
      this.primaryLossFrom.controls['DriverName'].setValue(this.LossInformation.DriverName);

    }
    else {
      this.primaryLossFrom.controls['DriverName'].setValue(this.lossDriverInformation.Drivername);

    }

    if (this.LossInformation.DriverGender != null) {
      this.primaryLossFrom.controls['Gender'].setValue(this.LossInformation.DriverGender);

    }
    else {
      this.primaryLossFrom.controls['Gender'].setValue(this.lossDriverInformation.Drivergender);

    }
    if (this.LossInformation.DriverEmailId != null) {
      this.primaryLossFrom.controls['Email'].setValue(this.LossInformation.DriverEmailId);

    }
    else {
      this.primaryLossFrom.controls['Email'].setValue(this.lossDriverInformation.Driveremailid);

    }

    if (this.LossInformation.DriverLicenseExpiryDate != null) {
      this.primaryLossFrom.controls['LicenseExpiryDate'].setValue(this.LossInformation.DriverLicenseExpiryDate == null ? '' : this.onDateFormatInEdit(this.LossInformation.DriverLicenseExpiryDate));

    }
    else {
      this.primaryLossFrom.controls['LicenseExpiryDate'].setValue(this.lossDriverInformation.Licenceexpirydate == null ? '' : this.onDateFormatInEdit(this.lossDriverInformation.Licenceexpirydate));

    }

    if (this.LossInformation.Address != null) {
      this.primaryLossFrom.controls['Address'].setValue(this.LossInformation.Address);

    }
    else {
      this.primaryLossFrom.controls['Address'].setValue(this.lossDriverInformation.Driveraddress);

    }
    if (this.LossInformation.DriverDob != null) {
      this.primaryLossFrom.controls['Dob'].setValue(this.LossInformation.DriverDob == null ? '' : this.onDateFormatInEdit(this.LossInformation.DriverDob));

    }
    else {
      this.primaryLossFrom.controls['Dob'].setValue(this.lossDriverInformation.Driverdob == null ? '' : this.onDateFormatInEdit(this.lossDriverInformation.Driverdob));

    }
    if (this.LossInformation.DriverMobile != null) {
      this.primaryLossFrom.controls['MobileNo'].setValue(this.LossInformation.DriverMobile);

    }
    else {
      this.primaryLossFrom.controls['MobileNo'].setValue(this.lossDriverInformation.Drivermobile);

    }
    if (this.LossInformation.DriverMobileCode != null) {
      this.primaryLossFrom.controls['MobileCode'].setValue(this.LossInformation.DriverMobileCode);

    }
    else {
      this.primaryLossFrom.controls['MobileCode'].setValue(this.lossDriverInformation.Mobilecode);

    }
    if (this.LossInformation.DriverLicenseNo != null) {
      this.primaryLossFrom.controls['LicenseNo'].setValue(this.LossInformation.DriverLicenseNo);

    }
    else {
      this.primaryLossFrom.controls['LicenseNo'].setValue(this.lossDriverInformation.Licenseno);

    }
    if (this.LossInformation.Nationality != null) {
      this.primaryLossFrom.controls['Nationality'].setValue(this.LossInformation.Nationality);

    }
    else {
      this.primaryLossFrom.controls['Nationality'].setValue(this.lossDriverInformation.Nationality);

    }
  }
  ConvertToInt(val) {
    if (val == '' || val == null) {
      return 0;
    }
    return parseInt(val);
  }

  saveLossDetails(event) {
    let Subusertype=this.logindata.SubUserType;
    if(Subusertype=='Approver'){
      this.onStatusUpdate();
    }
    else{
      if(this.primaryLossFrom.controls['SparePartsCost'].value){
        this.primaryLossFrom.controls['SparePartsCost'].setValue(String(this.primaryLossFrom.controls['SparePartsCost'].value.replace(/,/g, '')));
      }
  
      if(this.primaryLossFrom.controls['SalvageAmount'].value){
        this.primaryLossFrom.controls['SalvageAmount'].setValue(String(this.primaryLossFrom.controls['SalvageAmount'].value.replace(/,/g, '')));
      }
      if(this.primaryLossFrom.controls['YoungAgeDriver'].value){
        this.primaryLossFrom.controls['YoungAgeDriver'].setValue(String(this.primaryLossFrom.controls['YoungAgeDriver'].value.replace(/,/g, '')));
      }
  
      let TotalPrice =
        (this.ConvertToInt(this.primaryLossFrom.controls['YoungAgeDriver'].value)
        + this.ConvertToInt(this.primaryLossFrom.controls['SparePartsCost'].value)
          + this.ConvertToInt(this.primaryLossFrom.controls['Consumables'].value)
          + (this.ConvertToInt(this.primaryLossFrom.controls['TotalLabourHours'].value) * this.ConvertToInt(this.primaryLossFrom.controls['LabourCostPerHour'].value))) -
        (this.ConvertToInt(this.primaryLossFrom.controls['LessBetterment'].value)
          + this.ConvertToInt(this.primaryLossFrom.controls['LessExcess'].value)
          + this.ConvertToInt(this.primaryLossFrom.controls['UnderInsurance'].value));
  
          let status = null;
          if(this.logindata.UserType=='claimofficer')  status = 'PLC';
          else if(this.logindata.UserType=='surveyor')  status = 'SA';
          else if (this.logindata.UserType=='garage')  status = 'QA';
      let ReqObj = {
        "ChassisNo": this.claimDetails.ChassisNo,
        "ClaimNo": this.claimDetails.ClaimNo,
        "Claimrefno": this.claimDetails.Claimrefno,
        "Driverdob": this.datePipe.transform(this.primaryLossFrom.controls['Dob'].value, "dd/MM/yyyy"),
        "Driveremailid": this.primaryLossFrom.controls['Email'].value,
        "Drivergender": this.primaryLossFrom.controls['Gender'].value,
        "Driverlicenseexpirydate": this.datePipe.transform(this.primaryLossFrom.controls['LicenseExpiryDate'].value, "dd/MM/yyyy"),
        "Driverlicenseno": this.primaryLossFrom.controls['LicenseNo'].value,
        "Drivermobile": this.primaryLossFrom.controls['MobileNo'].value,
        "Drivername": this.primaryLossFrom.controls['DriverName'].value,
        "Drivernationality": "215",
        "Address": this.primaryLossFrom.controls['Address'].value,
        "DriverMobileCode": this.primaryLossFrom.controls['MobileCode'].value,
        "Entrydate": "",
        "Incidentlatitudelongitude": this.primaryLossFrom.controls['Latitude'].value,
        "Incidentlocationlongitude": this.primaryLossFrom.controls['Longitude'].value,
        "LossNo": this.LossInformation.LossNo == '' ? '' : this.LossInformation.LossNo,
        "Partyno": this.LossInformation.PartyNo,
        "PolicyNo": this.claimDetails.PolicyNo,
        "Remarks": "",
        "Status": status,
        "Losstypeid": this.LossInformation.LosstypeId,
        "LabourCost": Number((this.primaryLossFrom.controls['TotalLabourHours'].value == '' ? 0 : this.primaryLossFrom.controls['TotalLabourHours'].value) * (this.primaryLossFrom.controls['LabourCostPerHour'].value == '' ? 0 : this.primaryLossFrom.controls['LabourCostPerHour'].value)),
        "CreatedBy": this.logindata.LoginId,
        "SectionIds": this.DamagePoints,
        "BranchCode": this.logindata.BranchCode,
        "InsuranceId": this.logindata.InsuranceId,
        "ConsumablesCost": this.primaryLossFrom.controls['Consumables'].value == '' ? 0 : this.primaryLossFrom.controls['Consumables'].value,
        "SparepartsCost": this.primaryLossFrom.controls['SparePartsCost'].value == '' ? 0 : this.primaryLossFrom.controls['SparePartsCost'].value,
        "YoungAgeDriver": this.primaryLossFrom.controls['YoungAgeDriver'].value == '' ? 0 : this.primaryLossFrom.controls['YoungAgeDriver'].value,
        "TotalLabourHour": this.primaryLossFrom.controls['TotalLabourHours'].value == '' ? 0 : this.primaryLossFrom.controls['TotalLabourHours'].value,
        "PerHourLabourCost": this.primaryLossFrom.controls['LabourCostPerHour'].value == '' ? 0 : this.primaryLossFrom.controls['LabourCostPerHour'].value,
        "LessBetterment": this.primaryLossFrom.controls['LessBetterment'].value == '' ? 0 : this.primaryLossFrom.controls['LessBetterment'].value,
        "LessExcess": this.primaryLossFrom.controls['LessExcess'].value == '' ? 0 : this.primaryLossFrom.controls['LessExcess'].value,
        "UnderInsurance": this.primaryLossFrom.controls['UnderInsurance'].value == '' ? 0 : this.primaryLossFrom.controls['UnderInsurance'].value,
        "SalvageAmount": this.primaryLossFrom.controls['SalvageAmount'].value == '' ? 0 : this.primaryLossFrom.controls['SalvageAmount'].value,
        "TotalPrice": TotalPrice,
        "SaveorSubmit": event,
        "Waiveoffval": this.DocumentReasonList,
        "UserType": this.logindata.UserType,
        "UserId": this.logindata?.OaCode,
        "VatYn": this.VatYN
      }
  
  
  
      let UrlLink = `api/save/claimLossDetails`;
      return this.lossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {
  
  
        if (data.ErrorsList) {
          this.errorService.showLossErrorList(data.ErrorsList);
        }
        else {
          this.lossService.onGetLossList(this.LossDetails);
          if (event == 'Save') {
            Swal.fire(
              'Loss Saved Successfully!',
              'scccess',
              'success'
            )
          }
          if (event == 'Submit') {
  
            this.onStatusUpdate();
          }
          this.dialogRef.close(true);
        }
      }, (err) => {
        this.handleError(err);
      })
    }
    
  }



  onStatusUpdate() {
    const dialogRef = this.dialog.open(StatusUpdateComponent, {
      width: '100%',
      panelClass: 'full-screen-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.saveMessage(result);
    });

  }
  get GetStatusUpdate(){
    return this.StatusUpdated.asObservable();
  }
  onViewInfo(){
    this.panelOpen = !this.panelOpen;
  }
  saveMessage(result) {
    const data = result;
    this.StatusUpdated.next(data);
  }



  ngOnDestroy() {
    this.subscription.unsubscribe();
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
