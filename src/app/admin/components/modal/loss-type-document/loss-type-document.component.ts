import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loss-type-document',
  templateUrl: './loss-type-document.component.html',
  styleUrls: ['./loss-type-document.component.css']
})
export class LossTypeDocumentComponent implements OnInit {

  DocumentImageList: any[]=[];
  partList: any[]=[];
  mandatoryList: any[]=[];
  searchValue:any="";
  dialog: MatDialog;
  constructor(
    public dialogRef: MatDialogRef<LossTypeDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log("Received Data",this.data);
    this.DocumentImageList = this.data.docList;
    this.partList = this.data.partList;
    this.mandatoryList = this.data.mandatoryList;
  }
  finalList(){
    let finalList = {
      partList: null,
      mandatoryList: null
    }
    this.dialogRef.close(finalList);
  }
  saveDocumentList(){
    let finalList = {
      partList:this.partList,
      mandatoryList:this.mandatoryList
    }
    this.dialogRef.close(finalList);
  }
  getMandatoryDocuments(rowData){
    if(this.mandatoryList.length>0){
      if(rowData.mandatoryStatus == 'Y'){
          if(this.partList.some(el => el == rowData.documentId)){
            if(this.mandatoryList.some(el => el == rowData.documentId)){
              return true;
            }
          }
          else{
            if(rowData.mandatoryStatus == 'Y' && !this.partList.some(el => el == rowData.documentId)){
              return true;
            }
            else{
              return false;
            }
            
          }
      }
      else{
        return false;
      }
    }
    else{
        return rowData.mandatoryStatus == 'Y';
    }
   
    
  }
  setMandatoryStatus(rowData,value){
    if(value){
      this.mandatoryList.push(rowData.documentId);
      this.mandatoryList = this.mandatoryList.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      })
    }
    else{
        let index = this.mandatoryList.indexOf(rowData.documentId);
        rowData.mandatoryStatus = 'N';
        this.mandatoryList.splice(index,1);
    }
  }
  getSelectedDocuments(rowData){
    let count = 0;
    if(this.partList.length!=0){
      if(this.partList.some(el => el == rowData.documentId)){
          if(rowData.mandatoryStatus == 'Y'){
        // let exist = this.mandatoryList.some((ele:any)=>ele ==rowData.documentId);
        // if(!exist){
        //   this.mandatoryList.push(rowData.documentId);
        //   console.log("Mandatory List",this.mandatoryList);
        // }
      }
      }
      
      return this.partList.some(el => el == rowData.documentId);
    }
    else{
      return false;
    }
  }
  setSelectValues(rowData,value){
    let exist = this.partList.some((ele:any)=>ele ==rowData.documentId);
    console.log(exist)
    if(!exist){
      this.partList.push(rowData.documentId);
      this.getSelectedDocuments(rowData);
      this.getDisabledCheckSection(rowData);
        if(rowData.mandatoryStatus == 'Y'){
          let exist = this.mandatoryList.some((ele:any)=>ele ==rowData.documentId);
          if(!exist){
            this.mandatoryList.push(rowData.documentId);
            console.log("Mandatory List",this.mandatoryList);
          }
        }
    }
    else{
      let index = this.partList.findIndex((ele:any)=>ele==rowData.documentId);
      this.partList.splice(index,1);
      let mandIndex = this.mandatoryList.indexOf(rowData.documentId);
      this.mandatoryList.splice(mandIndex,1);
      console.log("Part List",this.partList);
      this.getSelectedDocuments(rowData);
      this.getDisabledCheckSection(rowData);
  }
  console.log("Mandatoryyyyy",this.mandatoryList);
  }
  getDisabledCheckSection(rowData){
    if(this.partList.length!=0){
      return !this.partList.some(el => el == rowData.documentId);
    }
    else{
      return true;
    }
  }
}
