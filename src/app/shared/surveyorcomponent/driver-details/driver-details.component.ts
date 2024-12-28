import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.css']
})
export class DriverDetailsComponent implements OnInit {

  @Input() DriverInfo:any;
  constructor() { }

  ngOnInit(): void {
    console.log("driver",this.DriverInfo);
  }

}
