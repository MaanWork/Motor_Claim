import { DocumentReportSheetComponent } from './../document-report-sheet/document-report-sheet.component';
import { find } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from '../../services/errors/error.service';
import { LossService } from '../../../commonmodule/loss/loss.service';
import { Component, OnInit, OnDestroy, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, AfterContentChecked } from '@angular/core';
import Swal from 'sweetalert2';
import { ImageviewModalComponent } from '../../imageview-modal/imageview-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommondataService } from '../../services/commondata.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { forkJoin, Subscription } from 'rxjs';
import { LossDocumentAiModalComponent } from '../loss-document-ai-modal/loss-document-ai-modal.component';
import * as _ from 'lodash';
@Component({
  selector: 'app-loss-accident-file',
  templateUrl: './loss-accident-file.component.html',
  styleUrls: ['./loss-accident-file.component.css'],

})
export class LossAccidentFileComponent implements OnInit, OnDestroy, AfterContentChecked {
  public logindata: any = {};
  public claimDetails: any;
  public DocumentImageList: any = [];
  public UploadDocumentList: any = [];
  public AccidentPhotos: any = [];
  public imageUrl: any;
  public fileuploadDisable: any;
  public isEditImagelgnth: any = 0;
  public LossInformation: any;
  aiDocSection = false;
  private subscription = new Subscription();
  @Input() claimInfo;
  @Input() lossAcc;
  @Input() lossInfo;
  @Input() pagefrom;
  viewSection: boolean;
  ImagUrl: any;
  constructor(
    private lossService: LossService,
    private errorService: ErrorService,
    public dialog: MatDialog,
    public commondataService: CommondataService,
    private spinner: NgxSpinnerService,
    private _bottomSheet: MatBottomSheet,
    public dialogRef: MatDialogRef<LossDocumentAiModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
  }

