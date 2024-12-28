import { Component, OnInit, Input } from '@angular/core';
import { WaveOffModalComponent } from '../wave-off-modal/wave-off-modal.component';
import Swal from 'sweetalert2';
import { ImageviewModalComponent } from '../../imageview-modal/imageview-modal.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CommondataService } from '../../services/commondata.service';
import { MatDialog } from '@angular/material/dialog';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ErrorService } from '../../services/errors/error.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loss-surveyor-document-file',
  templateUrl: './loss-surveyor-document-file.component.html',
  styleUrls: ['./loss-surveyor-document-file.component.css']
})
export class LossSurveyorDocumentFileComponent implements OnInit {

  public DocumentImageList: any = [];
  public claimDetails: any = {};
  public logindata: any = {};
  public imageUrl: any;
  public DocumentsFiles: any = [];
  public LossInformation: any;
  public isEditImagelgnth: any = 0;
  public my = {};
  public viewReports = {};
  public UploadDocumentList: any = [];
  private subscription = new Subscription();
  public isCheck = {};
  public reason = {};
  public waveOffYN = {}
  public hideWave={};
  @Input() claimInfo;
  @Input() lossInfo;
  public NoDocumentList: any = [];
  public WaveOffYN:any='';
  public panelOpen: boolean = false;
  addDocSection = false;
  additionalDocumentImageList: any[]=[];
  selectedExistingDoc: any[]=[];

  constructor(
    private errorService: ErrorService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private lossService: LossService,
    public commondataService: CommondataService,
    public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet


  ) { }

