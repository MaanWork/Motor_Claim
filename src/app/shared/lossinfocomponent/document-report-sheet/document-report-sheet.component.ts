import { find } from 'rxjs/operators';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ErrorService } from '../../services/errors/error.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document-report-sheet',
  templateUrl: './document-report-sheet.component.html',
  styleUrls: ['./document-report-sheet.component.css']
})
export class DocumentReportSheetComponent implements OnInit,OnDestroy {

  public claimDetails:any;
  public logindata:any;
  private subscription = new Subscription();
  public LossInformation:any;
  public documentName:any;
  public surveyDocumentReason:any='';
  public claimDocumentReason:any='';

  public documentReasonArray:any=[];
  public UploadDocLis:any=[];
  public documents:any;
  public waveOffYN='Y'
  constructor(
    private lossService:LossService,
    private bottomsheet: MatBottomSheetRef<DocumentReportSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private errorService:ErrorService
  ) { 
    console.log(this.data);
    this.documentName = this.data.documentDesc
  }

  ngOnInit(): void {
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    console.log(this.claimDetails);
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;

  this.subscription =  this.lossService.getLossInformation.subscribe(async (event: any) => {
      this.LossInformation = event;
      console.log(event);
    });

    this.subscription =  this.lossService.getUploadedDocumentList.subscribe(async (event: any) => {
      this.UploadDocLis = event;
      console.log(event);
    });

    this.documents = this.UploadDocLis.find((ele:any)=>ele.Doctypeid == this.data.documentId);
    console.log("filter",this.documents);
    if(this.documents != undefined){
      this.surveyDocumentReason = this.documents.Remarks;
      this.claimDocumentReason = this.documents.Waiveoffclaimremarks;

    }
    if(this.documents.Waiveoffyn == 'Y'){
      this.waveOffYN = 'Y';
    }
    if(this.documents.Waiveoffyn == 'N'){
      this.waveOffYN = 'N';

    }
    if(this.documents.Waiveoffyn == null){
      this.waveOffYN = '';

    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onSubmitDocumentReports(){

   

    let ReqObj = {
      "Claimno": this.claimDetails.Claimrefno,
      "Doctypeid": this.data.documentId,
      "Productid": "66",
      "Insid": this.data.companyId,
      "Description" : this.data.documentDesc,
      "Documentref":this.documents != undefined && this.documents != null?this.documents.Documentref:'',
      "PartyNo": this.LossInformation.PartyNo,
      "LossId": this.LossInformation.LosstypeId,
      "Waiveoffyn":this.waveOffYN,
      "Param":this.documents != undefined && this.documents != null?this.documents.Param:'',
      "Remarks": this.surveyDocumentReason,
      "Waiveoffby":this.logindata.UserType == 'claimofficer'?this.logindata.LoginId:'',
      "Waiveoffclaimremarks":this.claimDocumentReason,
      "UserType": this.logindata.UserType
    }
    let UrlLink = "wayoff";
    this.lossService.onSubmitDocumentReports(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("InsertDocument", data);
      if(data.Response=='waiveoff Submitted'){
        Swal.fire(
          'Submitted Successfully',
          'success'
        )
        let Obj={
          "Waiveoffyn":this.documents != undefined && this.documents != null?this.documents.Waiveoffyn:'',
          "Waiveoffclaimremarks":this.claimDocumentReason,
          "Remarks": this.surveyDocumentReason,
          "DocTypeId": this.data.documentId
        }
        this.documentReasonArray.push(Obj);
        this.bottomsheet.dismiss(this.documentReasonArray); //How this variable used?

      }
     
    }, (err) => {
      this.handleError(err);
    })
  }

  handleError(error) {
    let errorMessage: any = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = { 'ErrorCode': error.status, 'Message': error.message };
      this.errorService.showError(error, errorMessage);

    }

  }


 
}
