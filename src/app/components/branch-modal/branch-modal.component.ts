import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-branch-modal',
  templateUrl: './branch-modal.component.html',
  styleUrls: ['./branch-modal.component.css']
})
export class BranchModalComponent implements OnInit {
  public branchList: any = [];
  public branchForm: FormGroup;
  public branchCode: any='';
  public filteredBranch: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public branchData: any,
    public dialogRef: MatDialogRef<BranchModalComponent>

  ) {
    console.log(branchData)
    this.onCreateFormControl();
    this.branchList = this.branchData?.branchList;

  }

  ngOnInit(): void {
    this.filteredBranch = this.branchForm.controls['branchCode'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );
  }

  onCreateFormControl() {
    this.branchForm = this.fb.group({
      branchCode: ['', Validators.required],
    });

  }



  private _filter(value: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return this.branchList.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));

  }
  onChangeBranch(event) {
    console.log(event)
     let branch = this.branchList.find((ele:any)=>ele.CodeDesc == event);
     this.branchCode = branch?.Code;

  }

  onSubmit(event) {
    this.dialogRef.close(this.branchCode);

  }

}
