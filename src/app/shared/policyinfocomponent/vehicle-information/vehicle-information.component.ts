import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-vehicle-information',
  templateUrl: './vehicle-information.component.html',
  styleUrls: ['./vehicle-information.component.css']
})
export class VehicleInformationComponent implements OnInit {

  @Input() VehicleInformation;
  public panelOpen:boolean=false;
  dataSource:any[]=[];
  displayedColumns: any[]=[]
  constructor() {

   }

  ngOnInit(): void {
    this.displayedColumns = ['CoverName', 'SumInsured', 'IncludedTax'];
    this.dataSource = [
    { CoverName: 'Health', SumInsured: 500000, IncludedTax: 10 },
    { CoverName: 'Life', SumInsured: 200000, IncludedTax: 15 },
    { CoverName: 'Home', SumInsured: 300000, IncludedTax: 5 },
    { CoverName: 'Car', SumInsured: 100000, IncludedTax: 8 }
  ];
  }

  onViewInfo(){
    this.panelOpen = !this.panelOpen;
  }

}
