import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-newnotified',
  templateUrl: './newnotified.component.html',
  styleUrls: ['./newnotified.component.css']
})
export class NewnotifiedComponent implements OnInit {
  @Input() NotifiedNumber:any;
  constructor() { }

  ngOnInit(): void {
  }

}
