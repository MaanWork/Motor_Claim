import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType, LabelItem } from 'chart.js';
@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {

  @Input("claimChart") onProcessessGrid:any
  @Input("chartType") chartType:any;

  public barChartOptions: ChartOptions = {
    responsive: true,
    // legend: {
    //   display: true,
    //   labels: {
    //     fontColor: 'white'
    //   }
    // },
  };
  public barChartLabels: LabelItem[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataset[] = [];

  constructor() {
    this.barChartType = this.chartType;
  }

  ngOnInit() {
    this.onLoadBarChart();

  }

  onLoadBarChart(){
    let data=[];
    let label='Series A';
    for (let index = 0; index < this.onProcessessGrid.length; index++) {
      const element = this.onProcessessGrid[index];
      this.barChartLabels.push(element.Statusdescrip);
      data.push(element.StatusCount);
    }
    let obj =  [{ data: data, label: label }]
    this.barChartData=obj;
  }

  ngOnChanges(){
    this.barChartType = this.chartType;
    this.onProcessessGrid;


  }


}
