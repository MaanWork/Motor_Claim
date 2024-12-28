import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommondataService } from '../../services/commondata.service';
import { ErrorService } from '../../services/errors/error.service';
declare var $:any;
@Component({
  selector: 'app-reason-information',
  templateUrl: './reason-information.component.html',
  styleUrls: ['./reason-information.component.css']
})
export class ReasonInformationComponent implements OnInit {
  @Output() public GetReasonInfo = new EventEmitter<any>();
  @Input() public claimRefNo:any;
  @Input() public claimInformation:any;
  public createDamageToInsuVeh: FormGroup;
  passengersInVehicleArray: any[]=[];
  IndentWitnesArray: any[]=[];
  personsInjuredArray: any[]=[];
  otherVehicleInvolvedArray: any[]=[];
  display1: any = "0";
  display2: any = "0";
  display3: any = "0";
  display4: any = "0";
  display5: any = "0";
  accidentMaxDate:any;
  startDate: any;
  constructor(private formBuilder:FormBuilder,
    private commondataService:CommondataService,
    private errorService: ErrorService,) {
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var day = new Date().getDate();
    this.accidentMaxDate = { year: year , month: month+1, day: day-1 };
    this.startDate = { year: year, month: month+1, day: day };
    this.createDamageToInsuVeh = this.formBuilder.group({
      DamgVehYn: ['N', Validators.required],
      DamgPropYn: ['N', Validators.required],
      DamgPersYn: ['N', Validators.required],
      DamIndiYn: ['N', Validators.required],
      DamPassenYn: ['N', Validators.required],
      appartmentDamage: ['', Validators.required],
      repairNameAndAdrss: [''],
      isTheVehlStillUse: ['N', Validators.required],
      whenAndWhere: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    console.log("Edit Claim Idddddddddddddddddddddd",sessionStorage.getItem('editClaimId'))
    if(this.claimInformation){
      if(this.claimInformation.Claimrefno){
        this.setEditValues();
      }
      else{
          this.claimInformation = {
            Claimrefno : sessionStorage.getItem('editClaimId')
          }
      }
    }
    else{
      this.claimInformation = {
        Claimrefno : sessionStorage.getItem('editClaimId')
      }
    }
  }
  setEditValues(){
    let userData = this.claimInformation;
    this.createDamageToInsuVeh.controls['whenAndWhere'].setValue(userData.WhenAndWhere == null ? "" : userData.WhenAndWhere);
    this.createDamageToInsuVeh.controls['DamgVehYn'].setValue(userData.DamgVehYn == null ? "N" : userData.DamgVehYn);
    this.createDamageToInsuVeh.controls['DamgPropYn'].setValue(userData.DamgPropYn == null ? "N" : userData.DamgPropYn);
    this.createDamageToInsuVeh.controls['DamgPersYn'].setValue(userData.DamgPersYn == null ? "N" : userData.DamgPersYn);
    this.createDamageToInsuVeh.controls['DamIndiYn'].setValue(userData.DamIndiYn == null ? "N" : userData.DamIndiYn),
      this.createDamageToInsuVeh.controls['DamPassenYn'].setValue(userData.DamPassenYn == null ? "N" : userData.DamPassenYn),
      this.createDamageToInsuVeh.controls['repairNameAndAdrss'].setValue(userData.Garagenameaddress == null ? "" : userData.Garagenameaddress),
      this.createDamageToInsuVeh.controls['appartmentDamage'].setValue(userData.Vehicledamagedescription == null ? "" : userData.Vehicledamagedescription),
      this.createDamageToInsuVeh.controls['isTheVehlStillUse'].setValue(userData.Vehicleinuseyn == null ? "N" : userData.Vehicleinuseyn);
    if (userData.DamgVehYn == 'Y') {
      this['display' + 1] = "1";
    }
    if (userData.DamgPropYn == 'Y') {
      this['display' + 2] = "1";
      this.getOtherVehicleInvolvedList();
    }
    if (userData.DamgPersYn == 'Y') {
      this['display' + 3] = "1";
      this.getPersonsInjuredList();
    }
    if (userData.DamIndiYn == 'Y') {
      this['display' + 4] = "1";
      this.getIndependentWitnessList();
    }
    if (userData.DamPassenYn == 'Y') {
      this['display' + 5] = "1";
      this.getPassengerinVehList();
    }
  }
  getPassengerinVehList() {
    let UrlLink = "api/claimintipassengvehbyclaimrefno";
    let reqObj = {
      "Claimrefno": this.claimInformation.Claimrefno,
    }
    return this.commondataService.onGetClaimList(UrlLink, reqObj).subscribe((data: any) => {
      console.log("Passenger in Vehicle List", data);
      this.passengersInVehicleArray = data;
    }, (err) => {
      this.handleError(err);
    })
  }
  getIndependentWitnessList() {
    let UrlLink = "api/claiminitindepenwitbyclaimrefno";
    let reqObj = {
      "Claimrefno": this.claimInformation.Claimrefno,
    }
    return this.commondataService.onGetClaimList(UrlLink, reqObj).subscribe((data: any) => {
      console.log("Inependent Witness List", data);
      this.IndentWitnesArray = data;
    }, (err) => {
      this.handleError(err);
    })
  }
  getPersonsInjuredList() {
    let UrlLink = "api/claimintipersoninjuredbyclaimrefno";
    let reqObj = {
      "Claimrefno": this.claimInformation.Claimrefno,
    }
    return this.commondataService.onGetClaimList(UrlLink, reqObj).subscribe((data: any) => {
      console.log("person Injured List", data);
      this.personsInjuredArray = data;
    }, (err) => {
      this.handleError(err);
    })
  }
  getOtherVehicleInvolvedList() {
    let UrlLink = "api/claimintiotrvehpropdamagebyclaimrefno";
    let reqObj = {
      "Claimrefno": this.claimInformation.Claimrefno,
    }
    return this.commondataService.onGetClaimList(UrlLink, reqObj).subscribe((data: any) => {
      console.log("Other Vehicle List", data);
      this.otherVehicleInvolvedArray = data;
    }, (err) => {
      this.handleError(err);
    })
  }
  onTypeofAccident(id) {
    var ischeck = $(`input:checkbox[name=AccidentType${id}]`).is(':checked');
    if (ischeck == true) {
      if (id == 1) {
        this.createDamageToInsuVeh.controls['DamgVehYn'].setValue('Y');
      }
      if (id == 2) {
        this.createDamageToInsuVeh.controls['DamgPropYn'].setValue('Y');
        if(this.otherVehicleInvolvedArray.length==0){
          this.onAddRowOtherVehInv();
        }

      }
      if (id == 3) {
        this.createDamageToInsuVeh.controls['DamgPersYn'].setValue('Y');
        this.onAddRowPersonsInjured();
      }
      if (id == 4) {
        this.createDamageToInsuVeh.controls['DamIndiYn'].setValue('Y');
        this.onAddRowIndependentWit();
      }
      if (id == 5) {
        this.createDamageToInsuVeh.controls['DamPassenYn'].setValue('Y');
        this.onAddRowPassengerInVehicle();
      }

      this['display' + id] = "1";

    } if (ischeck == false) {
      this['display' + id] = "0";
      let UrlLink = "";
      if (id == 1) {
        this.createDamageToInsuVeh.controls['DamgVehYn'].setValue('N');
        this.createDamageToInsuVeh.controls['appartmentDamage'].setValue('');
        this.createDamageToInsuVeh.controls['repairNameAndAdrss'].setValue('');
        this.createDamageToInsuVeh.controls['isTheVehlStillUse'].setValue('N');
        this.createDamageToInsuVeh.controls['whenAndWhere'].setValue('');
      }
      if (id == 2) {
        this.createDamageToInsuVeh.controls['DamgPropYn'].setValue('N');
        this.otherVehicleInvolvedArray = [
          {
            Addrofdriver: "",
            Claimrefno: this.claimInformation.Claimrefno,
            Nameofdriver: "",
            Nameofinsured: "",
            Remark: "",
            Sno: "",
            Status: "Y",
            Vehregno: ""
          }
        ]
        UrlLink = "api/deleteclaimintiotrvehpropdamagebyclaimrefno";
      }
      if (id == 3) {
        this.createDamageToInsuVeh.controls['DamgPersYn'].setValue('N');
        this.personsInjuredArray = [
          {
            Address: "",
            Apparentinjuries: "",
            Claimrefno: this.claimInformation.Claimrefno,
            Column1: "",
            Name: "",
            Persontype: "",
            Remark: "",
            Sno: "",
            Status: "Y"
          }
        ]
        UrlLink = "api/deleteclaimintipersoninjuredbyclaimrefno";
      }
      if (id == 4) {
        this.createDamageToInsuVeh.controls['DamIndiYn'].setValue('N');
        this.IndentWitnesArray = [
          {
            Sno: '',
            IndenWit_Name: '',
            IndenWit_Address: '',
            Claimrefno: this.claimInformation.Claimrefno,
            Editable: false,
            Remark: "sda",
            Status: "Y",
          }
        ]
        UrlLink = "api/deleteclaiminitindepenwitbyclaimrefno";
      }
      if (id == 5) {
        this.createDamageToInsuVeh.controls['DamPassenYn'].setValue('N');
        this.passengersInVehicleArray = [
          {
            Address: "",
            Claimrefno: this.claimInformation.Claimrefno,
            Name: "",
            Sno: "",
            Status: "Y"
          }
        ]
        UrlLink = "api/deleteclaimintipassengvehbyclaimrefno";
      }
      if (UrlLink != "") {
        this.deleteInsuredDetails(UrlLink);
      }
    }
  }
  onSignatureFileSelected(event){

  }
  deleteInsuredDetails(deleteLink) {

  }
  onAddRowOtherVehInv() {
    this.otherVehicleInvolvedArray.push(
      {
        Addrofdriver: "",
        Claimrefno: this.claimInformation.Claimrefno,
        Nameofdriver: "",
        Nameofinsured: "",
        Remark: "",
        Sno: "",
        Status: "Y",
        Vehregno: ""
      }
    );
  }
  removeOtherVehicleInvolved(index) {
    console.log("Index Received", index);
    this.otherVehicleInvolvedArray.splice(index, 1);
    if(this.otherVehicleInvolvedArray.length == 0 ){
      this.onAddRowOtherVehInv();
    }
    console.log("Final List", this.otherVehicleInvolvedArray);
  }
  onAddRowPersonsInjured() {
    this.personsInjuredArray.push(
      {
        Address: "",
        Apparentinjuries: "",
        Claimrefno: this.claimInformation.Claimrefno,
        Column1: "",
        Name: "",
        Persontype: "",
        Remark: "",
        Sno: "",
        Status: "Y"
      }
    );
  }
  removePersonsInjured(index) {
    console.log("Index Received", index);
    this.personsInjuredArray.splice(index, 1);
    if(this.personsInjuredArray.length == 0 ){
      this.onAddRowPersonsInjured();
    }
    console.log("Final List", this.personsInjuredArray);
  }
  onAddRowIndependentWit() {
    this.IndentWitnesArray.push(
      {
        Sno: '',
        IndenWit_Name: '',
        IndenWit_Address: '',
        Editable: false,
        Claimrefno: this.claimInformation.Claimrefno,
        Remark: "sda",
        Status: "Y",
      }
    );
  }
  removeIndependentWitness(index) {
    console.log("Index Received", index);
    this.IndentWitnesArray.splice(index, 1);
    if(this.IndentWitnesArray.length == 0 ){
      this.onAddRowIndependentWit();
    }
    console.log("Final List", this.IndentWitnesArray);
  }
  onAddRowPassengerInVehicle() {
    this.passengersInVehicleArray.push(
      {
        Address: "",
        Claimrefno: this.claimInformation.Claimrefno,
        Name: "",
        Sno: "",
        Status: "Y"
      }
    );
  }
  removePassenInVeh(index) {
    console.log("Index Received", index);
    this.passengersInVehicleArray.splice(index, 1);
    if(this.passengersInVehicleArray.length == 0 ){
      this.onAddRowPassengerInVehicle();
    }
    console.log("Final List", this.passengersInVehicleArray);
  }
  async onReasonInfoSubmit(){
            let otherVehicleInsyn = this.createDamageToInsuVeh.controls['DamgPropYn'].value;
            let persInjYn = this.createDamageToInsuVeh.controls['DamgPersYn'].value;
            let damIndYn = this.createDamageToInsuVeh.controls['DamIndiYn'].value;
            let damPassenYn = this.createDamageToInsuVeh.controls['DamPassenYn'].value;
            if (otherVehicleInsyn == 'Y') {
              await this.onInsertOtheVehicleInvolved();
            }
            else if (persInjYn == 'Y') {
              await this.onInsertpersonsInjured();
            }
            else if (damIndYn == 'Y') {
              await this.onInsertIndWitnes();
            }
            else if (damPassenYn == 'Y') {
              await this.onInsertpassengersInVehicle();
            }
            else{
              console.log("Emitted Value")
              this.GetReasonInfo.emit(this.createDamageToInsuVeh.value);
            }
  }
  onInsertOtheVehicleInvolved() {
    if (this.otherVehicleInvolvedArray.length != 0) {
      let i = 0;
      for (let witness of this.otherVehicleInvolvedArray) {
        witness.Sno = i;
        witness.Claimrefno = this.claimInformation.Claimrefno;
        i += 1;
      }
      if (i == this.otherVehicleInvolvedArray.length) {
        let ReqObj = this.otherVehicleInvolvedArray;
        let UrlLink = `api/insertclaimintiotrvehpropdamagelist`;
        return this.commondataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {
          console.log("Independent", data);
          if (data.Errors) {
            let element = '';
            for (let i = 0; i < data.Errors.length; i++) {
              element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data.Errors[i].Message + "</div>";
            }
            Swal.fire(
              'Please Fill Valid Value',
              `${element}`,
              'error',
            )
          }
          else{
            let otherVehicleInsyn = this.createDamageToInsuVeh.controls['DamgPropYn'].value;
            let persInjYn = this.createDamageToInsuVeh.controls['DamgPersYn'].value;
            let damIndYn = this.createDamageToInsuVeh.controls['DamIndiYn'].value;
            let damPassenYn = this.createDamageToInsuVeh.controls['DamPassenYn'].value;
            if (persInjYn == 'Y') {
               this.onInsertpersonsInjured();
            }
            else if (damIndYn == 'Y') {
               this.onInsertIndWitnes();
            }
            else if (damPassenYn == 'Y') {
               this.onInsertpassengersInVehicle();
            }
            else{
              this.GetReasonInfo.emit(this.createDamageToInsuVeh.value);
            }
          }

        }, (err) => {
          this.handleError(err);
        })
      }

    }

  }
  onInsertpersonsInjured() {
    if (this.personsInjuredArray.length != 0) {
      let i = 0;
      for (let witness of this.personsInjuredArray) {
        witness.Sno = i;
        witness.Claimrefno = this.claimInformation.Claimrefno;
        i += 1;
      }
      if (i == this.personsInjuredArray.length) {
        let ReqObj = this.personsInjuredArray;
        console.log(this.personsInjuredArray);

        let UrlLink = `api/insertclaimintipersoninjured`;
        return this.commondataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {
          console.log("Independent", data);
          if (data.Errors) {
            let element = '';
            for (let i = 0; i < data.Errors.length; i++) {
              element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data.Errors[i].Message + "</div>";

            }
            Swal.fire(
              'Please Fill Valid Value',
              `${element}`,
              'error',
            )
          }
          else{
            let otherVehicleInsyn = this.createDamageToInsuVeh.controls['DamgPropYn'].value;
            let persInjYn = this.createDamageToInsuVeh.controls['DamgPersYn'].value;
            let damIndYn = this.createDamageToInsuVeh.controls['DamIndiYn'].value;
            let damPassenYn = this.createDamageToInsuVeh.controls['DamPassenYn'].value;
            if (damIndYn == 'Y') {
               this.onInsertIndWitnes();
            }
            else if (damPassenYn == 'Y') {
               this.onInsertpassengersInVehicle();
            }
            else{
              this.GetReasonInfo.emit(this.createDamageToInsuVeh.value);
            }
          }
        }, (err) => {
          this.handleError(err);
        })
      }
    }
  }
  onInsertIndWitnes() {
    if (this.IndentWitnesArray.length != 0) {
      let i = 0;
      for (let witness of this.IndentWitnesArray) {
        witness.Sno = i;
        witness.Claimrefno = this.claimInformation.Claimrefno;
        i += 1;
      }
      if (i == this.IndentWitnesArray.length) {
        let ReqObj = this.IndentWitnesArray;
        console.log(this.IndentWitnesArray);

        let UrlLink = `api/insertclaiminitindepenwitlist`;
        return this.commondataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {
          console.log("Independent", data);
          if (data.Errors) {
            let element = '';
            for (let i = 0; i < data.Errors.length; i++) {
              element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data.Errors[i].Message + "</div>";

            }
            Swal.fire(
              'Please Fill Valid Value',
              `${element}`,
              'error',
            )
          }
          else{
            let otherVehicleInsyn = this.createDamageToInsuVeh.controls['DamgPropYn'].value;
            let persInjYn = this.createDamageToInsuVeh.controls['DamgPersYn'].value;
            let damIndYn = this.createDamageToInsuVeh.controls['DamIndiYn'].value;
            let damPassenYn = this.createDamageToInsuVeh.controls['DamPassenYn'].value;
            if (damPassenYn == 'Y') {
               this.onInsertpassengersInVehicle();
            }
            else{
              this.GetReasonInfo.emit(this.createDamageToInsuVeh.value);
            }
          }
        }, (err) => {
          this.handleError(err);
        })
      }

    }

  }
  onInsertpassengersInVehicle() {
    if (this.passengersInVehicleArray.length != 0) {
      let i = 0;
      for (let witness of this.passengersInVehicleArray) {
        witness.Sno = i + 1;
        witness.Claimrefno = this.claimInformation.Claimrefno;
        i += 1;
      }
      if (i == this.passengersInVehicleArray.length) {
        let ReqObj = this.passengersInVehicleArray;
        console.log(this.passengersInVehicleArray);

        let UrlLink = `api/insertclaimintipassengvehlist`;
        return this.commondataService.onGetClaimList(UrlLink, ReqObj).subscribe((data: any) => {
          console.log("Independent", data);
          if (data.Errors) {
            let element = '';
            for (let i = 0; i < data.Errors.length; i++) {
              element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data.Errors[i].Message + "</div>";

            }
            Swal.fire(
              'Please Fill Valid Value',
              `${element}`,
              'error',
            )
          }
          else{
              this.GetReasonInfo.emit(this.createDamageToInsuVeh.value);
          }
        }, (err) => {
          this.handleError(err);
        })
      }

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
}
