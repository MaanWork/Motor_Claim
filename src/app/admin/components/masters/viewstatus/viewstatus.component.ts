import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-viewstatus',
  templateUrl: './viewstatus.component.html',
  styleUrls: ['./viewstatus.component.scss']
})
export class ViewStatusComponent implements OnInit {

  title:any="";
   imageUrl:any;
   Status:any;
   minDate: Date;
   Date:any;
  constructor( public dialogRef: MatDialogRef<ViewStatusComponent>,public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any
  ,private datePipe:DatePipe) { 
this.minDate = new Date();
  }

  ngOnInit(): void {
      //this.title = this.data?.title.Effectivedate;
      console.log('MMMMMMMM',this.data?.title.Effectivedate);
      console.log('jjjjjjjjjjjj',this.data?.title);

      if(this.data?.title.Status!=null){
      this.Status=this.data?.title.Status;
      }
      else if(this.data?.title.status!=null){
        this.Status=this.data?.title.status;
      }
      if(this.data?.title.Effectivedate!=null){
      this.title=this.onDateFormatInEdit(this.data?.title.Effectivedate);
      }
      else if(this.data?.title.EffectiveDate!=null){
        this.title=this.onDateFormatInEdit(this.data?.title.EffectiveDate);
      }
      else if(this.data?.title.effectivedate!=null){
        this.title=this.onDateFormatInEdit(this.data?.title.effectivedate);
        }
      console.log('RRRRRRRR',this.title);
      //this.imageUrl = this.data?.imageUrl;
  }
  close(){ this.dialogRef.close(this.Date);}

  onDateFormatInEdit(date) {
    console.log(date);
    if (date) {
      let format = date.split('-');
      if(format.length >1){
        var NewDate = new Date(new Date(format[0], format[1], format[2]));
        NewDate.setMonth(NewDate.getMonth() - 1);
        return NewDate;
      }
      else{
        format = date.split('/');
        if(format.length >1){
          var NewDate = new Date(new Date(format[2], format[1], format[0]));
          NewDate.setMonth(NewDate.getMonth() - 1);
          return NewDate;
        }
      }

    }
  }

  submit(){
    let effectiveDate:any;
    if (this.title != '' && this.title != null && this.title != undefined) {
      effectiveDate =  this.datePipe.transform(this.title, "dd/MM/yyyy")
    }
    else{
      effectiveDate = "";
    }
  this.Date={
         "EffectiveDate":effectiveDate,
         "Status":this.Status,
    }
    this.close();
 console.log('FInal',effectiveDate);
  }
}
