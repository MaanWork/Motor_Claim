import { NgxSpinnerService } from 'ngx-spinner';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from '../services/errors/error.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { LossModalComponent } from 'src/app/shared/loss-modal/loss-modal.component';
import Swal from 'sweetalert2';
import { StatusUpdateComponent } from '../lossinfocomponent/status-update/status-update.component';

@Component({
  selector: 'app-secondary-loss',
  templateUrl: './secondary-loss.component.html',
  styleUrls: ['./secondary-loss.component.css']
})
export class SecondaryLossComponent implements OnInit {
  @Input() hidebtn: any;

  public logindata: any = {};
  public claimDetails: any = {};
  public createSecondaryForm: FormGroup;
  @Input() secdLossInfo: any;
  public LossTypeDes: any = ''; public hideWave={};
  public isLossEdit: any;public my = {};
  public LossTypeId:any;DocumentsFiles:any[]=[];
  VatYN:any="N";public fileuploadDisable: any;
  public isDisabled:boolean=true;DocumentImageList:any[]=[];
  @Output() public onSubmitFrom = new EventEmitter<any>();
  imageUrl: any;
  UploadDocumentList: any;
  AccidentPhotos: any[];
  constructor(
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private lossService: LossService,
    public dialog:MatDialog,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<LossModalComponent>,
  ) {
  }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    if (this.logindata?.UserType == "claimofficer" && (this.secdLossInfo?.GarageYn!='N' && this.secdLossInfo?.SurveyorYn !='N')) {
      this.isDisabled=true;
    }else{
      this.isDisabled=false;
    }
    console.log(this.secdLossInfo);
    this.createFromControl();
    this.LossTypeDes = this.secdLossInfo.Losstypedescp;
    this.LossTypeId = this.secdLossInfo.LosstypeId;
    this.isLossEdit = this.secdLossInfo.LossNo;

