import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-deductible-master',
  templateUrl: './deductible-master.component.html',
  styleUrls: ['./deductible-master.component.css']
})
export class DeductibleMasterComponent implements OnInit {

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
