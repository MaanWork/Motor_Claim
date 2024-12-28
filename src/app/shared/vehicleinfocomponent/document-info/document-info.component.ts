import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardTableService } from 'src/app/commonmodule/dashboard-table/dasboard-table.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorService } from '../../services/errors/error.service';
import { CommondataService } from '../../services/commondata.service';
import { ImageviewModalComponent } from '../../imageview-modal/imageview-modal.component';
import { Subscription } from 'rxjs';
import { LossService } from 'src/app/commonmodule/loss/loss.service';

@Component({
  selector: 'app-document-info',
  templateUrl: './document-info.component.html',
  styleUrls: ['./document-info.component.css']
})
export class DocumentInfoComponent implements OnInit {
  @Input() ClaimInfo:any;
  public documentInformation: any;
  public panelOpen: boolean = true;
  public documentList: any;
  public photosFile: any = [];
  public documentFile: any = [];
  public ViewImages: any = {};
  private subscription = new Subscription();
  logindata: any;

  constructor(
    private errorService: ErrorService,
    private router: Router,private lossService: LossService,
    private spinner: NgxSpinnerService,
    private dashboardTableService: DashboardTableService,
    private commondataService: CommondataService,
    public dialog: MatDialog,

  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
  }

  async ngOnInit(): Promise<void> {
    this.onGetClaimInformation();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async onGetClaimInformation() {
    this.documentInformation =this.ClaimInfo;
    if (event != null) {
      this.documentList = await this.onGetUploadDocList(this.documentInformation);
      console.log(this.documentList);
      this.documentFile = [];
      this.photosFile = [];
      for (let index = 0; index < this.documentList?.length; index++) {
        const element = this.documentList[index];
        this.onGetImage(element);
      }
    }
  }

  async onGetUploadDocList(documentInformation) {
    console.log("claiminfo",documentInformation);
    let createdBy = [];
    createdBy.push(documentInformation?.CreatedBy);
    let logExist = createdBy.some((ele:any)=>ele == this.logindata.LoginId);
    if(!logExist){
      createdBy.push(this.logindata.LoginId);
    }
    let ReqObj = {
      "Claimno": documentInformation?.Claimrefno,
      "PartyNo": '1',
      "LossId":"52",
      "Accimage":'N',
      "Insid":this.logindata.InsuranceId,
      "CreatedBy": createdBy,
      "LoginId":this.logindata.LoginId
    }
    let UrlLink = `getdoclist`;
    let response = (await this.lossService.onGetUploadedDocuments(UrlLink, ReqObj)).toPromise()
      .then(res => {
        console.log(res)
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
  }

  onGetImage(list) {
    let UrlLink = "getimagefile";
    let reqObj = {
      "ClaimNo": this.documentInformation.Claimrefno,
      "ReqRefNo": list.Documentref,
      "DocTypeId": list.documentId,
      "ProductId": list.ProductId,
      "InsId": list.companyId
    }
    return this.commondataService.onGetImage(UrlLink, reqObj).subscribe((data: any) => {
      if (list.docApplicable == 'CLAIM-ACC') {
        let Exist = this.photosFile.some((ele: any) => ele.name == list.FileName);
          let Index = this.photosFile.findIndex((ele: any) => ele.name == list.FileName);
          if(!Exist){
            this.photosFile.push({ url: data.IMG_URL, name: list.FileName });
          }
      } else {
        let Exist = this.documentFile.some((ele: any) => ele.name == list.FileName);
        let Index = this.documentFile.findIndex((ele: any) => ele.name == list.FileName);
        if(!Exist){
          this.documentFile.push({ url: data.IMG_URL, name: list.FileName });
        }
      }
    }, (err) => {

      this.handleError(err);
    })
  }

  onViewImage(item) {
    console.log(item)
    this.ViewImages = item;
    this.commondataService.onGetImageUrl(item);
    const dialogRef = this.dialog.open(ImageviewModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
