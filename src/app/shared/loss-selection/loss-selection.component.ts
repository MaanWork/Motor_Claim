import { Component, OnInit, Inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-loss-selection',
  templateUrl: './loss-selection.component.html',
  styleUrls: ['./loss-selection.component.css']
})
export class LossSelectionComponent implements OnInit {
  lossTypeList: any=[];
  lossnew:any;
  selectedLossList:any;
  LossChoosedList:any=[];
  LossMovedList:any=[];
  PrimaryHead = false;
  PrimaryLoss={};SecondaryLoss={};
  primaryLength: number;
  secondaryLength:number;
  secondaryHead: boolean = false;
  logindata: any;lossList:any;
  secondarycheckbox: boolean=false;
  primaryCheckbox: boolean=false;
  constructor(
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private formBuilder:FormBuilder,
    private errorService: ErrorService,
    private authService:AuthService,
    public commonDataService:CommondataService,
    private router:Router,
    public dialogRef: MatDialogRef<LossSelectionComponent>
  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
   }

  ngOnInit(): void {
    this.getLossTypeList();
  }
  getLossTypeList() {
    let claimDetails = sessionStorage.getItem("ClaimDetails");
    let UrlLink = `api/claimlosstype`;
    let ReqObj = {
      "InsuranceId": this.logindata.InsuranceId,
      "PolicytypeId":"01",
      "Status":'Y'
    }
    return this.commonDataService.onGetClaimList(UrlLink,ReqObj).subscribe((data: any) => {
      //this.GenderTypeList = data;
      if (data != null) {
        this.lossnew =  cloneDeep(data);
        this.commonDataService.LossList = new Object(data);
        this.lossTypeList = cloneDeep(data)
      }

      if(this.data.Losstypeidlist!=''  && this.data.Losstypeidlist!=undefined && this.data.Losstypeidlist!=null){
        //this.onAddLossList(data.Losstypeidlist,'null','null');
        this.editlist(this.data.Losstypeidlist)
      }
    })
  }

  onChangeLossList(val,type,Index){
    let Exist = this.LossMovedList.some((ele:any)=>ele.Code == val.Code);
    if(!Exist){

      //this.LossChoosedList.push(val);
      this.LossMovedList.push(val);
      if(type=="primary"){
        this.lossTypeList?.Primary.splice(Index,1);
      }
      else{
        this.lossTypeList?.Secondary.splice(Index,1);
        //this.lossTypeList?.Primary.splice(Index,1);
      }
    }else{
      if(type=="primary"){
        this.PrimaryHead = false;
      }
      else{
        this.secondaryHead = false;
      }
      let Index = this.LossMovedList.findIndex((ele:any)=>ele.Code == val.Code);
      this.LossMovedList.splice(Index,1);
      
    }
  }
  onAddLossList(val,type,Index){
    let Exist = this.LossMovedList.some((ele:any)=>ele.Code == val.Code);
    if(!Exist){
      //this.LossChoosedList.push(val);
      this.LossMovedList.push(val);
    }
  }
  editlist(val){
   //this.LossChoosedList.push(val);
      //this.LossMovedList=val;
      let i;
      console.log('YYYYYYYYYYYY',val);
      if(this.data.Losstypeidlist.length!=0){
        for(let s of val){
          let Exist = this.lossnew.Primary.some((ele:any)=>ele.Code == s);
          console.log('UUUUUUUUUU',Exist);
          if(Exist){
            let Index = this.lossnew.Primary.find((ele:any)=>ele.Code == s);
           
            this.onChangeLossList(Index,'primary',i);
            this.onRemoveLossforedit(Index,'primary',i);
            //this.onRemoveLossList(Index,'primary',i);
            //this.LossMovedList.push(val);
        }
        else{
          let Exist = this.lossnew.Secondary.some((ele:any)=>ele.Code == s);
          if(Exist){
            let Index = this.lossnew.Secondary.find((ele:any)=>ele.Code == s);
            this.onChangeLossList(Index,'secondary',i);
            this.onRemoveLossforeditsecondary(Index,'secondary',i);
            //this.onChangeLossList(s,'secondary',i)
            //this.LossMovedList.push(val);
          }
        }
        i++;
        }
      }
      else{
        this.LossMovedList=[];
      }
     
      
  }
  onRemoveLossList(val,type,Index){
    let Exist = this.LossMovedList.some((ele:any)=>ele.Code == val.Code);
    if(Exist){
      if(type=="primary"){
        this.PrimaryHead = false;
      }
      else{
        this.secondaryHead = false;
      }
      let Index = this.LossMovedList.findIndex((ele:any)=>ele.Code == val.Code);
      this.LossMovedList.splice(Index,1);
      
    }
  }

