import { NgxSpinnerService } from 'ngx-spinner';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { Component, Inject, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { find, map, startWith } from 'rxjs/operators';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { StatusUpdateComponent } from 'src/app/shared/lossinfocomponent/status-update/status-update.component';
import { ClaimjourneyService } from '../../claimjourney/claimjourney.service';

export const _filter = (opt: any[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item:any) => item.CodeDesc.toLowerCase().includes(filterValue));
}

@Component({
  selector: 'app-new-loss-modal',
  templateUrl: './new-loss-modal.component.html',
  styleUrls: ['./new-loss-modal.component.css']
})
export class NewLossModalComponent implements OnInit, OnDestroy {

  public ClaimLossType: any = [];
  public Primary = 'Primary';
  public Secondary = 'Secondary';
  public logindata: any = {};sumInsured:any=null;
  public ClaimDetails: any = {};excessValue:any=null;
  public LossTypeDesc: any;excessPercent:any=null;
  public claimIntimateValue: any = {};excessData:any[]=[];
  public LossTypeForm: FormGroup;insuranceId:any=null;
  @Output() public GetLossListById = new EventEmitter<any>();
  excessHeader: ({ key: string; display: string; config: { isMoreView: boolean; actions: string[]; isLossAction?: undefined; }; } | { key: string; display: string; config?: undefined; } | { key: string; display: string; config: { isLossAction: boolean; actions: string[]; isMoreView?: undefined; }; })[];
  private _filter(value: string): string[] {
    this.sumInsured=null;this.excessPercent=null;this.excessValue=null;
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    console.log("Filtered List",this.coverData.filter((option) => option?.CoverName?.toLowerCase().includes(filterValue)))
    return this.coverData.filter((option) => option?.CoverName?.toLowerCase().includes(filterValue));
  }
  private subscription = new Subscription();
  public lossTypeChoosed: any;coverData:any[]=[];
  lossGroupOptions: Observable<any[]>;coverGroupOptions:Observable<any[]>;
  constructor(
    private LossService: LossService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,public dialogRef: MatDialogRef<NewLossModalComponent>,private formBuilder: FormBuilder
  ) {
    console.log(this.data);
  }

