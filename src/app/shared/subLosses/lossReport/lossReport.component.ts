import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorService } from '../../services/errors/error.service';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { LossModalComponent } from 'src/app/shared/loss-modal/loss-modal.component';
import { StatusUpdateComponent } from '../../lossinfocomponent/status-update/status-update.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-lossReport',
  templateUrl: './lossReport.component.html',
  styleUrls: ['./lossReport.component.css']
})
export class LossReportComponent implements OnInit {
  @Input() hidebtn: any;

  public logindata: any = {};
  public claimDetails: any = {};
  public createSecondaryForm: FormGroup;
  @Input() secdLossInfo: any;
  public LossTypeDes: any = '';
  public isLossEdit: any;
  public LossTypeId:any;
  public isDisabled:boolean=true;VatYN:any="N";
  public empYn = 'SelfEmployed';
  @Output() public onSubmitFrom = new EventEmitter<any>();
  vatSection: boolean = false;
  totalAmount: any;
  foods: any[]=[];
  User: any[]=[];
  displayedColumns: any[]=[];
  dataSource: any;
  PeriodicElement: any[]=[];
  constructor(
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private lossService: LossService,
    public dialog:MatDialog,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<LossModalComponent>,
  ) {
     this.User = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 }
    ];
    this.displayedColumns = ['position', 'name', 'weight', 'symbol'];
  this.dataSource = this.PeriodicElement;
  this.PeriodicElement = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
    {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
    {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
    {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
    {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
    {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
    {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
    {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
    {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
    {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
    {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
  ];
  }
  
 
  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    if (this.logindata?.UserType == "claimofficer" && (this.secdLossInfo?.GarageYn!='N' && this.secdLossInfo?.SurveyorYn !='N')) {
      this.isDisabled=true;
    }else{
      this.isDisabled=false;
    }
    console.log(this.secdLossInfo);
    this.createFromControl();
    this.LossTypeDes = this.secdLossInfo.Losstypedescp;
    this.LossTypeId = this.secdLossInfo.LosstypeId;
    this.isLossEdit = this.secdLossInfo.LossNo;

    this.onBindSecondayLossType();
    this.onUpdateValidators();

  }

  commonReqObject() {
    return {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId":  this.logindata?.OaCode

    }
  }

  createFromControl() {
    this.createSecondaryForm = this.formBuilder.group({
      // SalvageAmount: [{value:'0',disabled: this.isDisabled}],
      // ExcessAmount: [{value:'0',disabled: this.isDisabled}],
      // DepreciationAmount: [{value:'0',disabled: this.isDisabled}],
      // Amount: [{value:'0',disabled: this.isDisabled}],
      // Remarks: [{value:'None',disabled: this.isDisabled}],
      // TotalPrice: [{value:'0',disabled: this.isDisabled}],
      // Status: [{value:'Y',disabled: this.isDisabled}],
      // UnderInsurance:[{value:'0',disabled: this.isDisabled}],
      "IdType": [{value:'',disabled: this.isDisabled}, Validators.required],
      "IdNumber": [{value:'',disabled: this.isDisabled}, Validators.required],
      "InjuryDate": [{value:'',disabled: this.isDisabled}, Validators.required],
      "InjuryDesc": [{value:'',disabled: this.isDisabled}, Validators.required],
      "TreatMentStartDate": [{value:'',disabled: this.isDisabled}, Validators.required],
      "TreatMentEndDate": [{value:'',disabled: this.isDisabled}, Validators.required],
      "MedicalExpenses": [{value:'',disabled: this.isDisabled}, Validators.required],
      "FutureCareCost": [{value:'',disabled: this.isDisabled}, Validators.required],
      "InjuryType":[{value:'',disabled: this.isDisabled}, Validators.required],
      "DisabilityPercentage":[{value:'',disabled: this.isDisabled}],
      "LossOfEarnings": [{value:'',disabled: this.isDisabled}],
      "FinalSettleMentAmount": [{value:'N',disabled: this.isDisabled}, Validators.required],
      // "VictEmpType": [{value:'',disabled: this.isDisabled}, Validators.required],
      // "VictGender": [{value:'1',disabled: this.isDisabled}, Validators.required],
      // "VictLossDesc": [{value:'',disabled: this.isDisabled}, Validators.required],
      // "VictName": [{value:'',disabled: this.isDisabled}, Validators.required],
      // "VictOccupation": [{value:'',disabled: this.isDisabled}, Validators.required],
      // "VictPoBox": [{value:'',disabled: this.isDisabled}, Validators.required],
      // "VictmMonthIncome": [{value:'',disabled: this.isDisabled}, Validators.required],
      // "LessExcess":[{value:'0',disabled: this.isDisabled}, Validators.required],

    })
  }

  onUpdateValidators(){
     }

  onBindSecondayLossType() {
    this.createSecondaryForm.controls['IdType'].setValue(this.secdLossInfo.IdType);
    this.createSecondaryForm.controls['IdNumber'].setValue(this.secdLossInfo.IdNumber);
    this.createSecondaryForm.controls['InjuryDate'].setValue(this.secdLossInfo.InjuryDate);
    this.createSecondaryForm.controls['InjuryDesc'].setValue(this.secdLossInfo.InjuryDesc);
    this.createSecondaryForm.controls['TreatMentStartDate'].setValue(this.secdLossInfo.TreatMentStartDate);
    this.createSecondaryForm.controls['TreatMentEndDate'].setValue(this.secdLossInfo.TreatMentEndDate);
    this.createSecondaryForm.controls['MedicalExpenses'].setValue(this.secdLossInfo.MedicalExpenses);
    this.createSecondaryForm.controls['FutureCareCost'].setValue(this.secdLossInfo.FutureCareCost);
    this.createSecondaryForm.controls['InjuryType'].setValue(this.secdLossInfo.InjuryType);
    this.createSecondaryForm.controls['DisabilityPercentage'].setValue(this.secdLossInfo.DisabilityPercentage);
    this.createSecondaryForm.controls['LossOfEarnings'].setValue(this.secdLossInfo.LossOfEarnings);
    this.createSecondaryForm.controls['FinalSettleMentAmount'].setValue(this.secdLossInfo.FinalSettleMentAmount);
    // this.createSecondaryForm.controls['VictDependYn'].setValue(this.secdLossInfo.VictDependYn);
    // this.createSecondaryForm.controls['VictEmpType'].setValue(this.secdLossInfo.VictEmpType);
    // this.empYn = this.secdLossInfo.VictEmpType;
    // if(this.secdLossInfo.VatYn!=null){
    //   this.totalAmount = this.secdLossInfo.TotalPayable;
    //   this.VatYN = this.secdLossInfo.VatYn;
    //   if(this.VatYN=='Y'){
    //     this.vatSection = true;
        
    //   }
    // }

    // this.createSecondaryForm.controls['VictGender'].setValue(this.secdLossInfo.VictGender);
    // this.createSecondaryForm.controls['VictLossDesc'].setValue(this.secdLossInfo.VictLossDesc);
    // this.createSecondaryForm.controls['VictMedAtten'].setValue(this.secdLossInfo.VictMedAtten);
    // this.createSecondaryForm.controls['VictName'].setValue(this.secdLossInfo.VictName);
    // this.createSecondaryForm.controls['VictNameAddr'].setValue(this.secdLossInfo.VictNameAddr);
    // this.createSecondaryForm.controls['VictOccupation'].setValue(this.secdLossInfo.VictOccupation);
    // this.createSecondaryForm.controls['VictPoBox'].setValue(this.secdLossInfo.VictPoBox);
    // this.createSecondaryForm.controls['VictmMonthIncome'].setValue(this.secdLossInfo.VictmMonthIncome);
    // this.createSecondaryForm.controls['SalvageAmount'].setValue(this.secdLossInfo.SalvageAmount);
    // this.createSecondaryForm.controls['ExcessAmount'].setValue(this.secdLossInfo.LessExcess);
    // this.createSecondaryForm.controls['DepreciationAmount'].setValue(this.secdLossInfo.DepriciationAmount);
    // this.createSecondaryForm.controls['Amount'].setValue(this.secdLossInfo.TotalPrice);
    // this.createSecondaryForm.controls['Remarks'].setValue(this.secdLossInfo.Remarks)
  }

  async saveLossDetails(event: string) {

     this.createSecondaryForm.controls['VictEmpType'].setValue(this.empYn);
     console.log(this.createSecondaryForm.value);


      let ReqObj = {
        //"ChassisNo": this.claimDetails.ChassisNo,
        "ClaimNo": this.claimDetails.ClaimNo,
        "CreatedBy": this.logindata.LoginId,
        "InjuryId": "",
        "Losstypeid": this.secdLossInfo.LosstypeId,
        "PartyId": this.secdLossInfo.PartyNo,
        "IdType": this.createSecondaryForm.controls['IdType'].value,
        "IdNumber": this.createSecondaryForm.controls['IdNumber'].value,
       // "LossNo": this.isLossEdit == '' || null ? '' : this.isLossEdit,
        "InjuryDate": this.createSecondaryForm.controls['InjuryDate'].value,
        "InjuryDesc": this.createSecondaryForm.controls['InjuryDesc'].value,
        "TreatMentStartDate": this.createSecondaryForm.controls['TreatMentStartDate'].value,
        //"SaveorSubmit": event == 'Submit' ? 'Submit' : 'Save',
        "TreatMentEndDate": this.createSecondaryForm.controls['TreatMentEndDate'].value,
        "MedicalExpenses":this.createSecondaryForm.controls['MedicalExpenses'].value,
        "FutureCareCost": this.createSecondaryForm.controls['FutureCareCost'].value,
        "InjuryType": this.createSecondaryForm.controls['InjuryType'].value,
        "DisabilityPercentage": this.createSecondaryForm.controls['DisabilityPercentage'].value,
        "LossOfEarnings": this.createSecondaryForm.controls['LossOfEarnings'].value,
        "FinalSettleMentAmount": this.createSecondaryForm.controls['FinalSettleMentAmount'].value,
        // "VictComDesignation": this.createSecondaryForm.controls['VictComDesignation'].value,
        // "VictComName": this.createSecondaryForm.controls['VictComName'].value,
        // "VictComPoBox": this.createSecondaryForm.controls['VictComPoBox'].value,
        // "VictDependAddre": this.createSecondaryForm.controls['VictDependAddre'].value,
        // "VictDependName": this.createSecondaryForm.controls['VictDependName'].value,
        // "VictDependYn": this.createSecondaryForm.controls['VictDependYn'].value,
        // "VictEmpType": this.createSecondaryForm.controls['VictEmpType'].value,
        // "VictGender": this.createSecondaryForm.controls['VictGender'].value,
        // "VictLossDesc": this.createSecondaryForm.controls['VictLossDesc'].value,
        // "VictName": this.createSecondaryForm.controls['VictName'].value,
        // "VictOccupation": this.createSecondaryForm.controls['VictOccupation'].value,
        // "VictPoBox": this.createSecondaryForm.controls['VictPoBox'].value,
        // "VictmMonthIncome": this.createSecondaryForm.controls['VictmMonthIncome'].value,
        // "VictNameAddr":this.createSecondaryForm.controls['VictNameAddr'].value,
        // "VictMedAtten":this.createSecondaryForm.controls['VictMedAtten'].value,
        // "VatYn": this.VatYN,
        ...this.commonReqObject()
      }

      let UrlLink = `api/save/claimLossDetails`;
      return this.lossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {

        console.log("saveloss", data);
        if (data.Response == "SUCCESS") {
          this.dialogRef.close(true);
          if (this.isLossEdit == '' || null) {
            Swal.fire(
              `Loss Created Successfully`,
              'success'
            )
          } else {
            Swal.fire(
              `Loss Updated Successfully`,
              'success'
            )
          }
          this.onStatusUpdate();
        }
        if (data.Errors) {
          this.errorService.showValidateError(data.Errors);

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
