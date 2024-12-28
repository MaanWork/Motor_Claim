import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.css']
})
export class CustomerInformationComponent implements OnInit,OnChanges {

  @Input() CustomerInformation;
  public panelOpen:boolean=false;
  constructor() {
  }

  ngOnInit(): void {
    console.log(this.CustomerInformation)
  }

  ngOnChanges(){
    this.CustomerInformation;
  }
  onViewInfo(){
    this.panelOpen = !this.panelOpen;
  }

}