  ngOnInit(): void {
    if (this.pagefrom == 'garageComponent') {
      this.claimDetails = this.claimInfo
    }
    this.updateDocumentList();
  }
  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }
  updateDocumentList() {
    if (this.claimInfo) {
      this.onGetDocumentList(this.claimInfo);
    }
    else {
      this.subscription = this.lossService.getLossInformation.subscribe(async (event: any) => {
        this.LossInformation = event;
        this.onGetDocumentList(event);
      });
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onFileDropped(event: any, item: any) {
  }
  onGetDocumentList(lossInfo) {
    if (this.pagefrom == 'garageComponent') {
      lossInfo = this.claimDetails
    }
    let lossTypeId = [];
    this.DocumentImageList = [];
    this.AccidentPhotos = [];
    if (lossInfo.LosstypeId != '') {
      lossTypeId.push(lossInfo.LosstypeId);
    }
    let ReqObj: any;
    let UrlLink = "";
    if (this.claimInfo && this.claimInfo != undefined) {
      UrlLink = `api/getclaimdocmaster`;
      ReqObj = {
        "InsuranceId": this.logindata.InsuranceId,
        "Status": "Y",
        "Docapplicable": "CLAIM-ACC"
      }
    }
    else {
      UrlLink = `api/claimdoctmaster`;
      ReqObj = {
        "Claimno": this.claimDetails.ClaimNo,
        "Partyno": lossInfo.PartyNo,
        "LossTypeId": lossTypeId,
        "InsuranceId": this.logindata.InsuranceId,
        "Claimlosstypeid": lossTypeId[0]
      }
    }

    return this.lossService.onGetDocumentList(UrlLink, ReqObj).subscribe((data: any) => {
      this.DocumentImageList = data;
      this.onGetUploadedDocuments(lossInfo);

    }, (err) => {
      this.handleError(err);
    })
  }
  onGenerateAI(item, index) {

    let file = item.JsonString.DocumentUploadDetails[0];
    let i = this.UploadDocumentList.findIndex((ele: any) => ele.FileName == file.FileName);
    if (i != null && i != undefined) {
      let selectedFile = this.UploadDocumentList[i];
      let ReqObj = {
        "ClaimNo": this.claimDetails.ClaimNo,
        "ListOfPath": [selectedFile.FilePathName]
      }
      let UrlLink = "api/trueinspect/uploadimage";
      return this.lossService.onGetDocumentList(UrlLink, ReqObj).subscribe((data: any) => {

        if (data.Error) {
          let element = '';
          for (let i = 0; i < data.Error.length; i++) {
            element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data.Error[i] + "</div>";

          }
          Swal.fire(
            'Please Fill Valid Value',
            `${element}`,
            'error',
          )
        }
        else {
          this.updateDocumentList();
        }

      }, (err) => {
        this.handleError(err);
      })
    }

  }
  checkAssessmentId(item, index) {
    let file = item.JsonString.DocumentUploadDetails[0];
    if (this.UploadDocumentList.length != 0 && file != undefined) {
      let i = this.UploadDocumentList.findIndex((ele: any) => ele.FileName == file.FileName);
      if (i != null && i != undefined && i >= 0) {
        let selectedFile = this.UploadDocumentList[i];
        if (selectedFile) {
          if (selectedFile.Assessmentid == null || selectedFile.Assessmentid == undefined) {

            return true;
          }
          else {
            return false;
          }
        }

      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
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



  onGetBase64Image(list) {
    let UrlLink = "getimagefile";
    let claimRefNo = "";
    if (this.claimDetails) {
      claimRefNo = this.claimDetails.Claimrefno
    }
    else if (this.claimInfo) {
      claimRefNo = this.claimInfo.ClaimRefNo
    }
    let reqObj = {
      "ClaimNo": claimRefNo,
      "ReqRefNo": list.Documentref,
      "DocTypeId": list.documentId,
      "ProductId": list.ProductId,
      "InsId": list.companyId
    }
    return this.lossService.onGetBase64Image(UrlLink, reqObj).subscribe((data: any) => {
      let file = this.onBase64dataURLtoFile(data.IMG_URL, list.FileName);
      this.onSelectAccidentPhotos([file], list, 'indirect');
    }, (err) => {

      this.handleError(err);
    })
  }


  onGetUploadedDocuments(event) {
    let claimRefNo = "";
    let createdBy = [];
    this.UploadDocumentList = [];
    this.AccidentPhotos = [];
    this.viewSection = false;
    if (this.pagefrom == 'garageComponent') {
      claimRefNo = this.claimDetails.Claimrefno;
      createdBy.push(this.claimDetails.CreatedBy);
      this.lossAcc = 'Y'
    }
    else if (this.claimInfo && this.claimInfo != undefined) {
      claimRefNo = this.claimInfo.ClaimRefNo
      if (sessionStorage.getItem('claimCreatedBy')) {
        let name = sessionStorage.getItem('claimCreatedBy');
        let Exist = createdBy.some((ele: any) => ele == name);
        if (!Exist) {
          createdBy.push(sessionStorage.getItem('claimCreatedBy'));
        }
        let logExist = createdBy.some((ele: any) => ele == this.logindata.LoginId);
        if (!logExist) {
          createdBy.push(this.logindata.LoginId);
        }
      }
      else {
        let Exist = createdBy.some((ele: any) => ele == this.logindata.LoginId);
        if (!Exist) {
          createdBy.push(this.logindata.LoginId);
        }
      }

    }
    else if (this.claimDetails) {
      claimRefNo = this.claimDetails.Claimrefno;
      createdBy.push(event.CreatedBy);
    }
    // let ReqObj = {
    //   "Claimno": claimRefNo,
    //   "PartyNo": event.PartyNo,
    //   "LossId": event.LosstypeId,
    //   "CreatedBy": event.CreatedBy,
    // }
    let accYN = 'N';
    if (this.lossAcc) {
      accYN = 'Y'
    }
    if(event.PartyNo==undefined || event.PartyNo==null) event.PartyNo='1';
    let ReqObj = {
      "Claimno": claimRefNo,
      "PartyNo": event.PartyNo,
      "LossId": event.LosstypeId,
      "Accimage": accYN,
      "Insid": this.logindata.InsuranceId,
      "CreatedBy": createdBy,
      "LoginId": this.logindata.LoginId
    }
    let UrlLink = `getdoclist`;
    return this.lossService.onGetUploadedDocuments(UrlLink, ReqObj).subscribe((data: any) => {
      this.UploadDocumentList = data;
      this.UploadDocumentList = _.uniqBy(this.UploadDocumentList, 'FilePathName');
      if (data) {
        let Img108 = data.filter((ele: any) => ele.docApplicable == "CLAIM-ACC");

        if (Img108.length > 0) {
          this.aiDocSection = true;
          let arr = [];
          for (let index = 0; index < Img108.length; index++) {

            const element = Img108[index];

            this.onGetImageFile(element);
            if (index == Img108.length - 1) {
              // forkJoin(arr).subscribe(responses => {
              //     for (let index = 0; index < responses.length; index++) {
              //       const element:any = responses[index];
              //        let file = this.onBase64dataURLtoFile(element.IMG_URL, element.FileName);
              //        this.onSelectAccidentPhotos([file], Img108[index], 'indirect');
              //        if(index==responses.length-1){
              //         this.AccidentPhotos = _.uniqBy(this.AccidentPhotos, 'FileName');
              //        }
              //     }
              // });
              this.viewSection = true;
            }
          }
        }
        else {
          this.viewSection = true;
        }
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  onGetDocAiDetails() {

    let UrlLink = "api/trueinspect/imagereport";
    let ReqObj = {
      "assessment_id": 760
    }
    return this.lossService.onGetUploadedDocuments(UrlLink, ReqObj).subscribe((data: any) => {

      const dialogRef = this.dialog.open(LossDocumentAiModalComponent, {
        width: '100%',
        panelClass: 'full-screen-modal',
        data: { 'LossInformation': this.LossInformation, 'documentAIData': data }
      });
      dialogRef.afterClosed().subscribe(result => {

      });
    }, (err) => {

      this.handleError(err);
    })
  }
  onDownloadImage(docData) {
    let item = docData.JsonString.DocumentUploadDetails[0];
    let fileType = docData.FileType;
    let UrlLink = "getimagefilehigh";
    let claimRefNo = "";
    if (this.claimDetails) {
      claimRefNo = this.claimDetails.Claimrefno
    }
    else if (this.claimInfo && this.claimInfo != undefined) {
      claimRefNo = this.claimInfo.ClaimRefNo
    }
    let ReqObj = {
      "ClaimNo": claimRefNo,
      "ReqRefNo": item.Documentref,
      "DocTypeId": item.DocTypeId,
      "ProductId": docData.JsonString.ProductId,
      "InsId": item.InsId
    }
    return this.lossService.onGetUploadedDocuments(UrlLink, ReqObj).subscribe((data: any) => {

      var a = document.createElement("a");
      a.href = data.IMG_URL;
      a.download = item.FileName;
      // start download
      a.click();
    }, (err) => {

      this.handleError(err);
    })

  }
  onSelectAccidentPhotos(event: any, fileType, type) {
    
    console.log("Doc Event",event);
    
    let fileList = event;
    
    let item = this.DocumentImageList.find((ele: any) => ele.docApplicable == "CLAIM-ACC");
    for (let index = 0; index < fileList.length; index++) {
      const element = fileList[index];

      var reader = new FileReader();
      reader.readAsDataURL(element);
      // if ((element.size / 1024 / 1024 <= 4) || type != 'direct') {
        var filename = element.name;
        if(filename){
          let typeList:any[] = filename.split('.');
          if(typeList.length!=0){
            let type = typeList[1];
            fileList[index]['fileType'] = type;
          }
        }
        this.setIndividualPhotos(reader,fileType,type,item,element,index,fileList);
        
      //}
      // else {
      //   if (type == 'direct') {
      //     if (element.size / 1024 / 1024 >= 4) {
      //       Swal.fire(
      //         `Selected File ${element.name} Size Exceeds More Than 4 Mb`,
      //         'Invalid Document'
      //       )
      //     }
          // else {
          //   Swal.fire(
          //     `Selected File ${element.name} Size Should be More Than 800kb`,
          //     'Invalid Document'
          //   )
          // }
        //}

      //}


    }
    console.log("Acccccc", this.AccidentPhotos);
  }
  setIndividualPhotos(reader,fileType,type,item,element,index,fileList){
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
    var JsonObj = {};
    let imageUrl: any;
    var filename = element.name;
    reader.onload = (event) => {
      imageUrl = event.target.result;
      this.imageUrl = imageUrl;
      let refNo = "";
      if (fileType != null) {
        refNo = fileType.Documentref;
      }
      let loginValue = this.logindata.LoginId;
      if (sessionStorage.getItem('claimCreatedBy')) {
        loginValue = sessionStorage.getItem('claimCreatedBy');
      }
      else {
        loginValue = this.logindata.LoginId;
      }
      let deleteYN = 'Y'; let param2 = "";
      if (type != 'direct') {
        deleteYN = fileType.Delete;
        if (fileType.Param2) {
          param2 = fileType.Param2;
        }
      }

      JsonObj = {
        "ProductId": item.ProductId,

        "DocumentUploadDetails": [
          {
            "DocTypeId": item.documentId,
            "FilePathName": "",
            "Delete": deleteYN,
            "Description": item.documentDesc,
            "ProductId": item.ProductId,
            "FileName": filename,
            "OpRemarks": item.remarks,
            "UploadType": item.docApplicable,
            "Documentref": refNo,
            "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
            "Param2": param2,
            "DocId": item.documentId,
            "InsId": item.companyId,
            "CreatedBy": loginValue,
            "LossId": lossId,
            "PartyNo": partyNo,
          }
        ]

      }
      let Exist = this.AccidentPhotos.some((ele: any) => ele.JsonString.DocumentUploadDetails[0].FileName == filename);
      let Index = this.AccidentPhotos.findIndex((ele: any) => ele.JsonString.DocumentUploadDetails[0].FileName == filename);
      
      if (!Exist) {
        this.AccidentPhotos.push({ 'url': this.imageUrl,"fileName":filename, "FileType":fileList[index]['fileType'], 'JsonString': JsonObj });

      }
      else if (type == 'direct') {
        Swal.fire(
          `Selected File ${element.name} Already Exist`,
          'Invalid Document'
        )
      }
      //this.AccidentPhotos.push({ 'url': this.imageUrl, 'JsonString': JsonObj, 'FileName':filename });
      if (index == fileList.length - 1) {
        console.log("Final Accident Photos",this.AccidentPhotos);
        //this.AccidentPhotos = _.uniqBy(this.AccidentPhotos, 'FileName');
      }

    }
  }


  // onSelectAccidentPhotos(event) {
  //   if (event?.target?.files) {
  //     let partyNo = "";
  //     let lossId = "";
  //     if (this.LossInformation) {
  //       partyNo = this.LossInformation.PartyNo;
  //       lossId = this.LossInformation.LosstypeId;
  //     }
  //     else if (this.claimInfo) {
  //       partyNo = this.claimInfo.PartyNo;
  //       lossId = this.claimInfo.LosstypeId;
  //     }
  //     console.log("Files", event.target.files);
  //     for (var i = 0; i < event.target.files.length; i++) {
  //       console.log(event.target.files[i].name);
  //       var reader = new FileReader();
  //       reader.readAsDataURL(event.target.files[i]);
  //       var filename = event.target.files[i].name;
  //       let imageUrl: any;
  //       reader.onload = (event) => {
  //         imageUrl = event.target.result;
  //         this.imageUrl = imageUrl;
  //         console.log(imageUrl);
  //         let item = this.DocumentImageList.find((ele: any) => ele.docApplicable == "CLAIM-ACC");
  //         console.log("Received Item Acc", item);
  //         var JsonObj = {
  //           "ProductId": item.ProductId,
  //           "DocumentUploadDetails": [
  //             {
  //               "DocTypeId": item.documentId,
  //               "FilePathName": "",
  //               "Description": item.documentDesc,
  //               "ProductId": item.ProductId,
  //               "FileName": filename,
  //               "OpRemarks": item.remarks,
  //               "UploadType": item.docApplicable,
  //               "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
  //               "DocId": item.documentId,
  //               "InsId": item.companyId,
  //               "CreatedBy": this.logindata.LoginId,
  //               "LossId": lossId,
  //               "PartyNo": partyNo,
  //             }
  //           ]

  //         }

  //         let Exist = this.AccidentPhotos.some((ele: any) => ele.JsonString.DocumentUploadDetails[0].FileName == filename);
  //         let Index = this.AccidentPhotos.findIndex((ele: any) => ele.JsonString.DocumentUploadDetails[0].FileName == filename);
  //         console.log(Exist);
  //         if(!Exist){
  //           this.AccidentPhotos.push({ 'url': this.imageUrl, 'JsonString': JsonObj });

  //         }
  //         // else{
  //         //   this.AccidentPhotos.splice(Index,1);
  //         // }



  //       }
  //     }
  //   }
  //   else {
  //     this.imageUrl = null;
  //   }

  // }

  OnEditAccidentPhotos(event) {
    var reader = new FileReader();
    reader.readAsDataURL(event);

    var filename = event.name;
    ++this.isEditImagelgnth;
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
      let loginValue = this.logindata.LoginId;
      if (sessionStorage.getItem('claimCreatedBy')) {
        loginValue = sessionStorage.getItem('claimCreatedBy');
      }
      imageUrl = event.target.result;
      this.imageUrl = imageUrl;
      let item = this.DocumentImageList.find((ele: any) => ele.docApplicable == "CLAIM-ACC");
      var JsonObj = {
        "ProductId": item.ProductId,
        "DocumentUploadDetails": [
          {
            "DocTypeId": item.documentId,
            "FilePathName": item.FilePathName,
            "Description": item.documentDesc,
            "Delete": item.Delete,
            "ProductId": item.ProductId,
            "FileName": filename,
            "OpRemarks": item.remarks,
            "UploadType": item.docApplicable,
            "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
            "DocId": item.documentId,
            "InsId": item.companyId,
            "CreatedBy": loginValue,
            "LossId": lossId,
            "PartyNo": partyNo,
            "Devicefrom": "WebApplication"


          }
        ]

      }
      let Exist = this.AccidentPhotos.some((ele: any) => ele.JsonString.DocumentUploadDetails[0].FileName == filename);
      if (!Exist) {
        this.AccidentPhotos.push({ 'url': this.imageUrl, 'showImage': this.ImagUrl, 'JsonString': JsonObj });
      }
      else {
        let index = this.AccidentPhotos.findIndex((ele: any) => ele.JsonString.DocumentUploadDetails[0].FileName == filename);
        this.AccidentPhotos[index].JsonString = JsonObj;
      }

    }
  }


  onUploadFiles() {
    // if (this.isEditImagelgnth > 0 && this.AccidentPhotos.length!=0) {
    //   console.log("Edit Accident Entered")
    //   this.AccidentPhotos.splice(0, this.isEditImagelgnth);
    // }
    if (this.AccidentPhotos.length != 0) {

      for (let index = 0; index < this.AccidentPhotos.length; index++) {
        const element = this.AccidentPhotos[index];
        let i = this.UploadDocumentList.findIndex((ele: any) => (ele.FileName == element.JsonString.DocumentUploadDetails[0].FileName && ele.Doctypeid == element.JsonString.DocumentUploadDetails[0].DocId));
        if (i < 0) {
          if (this.claimDetails) {
            element.JsonString['ClaimNo'] = this.claimDetails.Claimrefno;
          }
          else if (this.claimInfo) {
            element.JsonString['ClaimNo'] = this.claimInfo.ClaimRefNo;
          }
          var formData = new FormData();
          formData.append(`file`, element.file,);
          formData.append(`showImage`, element.showImage,);
          formData.append(`JsonString`, JSON.stringify(element.JsonString));
          delete element.JsonString['Documentref'];
          element.JsonString['file'] = element.url;
          let UrlLink = `upload`;
          this.lossService.onUploadFiles(UrlLink, element.JsonString).subscribe((data: any) => {
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
            else {
              if (index == (this.AccidentPhotos.length - 1)) {

                if (this.claimDetails) {
                  this.aiDocSection = true;
                  Swal.fire(
                    'Accidental Photos Uploaded Succssesfully!',
                    `Claimno: ${this.claimDetails.ClaimNo}`,
                    'success'
                  )
                  this.updateDocumentList();
                }
                else if (this.claimInfo) {
                  this.aiDocSection = true;
                  Swal.fire(
                    'Accidental Photos Uploaded Succssesfully!',
                    `Claimno: ${this.claimInfo.ClaimRefNo}`,
                    'success'
                  )
                  this.updateDocumentList();
                }

              }
            }

          }, (err) => {

            this.handleError(err);
          })
        }
        else {
          if (index == (this.AccidentPhotos.length - 1)) {

            if (this.claimDetails) {
              this.aiDocSection = true;
              Swal.fire(
                'Accidental Photos Uploaded Succssesfully!',
                `Claimno: ${this.claimDetails.ClaimNo}`,
                'success'
              )
              this.updateDocumentList();
            }
            else if (this.claimInfo) {
              this.aiDocSection = true;
              Swal.fire(
                'Accidental Photos Uploaded Succssesfully!',
                `Claimno: ${this.claimInfo.ClaimRefNo}`,
                'success'
              )
              this.updateDocumentList();
            }

          }
        }

      }
    }
    else {
      this.viewSection = true;

    }
  }





  onViewImage(item) {
    // this.ViewImages = item;
    this.commondataService.onGetImageUrl(item);
    const dialogRef = this.dialog.open(ImageviewModalComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }




  damageListDisabled() {
    if (this.logindata?.UserType == "claimofficer" && !this.claimInfo) {
      if (this.lossInfo?.GarageYn == 'N' || this.lossInfo?.SurveyorYn == 'N') {
        return true;
      }
      else {
        return false
      }
    }
    else {
      return false;
    }
  }
  async onDeleteStaticDocument(item) {
    //(<HTMLInputElement> document.getElementById('#accidentfileInput')).value = null;
    // const foo = document.querySelector('#container')
    // foo.addEventListener('click', (event) => {
    //   event.preventDefault();
    // });
    let index = this.AccidentPhotos.findIndex((ele: any) => ele.JsonString.DocumentUploadDetails[0].Documentref == item.JsonString.DocumentUploadDetails[0].Documentref);
    this.AccidentPhotos.splice(index, 1);
    //this.onSelectAccidentPhotos(null);
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
        const foo = document.querySelector('#container')
        foo.addEventListener('click', (event) => {
          event.preventDefault();
        });

        let onDelete = this.UploadDocumentList.find((ele: any) => ele.Documentref == item.JsonString.DocumentUploadDetails[0].Documentref);
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
          "Doctypeid": onDelete.Doctypeid,
          "Filepathname": onDelete.FilePathName
        }

        return this.lossService.onDeleteDocument(UrlLink, reqObj).subscribe((data: any) => {

          Swal.fire(
            data.Messeage,
            'success'
          )
          this.updateDocumentList();
        }, (err) => {
          this.handleError(err);
        })
      }
    });
  }
  checkUploadimg(item, index) {
    let file = item.JsonString.DocumentUploadDetails[0];
    if (this.UploadDocumentList.length != 0 && file != undefined) {
      let i = this.UploadDocumentList.findIndex((ele: any) => ele.FileName == file.FileName);
      if (i != null && i != undefined && i >= 0) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  ongetAISingleDoc(item, index) {

    let file = item.JsonString.DocumentUploadDetails[0];
    let i = this.UploadDocumentList.findIndex((ele: any) => ele.FileName == file.FileName);
    if (i != null && i != undefined) {
      let selectedFile = this.UploadDocumentList[i];
      let ReqObj = {
        "assessment_id": selectedFile.Assessmentid,
        "Filename": item.JsonString.DocumentUploadDetails[0].Param2
      }
      let UrlLink = "api/trueinspect/imagereport";
      return this.lossService.submitDamagedetails(UrlLink, ReqObj).subscribe((data: any) => {

        const dialogRef = this.dialog.open(LossDocumentAiModalComponent, {
          width: '100%',
          panelClass: 'full-screen-modal',
          data: { 'LossInformation': this.LossInformation, 'documentAIData': data }
        });
        dialogRef.afterClosed().subscribe(result => {

        });
      }, (err) => {

        this.handleError(err);
      })
    }
  }





  onGetImageFile(list: any) {
    let UrlLink = "getimagefile";
    let claimRefNo = "";
    if (this.claimDetails) {
      claimRefNo = this.claimDetails.Claimrefno
    }
    else if (this.claimInfo) {
      claimRefNo = this.claimInfo.ClaimRefNo
    }
    let ReqObj = {
      "ClaimNo": claimRefNo,
      "ReqRefNo": list.Documentref,
      "DocTypeId": list.documentId,
      "ProductId": list.ProductId,
      "InsId": list.companyId
    }
    return this.lossService.onGetBase64Image(UrlLink, ReqObj).subscribe((data: any) => {
      let file = this.onBase64dataURLtoFile(data.IMG_URL, list.FileName);
      this.onSelectAccidentPhotos([file], list, 'indirect');
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
