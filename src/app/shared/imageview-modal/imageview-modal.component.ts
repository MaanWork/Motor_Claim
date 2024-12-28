import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { DashboardTableService } from 'src/app/commonmodule/dashboard-table/dasboard-table.service';
import { CommondataService } from '../services/commondata.service';
import { ErrorService } from '../services/errors/error.service';

@Component({
  selector: 'app-imageview-modal',
  templateUrl: './imageview-modal.component.html',
  styleUrls: ['./imageview-modal.component.css']
})
export class ImageviewModalComponent implements OnInit,OnDestroy {

  public ImageObj:any={};
  private subscription = new Subscription();
  constructor(
    private errorService: ErrorService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dashboardTableService: DashboardTableService,
    private commondataService: CommondataService,
  ) { }

  ngOnInit(): void {
    this.subscription=this.commondataService.getImageUrl.subscribe((event: any) => {
      this.ImageObj = event;
       console.log("On View Image",this.ImageObj);
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
