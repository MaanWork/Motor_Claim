import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
declare var $:any;
@Component({
  selector: 'app-damage-details',
  templateUrl: './damage-details.component.html',
  styleUrls: ['./damage-details.component.css']
})
export class DamageDetailsComponent implements OnInit {

  @Output() public GetDamageInfo = new EventEmitter<any>();
  @Input() public claimRefNo:any;
  @Input() public claimInformation:any;
  damagepoints_11: boolean = false;
  damagepoints_8:  boolean = false;
  damagepoints_5:  boolean = false;
  damagepoints_13: boolean = false;
  damagepoints_15: boolean = false;
  damagepoints_16: boolean = false;
  damagepoints_14: boolean = false;
  damagepoints_10: boolean = false;
  damagepoints_7:  boolean = false;
  damagepoints_1:  boolean = false;
  damagepoints_4:  boolean = false;
  damagepoints_3:  boolean = false;
  damagepoints_2:  boolean = false;
  damagepoints_12: boolean = false;
  damagepoints_9:  boolean = false;
  damagepoints_6:  boolean = false;
  damagePointDetails:any;
  isSingleClick: boolean = true;
  damagePointsIds: any[]=[];
  constructor() { 
    
  }

  ngOnInit(): void {
    if(this.claimInformation){
      if(this.claimInformation.Claimrefno){
        this.claimRefNo = this.claimInformation.Claimrefno;
        this.setEditValues();
      }
    }
  }
  setEditValues(){
    this.damagePointsIds = this.claimInformation.Vehpartsid;
    if (this.damagePointsIds != null && this.damagePointsIds != undefined && this.damagePointsIds.length != 0) {
      for (let damage of this.damagePointsIds) {
        this.method1CallForClick(damage);
      }
    }
    else {
      this.damagePointsIds = [];
    }
  }
  method1CallForClick(id) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.onDamagecheckbox(id);
      }
    }, 250)
  }
  method2CallForDblClick(id) {
    this.isSingleClick = false;
    this.onDamagecheckboxRemove(id);
  }
  onDamagecheckbox(id) {
    let exist = this.damagePointsIds.some((ele: any) => ele == id);
    if (!exist) {
      this.damagePointsIds.push(id);
    }
    for (let index = 0; index < this.damagePointsIds.length; index++) {
      const element = this.damagePointsIds[index];
      $(`#damagepoints_${element}`).addClass("active");
    }
    console.log(this.damagePointsIds);
  }
  onDamagecheckboxRemove(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
          $(`#damagepoints_${id}`).removeClass("active");
          let index = this.damagePointsIds.findIndex((ele: any) => ele == id);
          console.log(index)
          this.damagePointsIds.splice(index, 1);
          console.log(this.damagePointsIds);
      }
    })
  }
  onDamageFormSubmit(){
    this.GetDamageInfo.emit(this.damagePointsIds);
  }
}
