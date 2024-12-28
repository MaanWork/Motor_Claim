import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import Swal from 'sweetalert2';
import { ImageviewModalComponent } from '../../imageview-modal/imageview-modal.component';
import { CommondataService } from '../../services/commondata.service';
import { ErrorService } from '../../services/errors/error.service';
import { DocumentReportSheetComponent } from '../document-report-sheet/document-report-sheet.component';
import { WaveOffModalComponent } from '../wave-off-modal/wave-off-modal.component';

@Component({
  selector: 'app-loss-document-file',
  templateUrl: './loss-document-file.component.html',
  styleUrls: ['./loss-document-file.component.css']
})
export class LossDocumentFileComponent implements OnInit, OnDestroy {
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
  public TotalImages: any = [];
  public TotalImagesById: any = [];
  public panel={}
  private subscription = new Subscription();
  private subscriptionDocumentList = new Subscription();

  public isCheck = {};
  public reason = {};
  public waveOffYN = {}
  public hideWave = {};
  @Input() claimInfo;
  @Input() lossInfo;
  @Input() lossAcc;
  @Input() pagefrom;
  @Input() garageDetails;
  public NoDocumentList: any = [];
  public WaveOffYN: any = '';
  addDocSection = false;
  additionalDocumentImageList: any[] = [];
  selectedExistingDoc: any[] = [];
  LossDetails: any;

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
    this.LossDetails = JSON.parse(sessionStorage.getItem("LossDetails"));
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    if(this.pagefrom=='garageComponent'){
      this.claimDetails = this.claimInfo
    }
    else if(this.pagefrom=='authLetter'){
      this.claimDetails = this.garageDetails;
    }
    this.updateDocumentList();
  }
  checkPanelImage(id){
    if(this.pagefrom=='garageComponent'){
        return true
    }
    else return this.panel['Open'+id]
  }
  updateDocumentList() {
    if ((this.claimInfo && this.claimInfo != undefined) || this.pagefrom=='authLetter') {
      console.log("Get Doc List Req Info",this.claimInfo)
      if(this.pagefrom=='authLetter'){
        this.onGetDocumentList(this.garageDetails);
        console.log("Garage Details",this.garageDetails)
      }
      else this.onGetDocumentList(this.claimInfo);
    }
    else {
      this.subscriptionDocumentList = this.lossService.getLossInformation.subscribe(async (event: any) => {
        this.LossInformation = event;
        this.onGetDocumentList(event);
        this.getAdditionalDocList(event)
      });
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionDocumentList.unsubscribe();
  }

  checkSelectedDoc(rowData) {
    if (this.DocumentImageList.length != 0) {
      if (this.DocumentImageList.some((ele: any) => ele.documentId == rowData.documentId)) {
        this.addDocumentDesc(true, rowData);
      }
      return this.DocumentImageList.some((ele: any) => ele.documentId == rowData.documentId);
    }
    else {
      return false;
    }
  }
  getAdditionalDocList(lossInfo) {
    let lossTypeId = [];
    if (lossInfo.LosstypeId != '') {
      lossTypeId.push(lossInfo.LosstypeId);
    }
    let ReqObj: any;
    ReqObj = {
      "LossTypeId": lossTypeId,
      "Claimlosstypeid": lossTypeId[0],
      "status": "Y",
      "InsuranceId": this.logindata.InsuranceId,
      "docApplicable": "CLAIM"
    }
    let UrlLink = `api/addadditionaldoclist`;
    return this.lossService.onGetDocumentList(UrlLink, ReqObj).subscribe((data: any) => {
      this.additionalDocumentImageList = data;

      this.addDocSection = true;
    }, (err) => {
      this.handleError(err);
    })
  }
  addDocumentDesc(event, rowData) {

    if (event) {
      let Exist = this.selectedExistingDoc.some((ele: any) => ele == rowData.documentId);
      if (!Exist) {
        this.selectedExistingDoc.push(rowData.documentId);
      }
    }
    else {
      let Exist = this.selectedExistingDoc.some((ele: any) => ele == rowData.documentId);
      if (Exist) {
        let index = this.selectedExistingDoc.indexOf((ele: any) => ele == rowData.documentId);
        this.selectedExistingDoc.splice(index, 1);
      }
      let Exists = this.DocumentImageList.some((ele: any) => ele.documentId == rowData.documentId);
      if (Exists) {
        let index = this.DocumentImageList.indexOf((ele: any) => ele.documentId == rowData.documentId);
        this.DocumentImageList.splice(index, 1);
      }
    }
  }

  submitAdditionalDocument() {
    let ReqObj = {
      "ChassisNo": this.claimDetails.ChassisNo,
      "ClaimNo": this.claimDetails.ClaimNo,
      "Losstypeid": this.LossInformation.LosstypeId,
      "CreatedBy": this.logindata.LoginId,
      "Partyno": this.LossInformation.PartyNo,
      "PolicyNo": this.claimDetails.PolicyNo,
      "UserType": this.logindata.UserType,
      "AddDocList": this.selectedExistingDoc,
      "InsuranceId": this.logindata.InsuranceId,
    }
    let UrlLink = `api/additionaldocinloss`;
    return this.lossService.onGetDocumentList(UrlLink, ReqObj).subscribe((data: any) => {
      this.updateDocumentList();
    }, (err) => {
      this.handleError(err);
    })
  }

  onGetDocumentList(lossInfo) {
    this.DocumentImageList = [];
    let lossTypeId = [];
    this.DocumentsFiles = [];

    let ReqObj: any;
    let UrlLink = "";
    if (this.claimInfo && this.claimInfo != undefined) {
      UrlLink = `api/getclaimdocmaster`;
      ReqObj = {
        "InsuranceId": this.logindata.InsuranceId,
        "Status": "Y",
        "Docapplicable": "CLAIM-INTIMATION"
      }
    }
    else {
      
      UrlLink = `api/claimdoctmaster`;
      console.log("Url Link",UrlLink,"ReqObj",ReqObj);
      if (lossInfo.LosstypeId) {
        if (lossInfo.LosstypeId != '') {
          lossTypeId.push(lossInfo.LosstypeId);
        }
      }
      ReqObj = {
        "Claimno": this.claimDetails.ClaimNo,
        "Partyno": lossInfo.PartyNo,
        "LossTypeId": lossTypeId,
        "InsuranceId": this.logindata.InsuranceId,
        "Claimlosstypeid": lossTypeId[0]
      }
      console.log("Url Link 2",UrlLink,"ReqObj",ReqObj);
    }
   
    return this.lossService.onGetDocumentList(UrlLink, ReqObj).subscribe((data: any) => {
      this.DocumentImageList = data;
      if(this.pagefrom=='authLetter'){
          this.DocumentImageList = this.DocumentImageList.filter(ele=>ele.documentId=='132')
      }
      if (this.DocumentImageList.length > 0) {
        this.onGetUploadedDocuments(lossInfo);
      }

    }, (err) => {
      this.handleError(err);
    })
  }



  onGetUploadedDocuments(event) {
    this.TotalImages=[];
    let claimRefNo = "";
    let createdBy = [];
    if(this.pagefrom=='garageComponent'){
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
    if(this.pagefrom=='authLetter' && this.garageDetails){
      createdBy.push(this.garageDetails.GarageLoginId);
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
      "CreatedBy": createdBy,
      "Accimage": accYN,
      "Insid": this.logindata.InsuranceId,
      "LoginId": this.logindata.LoginId
    }
    let UrlLink = `getdoclist`;
    return this.lossService.onGetUploadedDocuments(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("Getdoclist", data)
      let LossDocumentFile:any=[];
      if(this.pagefrom!='authLetter'){
        this.UploadDocumentList = data.filter((ele: any) => (ele.docApplicable == "CLAIM-INTIMATION" || ele.docApplicable == "CLAIM") && ele.Doctypeid != '123');
        this.lossService.onUploadedDocumentList(this.UploadDocumentList);
         LossDocumentFile = data.filter((ele: any) => (ele.docApplicable == "CLAIM-INTIMATION" || ele.docApplicable == "CLAIM") && ele.Doctypeid != '123');
        this.NoDocumentList = this.UploadDocumentList.filter((ele: any) => ele.FilePathName == null);
  
        if (this.NoDocumentList.length > 0) {
          for (let index = 0; index < this.NoDocumentList.length; index++) {
            const element = this.NoDocumentList[index];
            let Index = this.DocumentImageList.findIndex((ele: any) => ele.documentId == element.documentId);
            this.DocumentImageList.splice(Index, 1);
          }
  
        }
      }
      else{
        this.UploadDocumentList = data.filter((ele: any) =>  ele.Doctypeid == '132');
        LossDocumentFile = data.filter((ele: any) =>  ele.Doctypeid == '132');
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
      "DocTypeId": list.Doctypeid,
      "ProductId": list.ProductId,
      "InsId": list.companyId
    }
    return this.lossService.onGetBase64Image(UrlLink, reqObj).subscribe((data: any) => {
      let fileName = data.FileName;
      if(fileName){
        let typeList:any[] = fileName.split('.');
        if(typeList.length!=0){
          let type = typeList[1];
          let FileType = type;
          let lossId = "",partyNo="";
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
          var JsonObj = {
            "ProductId": list.ProductId,
            "DocumentUploadDetails": [
              {
                "DocTypeId": list.documentId,
                "FilePathName": "",
                "Delete": "Y",
                "Description": list.documentDesc,
                "ProductId": list.ProductId,
                "FileName": fileName,
                "OpRemarks": list.remarks,
                "UploadType": list.docApplicable,
                "Documentref": data.Documentref,
                "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
                "DocId": list.documentId,
                "InsId": list.companyId,
                "CreatedBy": loginValue,
                "LossId": lossId,
                "PartyNo": partyNo,
                "Devicefrom":"WebApplication"
    
              }
            ]
    
          }
          let obj = { url: data?.IMG_URL,"FileType":FileType,"fileName":fileName, item: list,'JsonString': JsonObj  }
          this.TotalImages.push(obj);

        }
      }
      
      // this.OnEditAccidentPhotos(data, list);
    }, (err) => {

      this.handleError(err);
    })
  }


  onDownloadImage(docData) {
    console.log("received file",docData)
    let item = docData.JsonString.DocumentUploadDetails[0];
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


  // onLossDocuments(event, item) {
  //   var reader = new FileReader();
  //   reader.readAsDataURL(event.target.files[0]);
  //   var filename = event.target.files[0].name;
  //   let imageUrl: any;
  //   reader.onload = (event) => {
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
  //     imageUrl = event.target.result;
  //     this.imageUrl = imageUrl;
  //     this.onSetBackGroundImage(imageUrl, item);
  //     let loginValue = this.logindata.LoginId;
  //     if (sessionStorage.getItem('claimCreatedBy')) {
  //       loginValue = sessionStorage.getItem('claimCreatedBy');
  //     }
  //     var JsonObj = {
  //       "ProductId": item.ProductId,
  //       "DocumentUploadDetails": [
  //         {
  //           "DocTypeId": item.documentId,
  //           "FilePathName": "",
  //           "Delete": "Y",
  //           "Description": item.documentDesc,
  //           "ProductId": item.ProductId,
  //           "FileName": filename,
  //           "OpRemarks": item.remarks,
  //           "UploadType": item.docApplicable,
  //           "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
  //           "DocId": item.documentId,
  //           "InsId": item.companyId,
  //           "CreatedBy": loginValue,
  //           "LossId": lossId,
  //           "PartyNo": partyNo,
  //         }
  //       ]

  //     }

  //     let findSameId = this.DocumentsFiles.findIndex((ele: any) => ele.JsonString.DocumentUploadDetails[0].DocTypeId == item.documentId);

  //     if (findSameId && findSameId != -1) {
  //       this.DocumentsFiles[findSameId] = { 'url': this.imageUrl, 'JsonString': JsonObj };

  //     } else {
  //       this.DocumentsFiles.push({ 'url': this.imageUrl, 'JsonString': JsonObj });
  //     }
  //     console.log("OnSelectDocumentsFiles", this.DocumentsFiles);

  //   }
  // }

  onUploadDocuments(event, item) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    var filename = event.target.files[0].name;
    if(filename){
      let typeList:any[] = filename.split('.');
      if(typeList.length!=0){
        let type = typeList[1];
        item['FileType'] = type;
      }
    }
    let imageUrl: any;
    reader.onload = (event) => {
      let partyNo = "";
      let lossId = "";
      if(this.pagefrom=='authLetter'){
        partyNo = this.garageDetails.PartyNo;
        lossId = this.garageDetails.LosstypeId;
      }
      else if (this.LossInformation) {
        partyNo = this.LossInformation.PartyNo;
        lossId = this.LossInformation.LosstypeId;
      }
      else if (this.claimInfo) {
        partyNo = this.claimInfo.PartyNo;
        lossId = this.claimInfo.LosstypeId;
      }
      imageUrl = event.target.result;
      this.imageUrl = imageUrl;
      let loginValue = this.logindata.LoginId;
      if (sessionStorage.getItem('claimCreatedBy')) {
        loginValue = sessionStorage.getItem('claimCreatedBy');
      }
      var JsonObj = {
        "ProductId": item.ProductId,
        "DocumentUploadDetails": [
          {
            "DocTypeId": item.documentId,
            "FilePathName": "",
            "Delete": "Y",
            "Description": item.documentDesc,
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
            "Devicefrom":"WebApplication"

          }
        ]

      }
      let UploadList = [{ 'url': this.imageUrl,"fileName":filename,"FileType":item['FileType'], 'JsonString': JsonObj }];
      this.onCallUploadApi(UploadList);
      console.log("OnSelectDocumentsFiles", UploadList);

    }
  }

  onCallUploadApi(UploadList: any) {
    let i = 0;
    if (UploadList.length != 0) {
      for (let index = 0; index < UploadList.length; index++) {
        const element = UploadList[index];
        if (this.claimDetails) {
          element.JsonString['ClaimNo'] = this.claimDetails.Claimrefno;
        }
        else if (this.claimInfo) {
          element.JsonString['ClaimNo'] = this.claimInfo.ClaimRefNo;
        }
        var formData = new FormData();
        formData.append(`file`, element.url,);
        formData.append(`JsonString`, JSON.stringify(element.JsonString));
        element.JsonString['file'] = element.url;
        let UrlLink = `upload`;
        this.lossService.onUploadFiles(UrlLink, element.JsonString).subscribe((data: any) => {
          for (let index = 0; index < this.DocumentImageList.length; index++) {
            const element = this.DocumentImageList[index];
            this.panel['Open'+element.documentId] = false;
          }
          if (data.message == 'Not Inserted') {
            i++;
          }
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
            if (index == UploadList.length - 1) {

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
              this.updateDocumentList();
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
  }

  onSetBackGroundImage(imageUrl, item) {
    let image = (<HTMLInputElement>document.getElementById(`Image_${item.documentId}`));
    let deleter = (<HTMLInputElement>document.getElementById(`delete_${item.documentId}`));
    if (imageUrl && image) {
      if (deleter) {
        if (item.Delete == 'Y') {
          deleter.style.display = 'block';
        }
        else {
          deleter.style.display = 'none';
        }
      }

      image.style.backgroundImage = "url(" + imageUrl + ")";
      this.my['image' + item.documentId] = imageUrl;
      this.hideWave['Check' + item.documentId] = false;

    }
  }


  // OnEditAccidentPhotos(imgData, item) {
  //   var filename = item.FileName;
  //   ++this.isEditImagelgnth;
  //   this.imageUrl = imgData.IMG_URL;
  //   // this.onSetBackGroundImage(imgData.IMG_URL, item);
  //   let partyNo = "";
  //   let lossId = "";
  //   if (this.LossInformation) {
  //     partyNo = this.LossInformation.PartyNo;
  //     lossId = this.LossInformation.LosstypeId;
  //   }
  //   else if (this.claimInfo) {
  //     partyNo = this.claimInfo.PartyNo;
  //     lossId = this.claimInfo.LosstypeId;
  //   }
  //   let loginValue = this.logindata.LoginId;
  //   if (sessionStorage.getItem('claimCreatedBy')) {
  //     loginValue = sessionStorage.getItem('claimCreatedBy');
  //   }
  //   var JsonObj = {
  //     "ProductId": item.ProductId,
  //     "DocumentUploadDetails": [
  //       {
  //         "DocTypeId": item.documentId,
  //         "FilePathName": "",
  //         "Delete": item.Delete,
  //         "Description": item.documentDesc,
  //         "ProductId": item.ProductId,
  //         "FileName": filename,
  //         "OpRemarks": item.remarks,
  //         "UploadType": item.docApplicable,
  //         "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
  //         "DocId": item.documentId,
  //         "InsId": item.companyId,
  //         "CreatedBy": loginValue,
  //         "LossId": lossId,
  //         "PartyNo": partyNo,
  //       }
  //     ]

  //   }
  //   this.DocumentsFiles.push({ 'url': this.imageUrl, 'JsonString': JsonObj });
  //   console.log("OnEditDocumentsFiles", this.DocumentsFiles);

  // }

  checkHidden(){
    if(this.pagefrom=='authLetter'){
      if(this.logindata.UserType=='garage' && this.garageDetails?.LossStatus == 'UP') return false;
      else return true;
    }
    else {
      return (this.logindata.UserType=='claimofficer' && !this.claimInfo)
    }
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





  // onUploadFiles() {
  //   console.log("UploadDocumentList", this.DocumentsFiles, this.isEditImagelgnth)
  //   let i = 0;

  //   if (this.isEditImagelgnth > 0) {
  //     this.DocumentsFiles.splice(0, this.isEditImagelgnth);
  //   }
  //   if (this.DocumentsFiles.length != 0) {
  //     for (let index = 0; index < this.DocumentsFiles.length; index++) {
  //       const element = this.DocumentsFiles[index];
  //       if (this.claimDetails) {
  //         element.JsonString['ClaimNo'] = this.claimDetails.Claimrefno;
  //       }
  //       else if (this.claimInfo) {
  //         element.JsonString['ClaimNo'] = this.claimInfo.ClaimRefNo;
  //       }
  //       var formData = new FormData();
  //       formData.append(`file`, element.url,);
  //       formData.append(`JsonString`, JSON.stringify(element.JsonString));
  //       element.JsonString['file'] = element.url;
  //       let UrlLink = `upload`;
  //       this.lossService.onUploadFiles(UrlLink, element.JsonString).subscribe((data: any) => {
  //         this.isEditImagelgnth = 0;
  //         if (data.message == 'Not Inserted') {
  //           i++;
  //         }
  //         if (data.Errors) {
  //
  //           let element = '';
  //           for (let i = 0; i < data.Errors.length; i++) {
  //             element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data.Errors[i].Message + "</div>";

  //           }
  //           Swal.fire(
  //             'Please Fill Valid Value',
  //             `${element}`,
  //             'error',
  //           )
  //         }
  //         else {
  //           if (index == this.DocumentsFiles.length - 1) {
  //
  //             if (i == 0) {
  //               if (this.claimDetails) {
  //                 Swal.fire(
  //                   'Document Uploaded Succssesfully!',
  //                   `Claimno: ${this.claimDetails.ClaimNo}`,
  //                   'success'
  //                 )
  //               }
  //               else if (this.claimInfo) {
  //                 Swal.fire(
  //                   'Document Uploaded Succssesfully!',
  //                   `Claimno: ${this.claimInfo.ClaimRefNo}`,
  //                   'success'
  //                 )
  //               }

  //             }
  //             else {
  //               if (this.claimDetails) {
  //                 Swal.fire(
  //                   'Document Upload Failed!',
  //                   `Claimno: ${this.claimDetails.ClaimNo}`,
  //                   'error'
  //                 )
  //               }
  //               else if (this.claimInfo) {
  //                 Swal.fire(
  //                   'Document Upload Failed!',
  //                   `Claimno: ${this.claimInfo.ClaimRefNo}`,
  //                   'error'
  //                 )
  //               }
  //             }
  //             this.updateDocumentList();
  //           }
  //         }
  //       }, (err) => {
  //
  //         let element = '';
  //         if (err.statusText) {
  //           element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + err.statusText + "</div>";

  //         }
  //         Swal.fire(
  //           'Please Fill Valid Value',
  //           `${element}`,
  //           'error',
  //         )
  //         this.handleError(err);
  //       })
  //     }
  //   }

  // }





  onViewImage(imageurl, filename) {
    console.log("ImageUrl",imageurl,"fileName",filename);
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


            Swal.fire(
              data.Messeage,
              'Delete'
            )
            for (let index = 0; index < this.DocumentImageList.length; index++) {
              const element = this.DocumentImageList[index];
              this.panel['Open'+element.documentId] = false;
            }
            this.updateDocumentList();
          }, (err) => {

            this.handleError(err);
          })
        }
      }
    });
  }

  onGetWaveoff(item, val) {
    const dialogRef = this.dialog.open(WaveOffModalComponent, {
      width: '100%',
      panelClass: 'full-screen-modal',
      data: { "WaveDocList": item, "Document": this.UploadDocumentList.find((ele: any) => ele.documentId == item.documentId), "isHaveDocument": false, "Waveoff": val }
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

  onGetTotalImagesById(item: any) {
    this.panel['Open'+item.documentId] = true;
    let filterOtherPanel = this.DocumentImageList.filter((ele:any)=>ele.documentId != item.documentId);
    for (let index = 0; index < filterOtherPanel.length; index++) {
      const element = filterOtherPanel[index];
      this.panel['Open'+element.documentId] = false;

    }
    this.TotalImagesById = [];
    let filterById = this.TotalImages.filter((ele: any) => ele.item.documentId == item.documentId);
    this.TotalImagesById = filterById;
    console.log("SelectedViewImages", this.TotalImagesById)
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
