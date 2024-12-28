import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-btn-footer',
  templateUrl: './btn-footer.component.html',
  styleUrls: ['./btn-footer.component.css']
})
export class BtnFooterComponent implements OnInit {

  constructor(
    private location: Location,

  ) { }

  ngOnInit(): void {
  }

  back(): void {
    this.location.back()
  }

}
