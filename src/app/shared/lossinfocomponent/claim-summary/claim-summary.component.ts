import { LossService } from '../../../commonmodule/loss/loss.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalComponent } from 'src/app/commonmodule/dashboard-table/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DashboardTableService } from 'src/app/commonmodule/dashboard-table/dasboard-table.service';

@Component({
  selector: 'app-claim-summary',
  templateUrl: './claim-summary.component.html',
  styleUrls: ['./claim-summary.component.css']
})
export class ClaimSummaryComponent implements OnInit,OnDestroy {

  public claimSummary;
  private subscription = new Subscription();
  public claimDetails:any;
  public panelOpen:boolean=false;
  constructor(
    private lossService:LossService,
    public dialog: MatDialog,
    private dashboardTableService: DashboardTableService,

  ) {

  }

  ngOnInit(): void {
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    console.log(this.claimDetails);
   this.subscription = this.lossService.getclaimsummay.subscribe((event: any) => {
      this.claimSummary=event;

    });
  }
 onViewInfo(){
    this.panelOpen = !this.panelOpen;
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


 async  onViewClaimModal(){
    let claimData = await this.dashboardTableService.onViewClaimIntimation(this.claimDetails);
    if(claimData){
      const dialogRef = this.dialog.open(ModalComponent,{
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        panelClass: 'full-screen-modal',
        data:{statusUpdate:'notstatusUpdate',ViewClaimData:claimData}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }
  onGeneratePdf() {
    let claimrefNo = "";
    if(this.claimDetails?.ClaimRefNo) claimrefNo = this.claimDetails?.ClaimRefNo;
    else if(this.claimDetails?.Claimrefno) claimrefNo = this.claimDetails?.Claimrefno;
    let ReqObj = {
      "claimNo": claimrefNo,
      "policyNo": this.claimDetails.PolicyNo
    }
    let UrlLink = "pdf/accidentform";
    // let reqObj = {
    //   "policyNo": rowData.PolicyNo,
    //   "claimNo": rowData.Claimrefno
    // }
    return this.lossService.onGetBase64Image(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("108Data", data);

      this.downloadMyFile(data)
    }, (err) => {
    })

  }

  downloadMyFile(data) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', data.PdfOutFilePath);
    link.setAttribute('download', data.FileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }



}
