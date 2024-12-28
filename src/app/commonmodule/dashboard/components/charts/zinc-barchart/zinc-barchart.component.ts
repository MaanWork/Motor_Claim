import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-zinc-barchart',
  templateUrl: './zinc-barchart.component.html',
  styleUrls: ['./zinc-barchart.component.css']
})
export class ZincBarchartComponent implements OnInit {

  @Input("LossStatus") LossStatus:any
  // impressionsSpark:zingchart.graphset = {
  //   "type": "area",
  //   "plotarea": {
  //     margin: 3,
  //   },
  //   scaleX: {
  //     visible: false,
  //   },
  //   scaleY: {
  //     visible: false,
  //   },
  //   tooltip: {
  //     visible: true,
  //   },
  //   plot: {
  //     aspect: 'spline',
  //     marker: {
  //       visible: false,
  //     },
  //     animation: {
  //       effect: 3,
  //       speed: 500,
  //       method: 5,
  //       sequence: 1
  //     },
  //   },

  //   "series": [
  //     {
  //       "values": [3,4,6,7,4,10],
  //       backgroundColor: '#8bc34a',
  //     }
  //   ]
  // };
  constructor() { }

  ngOnInit(): void {
  }

}