  ngOnInit(): void {
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    if (this.claimInfo && this.claimInfo != undefined) {
      this.onGetDocumentList(this.claimInfo);
    }
    else {
      this.subscription = this.lossService.getLossInformation.subscribe(async (event: any) => {
        this.LossInformation = event;
        this.onGetDocumentList(event);
        //this.getAdditionalDocList(event)
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkSelectedDoc(rowData){
      if(this.selectedExistingDoc.length != 0){
        return this.selectedExistingDoc.some((ele:any)=>ele.Documentid == rowData.Documentid);

      }
      else{
        return false;
      }
  }
  getAdditionalDocList(lossInfo){
    let lossTypeId = [];
    if (lossInfo.LosstypeId != '') {
      lossTypeId.push(lossInfo.LosstypeId);
    }
    let ReqObj:any;
      ReqObj =  {
        "LossTypeId": lossTypeId,
        "Claimlosstypeid" : lossTypeId[0],
        "status" : "Y",
        "InsuranceId" : this.logindata.InsuranceId
       }
    let UrlLink = `api/addadditionaldoclist`;
    return this.lossService.onGetDocumentList(UrlLink, ReqObj).subscribe((data: any) => {
        this.additionalDocumentImageList = data;
        this.addDocSection = true;
      }, (err) => {
        this.handleError(err);
      })
  }
  onGetDocumentList(lossInfo) {
    let lossTypeId = [];
    if (lossInfo.LosstypeId != '') {
      lossTypeId.push(lossInfo.LosstypeId);
    }
    let ReqObj:any;
    let UrlLink = "";
    if(this.claimInfo && this.claimInfo != undefined){
      UrlLink = `api/getclaimdocmaster`;
      ReqObj = {
        "InsuranceId": this.logindata.InsuranceId,
        "Status": "Y",
        "Docapplicable" : "CLAIM-INTIMATION"
      }
    }
    else{
      UrlLink = `api/getclaimdocmaster`;
      ReqObj = {
        "InsuranceId": this.logindata.InsuranceId,
        "Docapplicable" : "CLAIM-ASSESSOR",
        "Status": "Y"
      }
    }

    return this.lossService.onGetDocumentList(UrlLink, ReqObj).subscribe((data: any) => {
      this.DocumentImageList = data;
      if (this.DocumentImageList.length>0) {
       this.onGetUploadedDocuments(lossInfo);
      }

    }, (err) => {
      this.handleError(err);
    })
  }



  onGetUploadedDocuments(event) {
    let claimRefNo = "";
    let createdBy = [];
    if (this.claimDetails) {
      claimRefNo = this.claimDetails.Claimrefno
    }
    else if (this.claimInfo) {
      claimRefNo = this.claimInfo.ClaimRefNo;
    }
    // let ReqObj = {
    //   "Claimno": claimRefNo,
    //   "PartyNo": event.PartyNo,
    //   "LossId": event.LosstypeId,
    //   "CreatedBy": event.CreatedBy,
    // }
    createdBy.push(event.CreatedBy)
    let logExist = createdBy.some((ele:any)=>ele == this.logindata.LoginId);
    if(!logExist){
      createdBy.push(this.logindata.LoginId);
    }
    let ReqObj = {
      "Claimno": claimRefNo,
      "PartyNo": event.PartyNo,
      "LossId": event.LosstypeId,
      "Accimage": 'Y',
      "Insid":this.logindata.InsuranceId,
      "CreatedBy": createdBy,
      "LoginId":this.logindata.LoginId
    }
    let UrlLink = `getdoclist`;
    return this.lossService.onGetUploadedDocuments(UrlLink, ReqObj).subscribe((data: any) => {

      this.UploadDocumentList = data;
      this.lossService.onUploadedDocumentList(this.UploadDocumentList);
      let LossDocumentFile = data.filter((ele: any) => ele.docApplicable == 'CLAIM-ASSESSOR');
      this.NoDocumentList = this.UploadDocumentList.filter((ele: any) => ele.FilePathName == null);
      if (this.NoDocumentList.length > 0) {
        for (let index = 0; index < this.NoDocumentList.length; index++) {
          const element = this.NoDocumentList[index];
          let Index = this.DocumentImageList.findIndex((ele: any) => ele.documentId == element.documentId);
          this.DocumentImageList.splice(Index, 1);
        }

      }

      if (LossDocumentFile.length > 0) {
        for (let index = 0; index < LossDocumentFile.length; index++) {
          const element = LossDocumentFile[index];
          this.onGetBase64Image(element);
        }
      }
    }, (err) => {
      this.handleError(err);
    })
  }

  onGetBase64Image(list) {
    // console.log("Received List", list);
    // let UrlLink = "getimagefile";
    // let claimRefNo = "";
    // if (this.claimDetails) {
    //   claimRefNo = this.claimDetails.Claimrefno
    // }
    // else if (this.claimInfo) {
    //   claimRefNo = this.claimInfo.ClaimRefNo
    // }
    // let reqObj = {
    //   "ClaimNo": claimRefNo,
    //   "ReqRefNo": list.Documentref,
    //   "DocTypeId": list.Doctypeid,
    //   "ProductId": list.ProductId,
    //   "InsId": list.companyId
    // }
    // return this.lossService.onGetBase64Image(UrlLink, reqObj).subscribe((data: any) => {
    //   console.log('imageedit', data)
      this.OnEditAccidentPhotos(list);
    // }, (err) => {
    //
    //   this.handleError(err);
    // })
  }

  onBase64dataURLtoFile(dataurl, filename) {
    if (dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }

  }



  onLossDocuments(event, item) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    var filename = event.target.files[0].name;
    let imageUrl: any;
    reader.onload = (event) => {
      let partyNo = "";
      let lossId = "";
      if (this.LossInformation) {
        partyNo = this.LossInformation.PartyNo;
        lossId = this.LossInformation.LosstypeId;
      }
      else if (this.claimInfo) {
        partyNo = this.claimInfo.PartyNo;
        lossId = this.claimInfo.LosstypeId;
      }
      imageUrl = event.target.result;
      this.imageUrl = imageUrl;
      this.onSetBackGroundImage(imageUrl, item);
      var JsonObj = {
        "ProductId": item.ProductId,
        "DocumentUploadDetails": [
          {
            "DocTypeId": item.documentId,
            "FilePathName": "",
            "Description": item.documentDesc,
            "ProductId": item.ProductId,
            "FileName": filename,
            "OpRemarks": item.remarks,
            "UploadType": item.docApplicable,
            "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
            "DocId": item.documentId,
            "InsId": item.companyId,
            "CreatedBy": this.logindata.LoginId,
            "LossId": "52",
            "PartyNo": "1",
            "Devicefrom":"WebApplication"
          }
        ]

      }

      let findSameId = this.DocumentsFiles.findIndex((ele: any) => ele.JsonString.DocumentUploadDetails[0].DocTypeId == item.documentId);

      if (findSameId && findSameId != -1) {
        this.DocumentsFiles[findSameId] = { 'url': this.imageUrl, 'JsonString': JsonObj };

      } else {
        this.DocumentsFiles.push({ 'url': this.imageUrl, 'JsonString': JsonObj });
      }

    }
  }

  onSetBackGroundImage(imageUrl, item) {
    let image = (<HTMLInputElement>document.getElementById(`Image_${item.documentId}`));
    if(imageUrl && item.docApplicable == 'CLAIM-ASSESSOR'){
      image.style.backgroundImage = "url(" + imageUrl + ")";
      this.my['image' + item.documentId] = imageUrl;
      this.hideWave['Check'+item.documentId] = false;

    }
  }


  OnEditAccidentPhotos(item) {
    var filename = item.FileName;
    ++this.isEditImagelgnth;
    this.imageUrl = item.IMG_URL;
    this.onSetBackGroundImage(this.imageUrl, item);
    let partyNo = "";
    let lossId = "";
    if (this.LossInformation) {
      partyNo = this.LossInformation.PartyNo;
      lossId = this.LossInformation.LosstypeId;
    }
    else if (this.claimInfo) {
      partyNo = this.claimInfo.PartyNo;
      lossId = this.claimInfo.LosstypeId;
    }
    var JsonObj = {
      "ProductId": item.ProductId,
      "DocumentUploadDetails": [
        {
          "DocTypeId": item.documentId,
          "FilePathName": "",
          "Description": item.documentDesc,
          "ProductId": item.ProductId,
          "FileName": filename,
          "OpRemarks": item.remarks,
          "UploadType": item.docApplicable,
          "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
          "DocId": item.documentId,
          "InsId": item.companyId,
          "CreatedBy": this.logindata.LoginId,
          "LossId": "52",
          "PartyNo": "1",
          "Devicefrom":"WebApplication"
        }
      ]

    }
    if (this.DocumentsFiles.length >= 10) {
      Swal.fire(
        `You can Upload Only 10 file`,
        'info'
      )
    } else {
      this.DocumentsFiles.push({ 'url': this.imageUrl, 'JsonString': JsonObj });

    }

  }



  damageListDisabled() {
    if (this.logindata?.UserType == "claimofficer" && !this.claimInfo) {
      if(this.lossInfo?.GarageYn == 'N' || this.lossInfo?.SurveyorYn == 'N'){
        return true;
      }
      else{
        return false
      }
    }
    else{
      return false;
    }
  }





  onUploadFiles() {

    let i = 0;

    if (this.isEditImagelgnth > 0) {
      this.DocumentsFiles.splice(0, this.DocumentsFiles);
    }

    for (let index = 0; index < this.DocumentsFiles.length; index++) {
      const element = this.DocumentsFiles[index];
      if (this.claimDetails) {
        element.JsonString['ClaimNo'] = this.claimDetails.Claimrefno;
      }
      else if (this.claimInfo) {
        element.JsonString['ClaimNo'] = this.claimInfo.ClaimRefNo;
      }
      var formData = new FormData();
      formData.append(`file`, element.url,);
      formData.append(`JsonString`, JSON.stringify(element.JsonString));
      let UrlLink = `upload`;
      this.lossService.onUploadFiles(UrlLink, formData).subscribe((data: any) => {
        if (data.message == 'Not Inserted') {
          i++;
        }
        if (index == this.DocumentsFiles.length - 1) {

          if (i == 0) {
            if (this.claimDetails) {
              Swal.fire(
                'Document Uploaded Succssesfully!',
                `Claimno: ${this.claimDetails.ClaimNo}`,
                'success'
              )
            }
            else if (this.claimInfo) {
              Swal.fire(
                'Document Uploaded Succssesfully!',
                `Claimno: ${this.claimInfo.ClaimRefNo}`,
                'success'
              )
            }

          }
          else {
            if (this.claimDetails) {
              Swal.fire(
                'Document Upload Failed!',
                `Claimno: ${this.claimDetails.ClaimNo}`,
                'error'
              )
            }
            else if (this.claimInfo) {
              Swal.fire(
                'Document Upload Failed!',
                `Claimno: ${this.claimInfo.ClaimRefNo}`,
                'error'
              )
            }
          }
        }
      }, (err) => {

        let element = '';
        if (err.statusText) {
          element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + err.statusText + "</div>";

        }
        Swal.fire(
          'Please Fill Valid Value',
          `${element}`,
          'error',
        )
        this.handleError(err);
      })
    }
  }

  onViewImage(imageurl, filename) {
    let item = { url: imageurl, name: filename }
    this.commondataService.onGetImageUrl(item);
    const dialogRef = this.dialog.open(ImageviewModalComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  async onDeleteDocument(item) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        if (item) {
          let index = this.DocumentsFiles.findIndex((ele: any) => ele.JsonString.DocumentUploadDetails[0] == item.documentId);
          this.DocumentsFiles.splice(index, 1);
          let image = (<HTMLInputElement>document.getElementById(`Image_${item.documentId}`));
          image.style.backgroundImage = "url()";
          this.my['image' + item.documentId] = undefined;

        }

        let onDelete = this.UploadDocumentList.find((ele: any) => ele.documentId == item.documentId);

        if (onDelete) {
          let UrlLink = "deletedoc";
          let claimRefNo = "";
          if (this.claimDetails) {
            claimRefNo = this.claimDetails.Claimrefno
          }
          else if (this.claimInfo) {
            claimRefNo = this.claimInfo.ClaimRefNo
          }
          let reqObj = {
            "Claimno": claimRefNo,
            "Documentref": onDelete.Documentref,
            "Doctypeid": item.documentId,
            "Filepathname": onDelete.FilePathName
          }

          return this.lossService.onDeleteDocument(UrlLink, reqObj).subscribe((data: any) => {
            this.onGetDocumentList(this.LossInformation);

            Swal.fire(
              data.Messeage,
              'success'
            )
          }, (err) => {

            this.handleError(err);
          })
        }
      }
    });

  }

  onGetWaveoff(item,val){
    const dialogRef = this.dialog.open(WaveOffModalComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: {"WaveDocList": item, "Document": this.UploadDocumentList.find((ele: any) => ele.documentId == item.documentId), "isHaveDocument": false,"Waveoff":val }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.subscription = this.lossService.getLossInformation.subscribe(async (event: any) => {
        this.LossInformation = event;
        this.onGetDocumentList(event)
      });
    });
  }

  isChangeDocumentReason(event, item) {
    if (event.checked == true) {
      const dialogRef = this.dialog.open(WaveOffModalComponent, {
        width: '100%',
        panelClass: 'full-screen-modal',
        data: { "WaveDocList": this.NoDocumentList.find((ele: any) => ele.documentId == item.documentId), "Document": item, "isHaveDocument": false }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.subscription = this.lossService.getLossInformation.subscribe(async (event: any) => {
          this.LossInformation = event;
          this.onGetDocumentList(event)
        });
      });
    }

  }

  onHaveDocument(item) {
    const dialogRef = this.dialog.open(WaveOffModalComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: { "WaveDocList": item, "Document": this.UploadDocumentList.find((ele: any) => ele.documentId == item.documentId), "isHaveDocument": true }
    });
    dialogRef.componentInstance.UploadDocument.subscribe(data => {
      this.subscription = this.lossService.getLossInformation.subscribe(async (event: any) => {
        this.LossInformation = event;
        this.onGetDocumentList(event)
      });
    })
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onCheckWaveoff(item) {
    let check = this.UploadDocumentList.find((ele: any) => ele.documentId == item.documentId)
    return check?.FilePathName == null;
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