    this.onBindSecondayLossType();
    this.onUpdateValidators();
    // if(this.LossTypeId==28 || this.LossTypeId==34 || this.LossTypeId==37 || this.LossTypeId==33 || this.LossTypeId==35 || this.LossTypeId==36 || this.LossTypeId==46){
    //   this.DocumentImageList = [
    //     {
    //       "DocTypeId": null,
    //       "FilePathName": "",
    //       "Delete": "Y",
    //       "Description": `${this.LossTypeDes} Document`,
    //       "ProductId": "66",
    //       "FileName": null,
    //       "OpRemarks": null,
    //       "UploadType": "CLAIM-ACC",
    //       "Documentref": "",
    //       "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
    //       "Param2": "",
    //       "DocId": null,
    //       "InsId": this.logindata.InsuranceId,
    //       "CreatedBy": this.logindata.LoginId,
    //       "LossId": this.LossTypeId,
    //       "PartyNo": this.secdLossInfo.PartyNo
    //   }
    //   ]
    //   if(this.LossTypeId==28){ this.DocumentImageList[0].documentId = 126; this.DocumentImageList[0].DocTypeId = 126; }
    //   else if(this.LossTypeId==34){ this.DocumentImageList[0].documentId = 128; this.DocumentImageList[0].DocTypeId = 128; }
    //   else if(this.LossTypeId==35){ this.DocumentImageList[0].documentId = 129; this.DocumentImageList[0].DocTypeId = 129; }
    //   else if(this.LossTypeId==37){ this.DocumentImageList[0].documentId = 124; this.DocumentImageList[0].DocTypeId = 124; }
    //   else if(this.LossTypeId==33){ this.DocumentImageList[0].documentId = 133; this.DocumentImageList[0].DocTypeId = 133; }
    //   else if(this.LossTypeId==36){ this.DocumentImageList[0].documentId = 134; this.DocumentImageList[0].DocTypeId = 134; }
    //   else if(this.LossTypeId==36){ this.DocumentImageList[0].documentId = 135; this.DocumentImageList[0].DocTypeId = 135; }
    // }
    //this.onGetDocumentList(this.secdLossInfo)
  }

  commonReqObject() {
    return {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId":  this.logindata?.OaCode

    }
  }
  onGetDocumentList(lossInfo) {
    let lossTypeId = [];
    this.DocumentImageList = [];
    if (lossInfo.LosstypeId != '') {
      lossTypeId.push(lossInfo.LosstypeId);
    }
    let ReqObj: any;
    let UrlLink = "";
      UrlLink = `api/claimdoctmaster`;
      ReqObj = {
        "Claimno": this.claimDetails.ClaimNo,
        "Partyno": lossInfo.PartyNo,
        "LossTypeId": lossTypeId,
        "InsuranceId": this.logindata.InsuranceId,
        "Claimlosstypeid": lossTypeId[0]
      }

    return this.lossService.onGetDocumentList(UrlLink, ReqObj).subscribe((data: any) => {
      this.DocumentImageList = data;
      this.onGetUploadedDocuments(lossInfo);

    }, (err) => {
      this.handleError(err);
    })
  }
  onGetUploadedDocuments(event) {
    let claimRefNo = "";
    let createdBy = [];
    this.UploadDocumentList = [];
    this.AccidentPhotos = [];
    if (this.claimDetails) {
      claimRefNo = this.claimDetails.Claimrefno;
      createdBy.push(event.CreatedBy);
    }
    // let ReqObj = {
    //   "Claimno": claimRefNo,
    //   "PartyNo": event.PartyNo,
    //   "LossId": event.LosstypeId,
    //   "CreatedBy": event.CreatedBy,
    // }
    let accYN = 'Y';
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
      //this.UploadDocumentList = _.uniqBy(this.UploadDocumentList, 'FilePathName');
      if (data) {
        let Img108 = data.filter((ele: any) => ele.docApplicable == "CLAIM-ACC");

        if (Img108.length > 0) {
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
            }
          }
        }
        else {
        }
      }

    }, (err) => {
      this.handleError(err);
    })
  }
  onGetImageFile(list: any) {
    let UrlLink = "getimagefile";
    let claimRefNo = "";
    if (this.claimDetails) {
      claimRefNo = this.claimDetails.Claimrefno
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
  onSelectAccidentPhotos(event: any, fileType, type) {
    let partyNo = "";
    let lossId = "";
    if (this.secdLossInfo) {
      partyNo = this.secdLossInfo.PartyNo;
      lossId = this.secdLossInfo.LosstypeId;
    }
    let fileList = event;
    var JsonObj = {};
    let item = this.DocumentImageList.find((ele: any) => ele.docApplicable == "CLAIM-ACC");
    for (let index = 0; index < fileList.length; index++) {
      const element = fileList[index];

      var reader = new FileReader();
      reader.readAsDataURL(element);
      if ((element.size / 1024 / 1024 <= 4) || type != 'direct') {
        var filename = element.name;
        if(filename){
          let typeList:any[] = filename.split('.');
          if(typeList.length!=0){
            let type = typeList[1];
            fileList[index]['fileType'] = type;
          }
        }
        let imageUrl: any;
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
            //this.AccidentPhotos = _.uniqBy(this.AccidentPhotos, 'FileName');
          }

        }
      }
      else {
        if (type == 'direct') {
          if (element.size / 1024 / 1024 >= 4) {
            Swal.fire(
              `Selected File ${element.name} Size Exceeds More Than 4 Mb`,
              'Invalid Document'
            )
          }
          // else {
          //   Swal.fire(
          //     `Selected File ${element.name} Size Should be More Than 800kb`,
          //     'Invalid Document'
          //   )
          // }
        }

      }


    }
    console.log("Acccccc", this.AccidentPhotos);
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
  createFromControl() {
    this.createSecondaryForm = this.formBuilder.group({
      SalvageAmount: [{value:'',disabled: this.isDisabled}, Validators.required],
      ExcessAmount: [{value:'',disabled: this.isDisabled}, Validators.required],
      DepreciationAmount: [{value:'',disabled: this.isDisabled}, Validators.required],
      Amount: [{value:'',disabled: this.isDisabled}, Validators.required],
      PayeeName: [{value:'',disabled: this.isDisabled}, Validators.required],
      Remarks: [{value:'',disabled: this.isDisabled}, Validators.required],
    })
  }
  onLossDocuments(event, item) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    var filename = event.target.files[0].name;
    let imageUrl: any;
    reader.onload = (event) => {
      let partyNo = "";
      let lossId = "";
      imageUrl = event.target.result;
      this.imageUrl = imageUrl;
      this.onSetBackGroundImage(imageUrl, item);
      var JsonObj = {
        "ProductId": item.ProductId,
        "DocumentUploadDetails": this.DocumentImageList

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
  onUpdateValidators(){

   const SalvageAmount = this.createSecondaryForm.get('SalvageAmount');
   const ExcessAmount = this.createSecondaryForm.get('ExcessAmount');
   const DepreciationAmount = this.createSecondaryForm.get('DepreciationAmount');

      if (this.LossTypeId == 48 || this.LossTypeId == 49 || this.LossTypeId == 50) {
        SalvageAmount.setValidators([Validators.required]);
        ExcessAmount.setValidators([Validators.required]);
        DepreciationAmount.setValidators([Validators.required]);
      }
      else {
        SalvageAmount.setValidators(null);
        ExcessAmount.setValidators(null);
        DepreciationAmount.setValidators(null);
      }

      SalvageAmount.updateValueAndValidity();
      ExcessAmount.updateValueAndValidity();
      DepreciationAmount.updateValueAndValidity();

  }

  onBindSecondayLossType() {
    console.log("Edit Loss Details",this.secdLossInfo);
    if(this.isDisabled){
      this.createSecondaryForm.controls['SalvageAmount'].enable();
      this.createSecondaryForm.controls['ExcessAmount'].enable();
      this.createSecondaryForm.controls['DepreciationAmount'].enable();
      this.createSecondaryForm.controls['Amount'].enable();
      this.createSecondaryForm.controls['Remarks'].enable();
      this.createSecondaryForm.controls['SalvageAmount'].setValue(this.secdLossInfo.SalvageAmount);
      this.createSecondaryForm.controls['ExcessAmount'].setValue(this.secdLossInfo.LessExcess);
      this.createSecondaryForm.controls['DepreciationAmount'].setValue(this.secdLossInfo.DepriciationAmount);
      this.createSecondaryForm.controls['Amount'].setValue(this.secdLossInfo.TotalPrice);
      this.createSecondaryForm.controls['PayeeName'].setValue(this.secdLossInfo.PayeeName);
      this.createSecondaryForm.controls['Remarks'].setValue(this.secdLossInfo.Remarks);
      this.createSecondaryForm.controls['SalvageAmount'].disable();
      this.createSecondaryForm.controls['ExcessAmount'].disable();
      this.createSecondaryForm.controls['DepreciationAmount'].disable();
      this.createSecondaryForm.controls['Amount'].disable();
      this.createSecondaryForm.controls['Remarks'].disable();
      if(this.secdLossInfo.VatYn!=null){
        this.VatYN = this.secdLossInfo.VatYn;
      }
    }
    else{
      this.createSecondaryForm.controls['PayeeName'].setValue(this.secdLossInfo.PayeeName);
      this.createSecondaryForm.controls['SalvageAmount'].setValue(this.secdLossInfo.SalvageAmount);
    this.createSecondaryForm.controls['ExcessAmount'].setValue(this.secdLossInfo.LessExcess);
    this.createSecondaryForm.controls['DepreciationAmount'].setValue(this.secdLossInfo.DepriciationAmount);
    this.createSecondaryForm.controls['Amount'].setValue(this.secdLossInfo.TotalPrice);
    this.createSecondaryForm.controls['Remarks'].setValue(this.secdLossInfo.Remarks)
    if(this.secdLossInfo.VatYn!=null){
      this.VatYN = this.secdLossInfo.VatYn;
    }
    }

  }
  onFormSubmit(event:string){
    if(this.DocumentImageList.length!=0){
      if(this.AccidentPhotos.length!=0){

      }
    }
  }
  async saveLossDetails(event: string) {
     console.log(this.createSecondaryForm);
     
    if (this.createSecondaryForm.invalid) {
      Swal.fire(
        `Please Fill All Required Fields`,
        'info'
      )
    } else {

      let Subusertype=this.logindata.SubUserType;
      if(Subusertype=='Approver'){
        this.onStatusUpdate();
      }
      else{
          let ReqObj = {
            "ChassisNo": this.claimDetails.ChassisNo,
            "ClaimNo": this.claimDetails.ClaimNo,
            "Claimrefno": this.claimDetails.Claimrefno,
            "PolicyNo": this.claimDetails.PolicyNo,
            "Losstypeid": this.secdLossInfo.LosstypeId,
            "Partyno": this.secdLossInfo.PartyNo,
            "Remarks": this.createSecondaryForm.controls['Remarks'].value,
            "TotalPrice": this.createSecondaryForm.controls['Amount'].value,
            "LossNo": this.isLossEdit == '' || null ? '' : this.isLossEdit,
            "SalvageAmount": this.createSecondaryForm.controls['SalvageAmount'].value,
            "DepriciationAmount": this.createSecondaryForm.controls['DepreciationAmount'].value,
            "LessExcess": this.createSecondaryForm.controls['ExcessAmount'].value,
            "SaveorSubmit": event == 'submit' ? 'Submit' : 'Save',
            "VatYn": this.VatYN,
            "PayeeName": this.createSecondaryForm.controls['PayeeName'].value,
            ...this.commonReqObject()
          }

          let UrlLink = `api/insertclaimLossdetail`;
          return this.lossService.saveLossDetails(UrlLink, ReqObj).subscribe(async (data: any) => {

            console.log("saveloss", data);
            if (data.Response == "SUCCESS") {
              this.dialogRef.close(true);
              if (this.isLossEdit == '' || null) {
                Swal.fire(
                  `Loss Created Successfully`,
                  'success'
                )
              } else {
                Swal.fire(
                  `Loss Updated Successfully`,
                  'success'
                )
              }
              this.onStatusUpdate();
            }
            if (data.Errors) {
              this.errorService.showValidateError(data.Errors);

            }
          }, (err) => {
            this.handleError(err);
          })
        }
    }
  }
  onStatusUpdate() {
    const dialogRef = this.dialog.open(StatusUpdateComponent, {
      width: '100%',
      panelClass: 'full-screen-modal'
    });

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
