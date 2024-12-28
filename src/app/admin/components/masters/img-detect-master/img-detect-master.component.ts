import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-img-detect-master',
  templateUrl: './img-detect-master.component.html',
  styleUrls: ['./img-detect-master.component.css']
})
export class ImgDetectMasterComponent implements OnInit {

  public FormGroupData:FormGroup;
  public InsertMode: any = 'Insert';
  public panelOpen: boolean = true;

  constructor(
    private formBuilder:FormBuilder
  ) { }

  ngOnInit(): void {
    this.onCreateFormControl();
  }


  onCreateFormControl() {
    this.FormGroupData = this.formBuilder.group({

    })
  }

  onAddNew() {
    this.InsertMode = 'Insert';
    if(this.InsertMode == 'Insert'){
      this.onCreateFormControl();
    }

  }
}
