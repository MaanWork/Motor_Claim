import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective  } from 'ng2-charts';
@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit,OnChanges {
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
    scales: {
    // xAxes: [{
    //       ticks: {
    //           fontColor: 'white'
    //       },
    //   }]
  }
  };
  public barChartLabels: BaseChartDirective["labels"] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Array<any> = [
    { backgroundColor: 'green' },
  ]

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
    let obj =  [{ data: data, label: label,"backgroundColor": "green",}]
    this.barChartData=obj;
  }

  ngOnChanges(){
    this.barChartType = this.chartType;
    this.onProcessessGrid;

  }

}
