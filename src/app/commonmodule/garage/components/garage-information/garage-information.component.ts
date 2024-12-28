import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-garage-information',
  templateUrl: './garage-information.component.html',
  styleUrls: ['./garage-information.component.css']
})
export class GarageInformationComponent implements OnInit {

  @Input() GarageInformation:any;
  constructor() { }

  ngOnInit(): void {
  }

}