  onRemoveLossforedit(val,type,Index){
    console.log('KKKKKKKK',val);
    let Exist = this.lossTypeList.Primary.some((ele:any)=>ele.Code == val.Code);
    console.log('GGGGGGGGGGGGGGG',Exist)
    if(Exist){
      if(type=="primary"){
        this.PrimaryHead = false;
        //this.primaryCheckbox=true;
      }
      else{
        this.secondaryHead = false;
        this.secondarycheckbox=false;
      }
      let Index = this.lossTypeList.Primary.findIndex((ele:any)=>ele.Code == val.Code);
      this.lossTypeList.Primary.splice(Index,1);
      
    }
  }
  onRemoveLossforeditsecondary(val,type,Index){
    let Exist = this.lossTypeList.Secondary.some((ele:any)=>ele.Code == val.Code);
    if(Exist){
      if(type=="primary"){
        this.PrimaryHead = false;
      }
      else{
        this.secondaryHead = false;
      }
      let Index = this.lossTypeList.Secondary.findIndex((ele:any)=>ele.Code == val.Code);
      this.lossTypeList.Secondary.splice(Index,1);
      
    }
  }
  onExcludeLoss(val,index){
    let entry = this.lossnew.Primary.find(ele=>ele.Code==val.Code);
    if(entry){
      this.lossTypeList.Primary = [entry].concat(this.lossTypeList.Primary);
      this.PrimaryHead = false;
      this.primaryCheckbox=false;
      this.PrimaryLoss['Primary'+val.Code] = false;
      //this.lossTypeList.Primary.concat([entry.Code]);
    }
    else{
      let subEntry = this.lossnew.Secondary.find(ele=>ele.Code==val.Code);
      this.secondaryHead = false;
      this.secondarycheckbox = false;
      if(subEntry){
        this.lossTypeList.Secondary =  [subEntry].concat(this.lossTypeList.Secondary);
      }
      //this.lossTypeList.Secondary.concat([subEntry])
    }
    this.LossMovedList.splice(index,1)
  }

  onMoveLoss(loss){
    this.LossMovedList = [];
     this.onSelectAllPrimary(true);
     this.onSelectAllSecondary(true);
  }
  onClearAllLoss(){
    this.onSelectAllPrimary(false);
     this.onSelectAllSecondary(false);
   
  }
  async onSelectAllPrimary(event){
    this.primaryLength = this.lossnew?.Primary?.length;

    // if(this.primaryLength==0){
    //   this.LossMovedList=[];
    //   this.getLossTypeList();
    // }
    if(event){
      this.primaryCheckbox=true;
      this.lossTypeList.Primary = [];
      for (let index = 0; index < this.primaryLength; index++) {
        const element = this.lossnew.Primary[index];
        this.PrimaryLoss['Primary'+element.Code] = true;
        await this.onAddLossList(element,'primary',index);
        //await this.onRemoveLossforedit(element,'primary',index);  
      }
    }else{
      // if(this.primaryLength==0){
      //     this.LossMovedList=[];
      //     this.lossTypeList=this.lossnew;
      //     console.log('SSSSSSSSSSS')
      //   }
      this.primaryCheckbox=false;
      this.lossTypeList.Primary=this.lossnew.Primary;
          for (let index = 0; index < this.primaryLength; index++) {
            const element = this.lossnew.Primary[index];
            this.PrimaryLoss['Primary'+element.Code] = false;
            let entry = this.lossnew.Primary.find(ele=>ele.Code==element.Code);
            // if(entry){
            //   this.lossTypeList.Primary = [entry].concat(this.lossTypeList.Primary);
            // }
            //this.lossTypeList.Primary = [index].concat(this.lossTypeList.Primary);
            await this.onRemoveLossList(element,'primary',index); 
            if(index==this.primaryLength)this.lossTypeList.Primary.push(entry);
            //this.lossTypeList.Primary.push(this.lossnew.Primary);
            }  
            
        
       
        //await this.onRemoveLossforedit(element,'primaty',index);  
    }
  }

  

  onSelectAllSecondary(event){
    this.secondaryLength = this.lossnew?.Secondary?.length;
    // if(this.lossTypeList.Secondary.length==0){
    //   this.LossMovedList=[];
    //   this.getLossTypeList();
    // }
    if(event){
      this.secondarycheckbox=true;
      this.lossTypeList.Secondary = [];
      for (let index = 0; index < this.secondaryLength; index++) {
        const element = this.lossnew.Secondary[index];
        this.SecondaryLoss['Secondary'+element.Code] = true;
        this.onAddLossList(element,'secondary',index);
        //await this.onRemoveLossforedit(element,'primary',index);  
      }
      // this.secondaryHead = true;
      // for (let index = 0; index < this.lossTypeList.Secondary.length; index++) {
      //   const element = this.lossTypeList.Secondary[index];
      //   this.SecondaryLoss['Secondary'+element.Code] = true;
      //   this.onAddLossList(element,'secondary',index);
      //   this.onRemoveLossforeditsecondary(element,'secondary',index);
      // }
    }else{
      this.secondarycheckbox=false;
      //this.lossTypeList.Secondary=this.lossnew.Secondary
      for (let index = 0; index < this.secondaryLength; index++) {
        const element = this.lossnew.Secondary[index];
        this.SecondaryLoss['Secondary'+element.Code] = false;
        let entry = this.lossnew.Secondary.find(ele=>ele.Code==element.Code);
            // if(entry){
            //   this.lossTypeList.Secondary = [entry].concat(this.lossTypeList.Secondary);
            // }
        this.onRemoveLossList(element,'secondary',index);
        if(index==this.secondaryLength)this.lossTypeList.Secondary.push(entry);
        //this.lossTypeList.Secondary.push(this.lossnew.Secondary);
        //this.onRemoveLossforeditsecondary(element,'secondary',index);
     } 
    }
  }
  closefunction(){
    let i=0;
    let finishedlist:any=[];
    if(this.data.Losstypeidlist.length!=0){
      for(let s of this.data.Losstypeidlist){
        let Exist = this.LossMovedList.find((ele:any)=>ele.Code ==s );
        if(Exist){
           finishedlist.push(Exist);
         
        }
        else{

        }
        i+=1;
      }
     
    }
    this.dialogRef.close(finishedlist);
    
  }
  onSubmitLossDetails(type){
    if(type=='submit') this.dialogRef.close(this.LossMovedList);
    else {
      this.closefunction();
    }
    //this.editlist(this.LossMovedList);
  }
}
