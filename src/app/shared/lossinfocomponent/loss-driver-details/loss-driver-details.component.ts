import { StatusUpdateComponent } from './../status-update/status-update.component';
import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { Component, EventEmitter, Input, OnInit, Output,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from '../../services/errors/error.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-loss-driver-details',
  templateUrl: './loss-driver-details.component.html',
  styleUrls: ['./loss-driver-details.component.css']
})
export class LossDriverDetailsComponent implements OnInit,OnDestroy {
  public logindata: any = {};
  public claimDetails: any = {};
  public createDriverForm: FormGroup;
  public startDate = new Date();
  public driverMaxDOB = new Date();
  public accidentMaxDate = new Date();
  public isDisabled: boolean = true;
  public mapComponent: any;
  public damageComponent: any;
  public LossInformation: any;
  public lossInformationReq:any;
  public lossDriverInformation:any;

  public GenderTypeList:any=[];
  public DocumentReasonList:any=[];

  public MobileCodeList:any;
  @Input() claimIntimate: any = {};

  @Output() public GetLossListById = new EventEmitter<any>();
  private subscription = new Subscription();

  @Input() form:FormGroup
  constructor(
    private formBuilder: FormBuilder,
    private LossService: LossService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    private datePipe:DatePipe,
    public dialog: MatDialog,

  ) {
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var day = new Date().getDate();
    this.startDate = new Date(year - 18, month, day);
    this.driverMaxDOB = new Date(year - 18, month, day);
    this.accidentMaxDate = new Date(year, month, day - 1);
  }
  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));

    this.onInitialFetchData();

  }

 async onInitialFetchData(){
    this.MobileCodeList = await this.getMobileCodeList();
    this.getGender();

  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }



  getGender() {
    let UrlLink = `api/gender`;
    return this.LossService.getGender(UrlLink).subscribe((data: any) => {
      this.GenderTypeList = data;
    }, (err) => {
      this.handleError(err);
    })
  }

  async getMobileCodeList() {
    let UrlLink = `api/mobilecode`;
    let response = (await this.LossService.getMobileCodeList(UrlLink)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;
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
