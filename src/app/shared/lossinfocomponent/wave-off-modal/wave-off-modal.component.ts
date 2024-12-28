import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { NewLossModalComponent } from 'src/app/commonmodule/loss/new-loss-modal/new-loss-modal.component';
import Swal from 'sweetalert2';
import { ErrorService } from '../../services/errors/error.service';

@Component({
  selector: 'app-wave-off-modal',
  templateUrl: './wave-off-modal.component.html',
  styleUrls: ['./wave-off-modal.component.css']
})
export class WaveOffModalComponent implements OnInit {
  public claimDetails: any;
  public logindata: any;
  public WaveOffRemarks: any = '';
  public WaveOffRemarksClaim:any='';
  public LossInformation: any;
  private subscription = new Subscription();
  public ImgUrl:any;
  public JsonString:any;
  @Output() UploadDocument = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lossService: LossService,
    private errorService: ErrorService,
    public dialogRef: MatDialogRef<NewLossModalComponent>


  ) {
    console.log(this.data);
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.WaveOffRemarks = this.data?.Document?.Remarks;
  }

  ngOnInit(): void {
    this.subscription = this.lossService.getLossInformation.subscribe(async (event: any) => {
      this.LossInformation = event;
    });
  }

  onLossDocuments(event) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    var filename = event.target.files[0].name;

    reader.onload = (event) => {
     this.ImgUrl = event.target.result;
      this.onSetBackGroundImage(event.target.result);
      this.JsonString = {
        "ProductId": this.data.Document.ProductId,
        "ClaimNo":this.claimDetails.Claimrefno,
        "DocumentUploadDetails": [
          {
            "DocTypeId": this.data?.Document?.documentId,
            "FilePathName": "",
            "Description":this.data?.Document?.documentDesc,
            "ProductId": this.data?.Document?.ProductId,
            "FileName": filename,
            "OpRemarks": this.data?.Document?.remarks,
            "UploadType": this.data?.Document?.docApplicable,
            "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
            "DocId": this.data?.Document?.documentId,
            "InsId": this.data?.Document?.companyId,
            "CreatedBy": this.logindata.LoginId,
            "LossId": this.LossInformation?.LosstypeId,
            "PartyNo":  this.LossInformation?.PartyNo,
            "Devicefrom":"WebApplication"
          }
        ]

      }
      console.log(this.JsonString)
    }
  }

  onUpload(){
    var formData = new FormData();
      formData.append(`file`, this.ImgUrl,);
      formData.append(`JsonString`, JSON.stringify(this.JsonString));
      let UrlLink = `upload`;
      this.lossService.onUploadFiles(UrlLink, formData).subscribe((data: any) => {
        console.log("DocumentsFiles", data);
        this.UploadDocument.emit(data);
        this.dialogRef.close(data);


      }, (err) => {

        this.handleError(err);
      })
  }

  onSetBackGroundImage(imageUrl) {
    let image = (<HTMLInputElement>document.getElementById(`Image_Set`));
    image.style.backgroundImage = "url(" + imageUrl + ")";

  }

  onSubmitDocumentReports() {

    let ReqObj = {
      "Claimno": this.claimDetails.Claimrefno,
      "Doctypeid": this.data?.Document?.documentId,
      "Productid": "66",
      "Insid": this.data?.Document?.companyId,
      "Description": this.data?.Document?.documentDesc,
      "Documentref": this.data?.WaveDocList?.Documentref,
      "PartyNo": this.LossInformation.PartyNo,
      "LossId": this.LossInformation.LosstypeId,
      "Waiveoffyn": this.data?.Waveoff,
      "Param": this.data?.WaveDocList?.Param,
      "Remarks": this.WaveOffRemarks,
      "Waiveoffby": this.logindata.UserType == 'claimofficer' ? this.logindata.LoginId : '',
      "Waiveoffclaimremarks": this.WaveOffRemarksClaim,
      "UserType": this.logindata.UserType,
    }
    let UrlLink = "wayoff";
    this.lossService.onSubmitDocumentReports(UrlLink, ReqObj).subscribe((data: any) => {
      console.log(data)
      if (data.Errors) {
        let element = '';
        for (let i = 0; i < data.Errors.length; i++) {
          element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data.Errors[i].Message + "</div>";

        }
        Swal.fire(
          'Please Fill Valid Value',
          `${element}`,
          'error',
        )
      }
      if (data.Response == 'waiveoff Submitted') {
        this.dialogRef.close(data);
        Swal.fire(
          'Submitted Successfully',
          'success'
        )
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
