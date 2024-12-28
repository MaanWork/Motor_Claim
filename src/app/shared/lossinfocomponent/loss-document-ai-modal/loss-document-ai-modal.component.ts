import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommondataService } from '../../services/commondata.service';

@Component({
  selector: 'app-loss-document-ai-modal',
  templateUrl: './loss-document-ai-modal.component.html',
  styleUrls: ['./loss-document-ai-modal.component.css']
})
export class LossDocumentAiModalComponent implements OnInit {
  documentDetails:any 
  constructor(public dialogRef: MatDialogRef<LossDocumentAiModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public commondataService: CommondataService,) { 
      
    }

  ngOnInit(): void {
    console.log("Received Data",this.data);
    this.documentDetails = this.data.documentAIData;
  }
  onViewImage(document,fileData){
    // this.commondataService.onGetImageUrl(fileData);
    // const dialogRef = this.dialog.open(ImageviewModalComponent);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
  onDownloadImage(documentData,fileData){
    var a = document.createElement("a");
      a.href = fileData;
      a.download = documentData.Filename;
      document.body.appendChild(a);
      a.click();
  }
}
