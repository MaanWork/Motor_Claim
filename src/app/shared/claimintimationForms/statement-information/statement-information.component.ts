import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-statement-information',
  templateUrl: './statement-information.component.html',
  styleUrls: ['./statement-information.component.css']
})
export class StatementInformationComponent implements OnInit {
  statmtByDriver: string;
  statmtOwnerOrPolicy: string;
  public createComercialVehc: FormGroup;
  @Output() public GetStatementInfo = new EventEmitter<any>();
  @Input() public claimRefNo:any;
  @Input() public claimInformation:any;
  constructor(private formBuilder:FormBuilder) {
    this.createComercialVehc = this.formBuilder.group({
      Drivedby: ['', Validators.required],
      Typeofvehicle: ['', Validators.required],
      NameOwnerOfGood: ['', Validators.required],
      TrailerOrAttached: ['N', Validators.required],
      WeightOfLoadVeh: ['', Validators.required],
      WeightOfLoadTral: ['', Validators.required],
      DriverStatement : ['', Validators.required],
      OwnerStatement : ['', Validators.required]
    })

   }
   setVehicleType(type) {
    console.log(type);
    if (type == 'Private') {
      console.log(type);
      this.createComercialVehc.controls['Typeofvehicle'].setValue('Private');
      this.createComercialVehc.controls['NameOwnerOfGood'].setValue('');
      this.createComercialVehc.controls['TrailerOrAttached'].setValue('N');
      this.createComercialVehc.controls['WeightOfLoadVeh'].setValue('0');
      this.createComercialVehc.controls['WeightOfLoadTral'].setValue('0');
    }
    else{
      this.createComercialVehc.controls['Typeofvehicle'].setValue(type);
    }
  }
  setDrivedBy(type) {
    if (type == 'Owner') {
      console.log(type);
      this.createComercialVehc.controls['Drivedby'].setValue('Owner');
      this.statmtByDriver = "";
      this.statmtOwnerOrPolicy = "";
    }
    if (type == 'Driver') {
      this.createComercialVehc.controls['Drivedby'].setValue('Driver');
      this.statmtByDriver = "";
      this.statmtOwnerOrPolicy = "";
    }
  }
  ngOnInit(): void {
    if(this.claimInformation){
      if(this.claimInformation.Claimrefno){
        this.setEditValues();
      }
    }
  }
  setEditValues(){
    let userData = this.claimInformation;
    this.createComercialVehc.controls['Typeofvehicle'].setValue(userData.Typeofvehicle);
    this.createComercialVehc.controls['Drivedby'].setValue(userData.Drivedby);
    this.createComercialVehc.controls['WeightOfLoadVeh'].setValue(userData.Tonnage);
    this.createComercialVehc.controls['NameOwnerOfGood'].setValue(userData.OwnerGoods);
    this.createComercialVehc.controls['TrailerOrAttached'].setValue(userData.Trailerattached == null ? "N" : userData.Trailerattached);
    this.createComercialVehc.controls['WeightOfLoadTral'].setValue(userData.VehTrailer);
    console.log("Commercial Value",this.createComercialVehc.value)
    this.statmtByDriver = userData.Statementbydriver;
    this.statmtOwnerOrPolicy = userData.Statementownerpolicyholder;
  }
  onStatementInfoSubmit(){
    if(this.createComercialVehc.controls['Drivedby'].value == 'Driver'){
      this.statmtOwnerOrPolicy = "";
    }
    else{
      this.statmtByDriver = "";
    }
    this.createComercialVehc.controls['DriverStatement'].setValue(this.statmtByDriver == null ? "" :this.statmtByDriver);
    this.createComercialVehc.controls['OwnerStatement'].setValue(this.statmtOwnerOrPolicy == null ? "" : this.statmtOwnerOrPolicy);
    this.GetStatementInfo.emit(this.createComercialVehc.value);
  }
}