  ngOnInit(): void {
    this.onCreateFormControl();
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.ClaimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.insuranceId = this.logindata?.InsuranceId;
    this.subscription = this.LossService.getLossType.subscribe((event: any) => {
      this.ClaimLossType = [{
        letter: 'Primary',
        names: event.Primary,
        },
        {
          letter: 'Secondary',
          names: event.Secondary,
        }
      ];
    });

    this.lossGroupOptions = this.LossTypeForm.get('LossType')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup(value)),
    );
   
    this.subscription = this.LossService.getClaimIntimateval.subscribe((event: any) => {
      this.claimIntimateValue = event;
      console.log(this.claimIntimateValue);
    });
    this.getCoverList();
    
  }
  getCoverList(){
    let UrlLink = `api/getewaycoverdetails`;
    let ReqObj = {
      "ChassisNo": this.ClaimDetails?.ChassisNo,
      "ClaimNo": this.ClaimDetails?.ClaimNo,
      "QuotationPolicyNo": this.ClaimDetails?.PolicyNo,
      "ClaimRefNo": this.ClaimDetails?.Claimrefno,
      "InsuranceId": this.insuranceId
    }
    return this.LossService.onLossEdit(UrlLink, ReqObj).subscribe((data: any) => {
        if(data){
          if(data.length!=0){
            this.coverData = data.filter(ele=>ele.Suminsured!='0');
          }
            // this.coverGroupOptions = this.LossTypeForm.controls['CoverName'].valueChanges.pipe(
            //   startWith(''),
            //   map((value: any) => this._filter(value)),
            // );
        }
    });
  }
  onCreateFormControl() {
    this.LossTypeForm = this.formBuilder.group({
      LossType:[''],
      CoverName:['']
    });
  }

  private _filterGroup(value: string): any[] {
    if (value) {
      return this.ClaimLossType
        .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }
    return this.ClaimLossType;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  commonReqObject() {
    return {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId": this.logindata?.OaCode
    }
  }




  async saveLossDetails(event: string) {
    let status = null;
    if(this.logindata.UserType=='claimofficer')  status = 'PLC';
    else if(this.logindata.UserType=='surveyor')  status = 'SA';
    else if (this.logindata.UserType=='garage')  status = 'QA';
    let ReqObj = {
      "ChassisNo": this.ClaimDetails.ChassisNo,
      "ClaimNo": this.ClaimDetails.ClaimNo,
      "Driverdob": this.claimIntimateValue.Driverdob,
      "Driveremailid": this.claimIntimateValue.Driveremailid,
      "Drivergender": this.claimIntimateValue.Drivergender,
      "Driverlicenseexpirydate": this.claimIntimateValue.Licenceexpirydate,
      "Driverlicenseno": this.claimIntimateValue.Licenseno,
      "Drivermobile": this.claimIntimateValue.Drivermobile,
      "Drivername": this.claimIntimateValue.Drivername,
      "Drivernationality": this.claimIntimateValue.Nationality,
      "Address": this.claimIntimateValue.Driveraddress,
      "DriverMobileCode": this.claimIntimateValue.Mobilecode,
      "Entrydate": "",
      "Incidentlatitudelongitude": this.claimIntimateValue.Lattitude,
      "Incidentlocationlongitude": this.claimIntimateValue.Longitude,
      "LossNo": "",
      "Partyno": this.data.PartyNo,
      "PolicyNo": this.ClaimDetails.PolicyNo,
      "Remarks": '',
      "Status":status,
      "Losstypeid": this.lossTypeChoosed,
      "ConsumablesCost": "",
      "LabourCost": "",
      "CoverId": this.LossTypeForm.controls['CoverName'].value,
      "CoverName": this.coverData.find(ele=>ele.CoverId==this.LossTypeForm.controls['CoverName'].value)?.CoverName,
      "SectionIds": this.claimIntimateValue.Vehpartsid,
      "Claimrefno": this.claimIntimateValue.Claimrefno,
      "SparepartsCost": 0,
      "TotalLabourHour": 0,
      "PerHourLabourCost": 0,
      "LessBetterment": 0,
      "LessExcess": 0,
      "UnderInsurance": 0,
      "SalvageAmount": 0,
      "TotalPrice": 0,
      "SaveorSubmit": event == 'submit' ? 'Submit' : 'Save',
      ...this.commonReqObject()
    }


    console.log(ReqObj)

    let UrlLink = `api/save/claimLossDetails`;
    return this.LossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {

      console.log("saveloss", data);
      if (data.Response == "SUCCESS") {
        this.dialogRef.close(true);
        //this.onStatusUpdate();
        Swal.fire(
          `Loss Created Successfully`,
          'success',
          'success'
        );

      }
      if (data.ErrorsList) {
        this.errorService.showLossErrorList(data.ErrorsList);

      }
    }, (err) => {
      this.handleError(err);
    })
  }

  onStatusUpdate() {
    const dialogRef = this.dialog.open(StatusUpdateComponent, {
      width: '100%',
      panelClass: 'full-screen-modal'
    });

  }

  onSelectValue(){
    let value = this.LossTypeForm.controls['CoverName'].value;
    if(value!=''){
        let rowData = this.coverData.filter(ele=>ele.CoverName==value);
        if(rowData.length!=0){
          this.sumInsured = rowData[0].SumInsured;this.excessValue = rowData[0].ExcessAmount;this.excessPercent = rowData[0].ExcessPercent;
          this.excessData = rowData;
          this.excessHeader = [
            { key: "ExcessAmount", display: "Excess Amount" },
            { key: "ExcessPercent", display: "Excess (%)" },
            { key: "SumInsured", display: "SumInsured" },
          ];
        }
    }
  }
  onCreateNewLoss(event: string) {
    let mergeArray = [...this.ClaimLossType[0].names, ...this.ClaimLossType[1].names];
    console.log(mergeArray, this.LossTypeDesc);
    let findId = mergeArray.find((ele: any) => ele.CodeDesc == this.LossTypeForm.controls['LossType'].value);
    this.lossTypeChoosed = findId.Code;
    this.saveLossDetails(event);
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
