import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { AllotedGaragesComponent } from '../../GarageComponent/alloted-garages/alloted-garages.component';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-data-table-one',
  templateUrl: './data-table-one.component.html',
  styleUrls: ['./data-table-one.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DataTableOneComponent implements OnInit, OnChanges, AfterViewInit {

  public logindata:any;
  public claimDetails:any;
  objectKeys = Object.keys;
  expandedSymbol: string = null;

  @Output("onAction") emitter = new EventEmitter();

  @Output("onLossEdit") onLossEdit = new EventEmitter();
  @Output("onLossDelete") onLossDelete = new EventEmitter();
  @Output("onLossAllote") onLossAllote = new EventEmitter();
  @Output("onSubLossPdf") onSubLossPdf = new EventEmitter();
  @Output("onPartyPayView") onPartyPayView = new EventEmitter();
  @Output("onCSView") onCSView = new EventEmitter();
  @Output("onPartyPayAction") onPartyPayAction = new EventEmitter();
  @Output("onLossClaimAllot") onLossClaimAllot = new EventEmitter();
  @Output("onLossGarageAllot") onLossGarageAllot = new EventEmitter();
  @Output("onLossTrack") onLossTrack = new EventEmitter();
  @Output("onLossReservedTransactions") onLossReservedTransactions = new EventEmitter();
  @Output("onSurveyorLossPdf") onSurveyorLossPdf = new EventEmitter();
  @Output("onSurveyorApproved") onSurveyorApproved = new EventEmitter();
  @Output("onInvoiceLossPdf") onInvoiceLossPdf = new EventEmitter();
  @Output("onClaimLossEdit") onClaimLossEdit = new EventEmitter();
  @Output("onClaimLossStatusTrack") onClaimLossStatusTrack = new EventEmitter();
  @Output("onAllotedGarage") onAllotedGarage = new EventEmitter();
  @Output("onGetGarageDetails") onGetGarageDetails = new EventEmitter();
  @Output('onOpenPayment') onOpenPayment = new EventEmitter();
  @Output("onViewData") onViewData = new EventEmitter();
  @Output("onEditClaimData") onEditClaimData = new EventEmitter();
  @Output("onGeneratePdf") onGeneratePdf = new EventEmitter();
  @Output("onGarageSelect") onGarageSelect = new EventEmitter();
  @Output("onGarageAccept") onGarageAccept = new EventEmitter();
  @Output("onGarageReject") onGarageReject = new EventEmitter();
  @Output ("onGetChoosedId") onGetChoosedId = new EventEmitter();
  @Output("onViewClaimDetails") onViewClaimDetails = new EventEmitter();
  @Input("form") createAccidentDetails=FormGroup;





  @Input("data") tableData: any[] = [];
  @Input("cols") columnHeader: any[] = [];
  @Input("innercols") innerColumnHeader:any[]=[];
  @Input("gridType") gridType:any="";
  dataSource
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) private paginator: MatPaginator;
  sortProperty='AllotedYN';
  sortDirection='desc';
  LossDetails: any;userType:any=null;
  constructor(
    public dialogRef: MatDialogRef<AllotedGaragesComponent>,
    private router:Router
  ) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    this.LossDetails = JSON.parse(sessionStorage.getItem("LossDetails"));
    this.userType = this.logindata?.UserType;
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sortProperty='AllotedYN';
    this.sortDirection='desc';
    if(!this.gridType){
      this.gridType = "";
    }
    console.log(this.tableData,this.columnHeader);

  }


  ngOnInit() {

    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;

  }
  ngAfterViewInit() {
    this.sortProperty='AllotedYN';
    this.sortDirection='desc';
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  checkPdfFunction(event){
    return (event.SurveyorYn == 'Y' && this.logindata?.UserType == "surveyor");
  }
  // We will need this getter to exctract keys from tableCols
  get keys() {
    return this.columnHeader.map(({ key }) => key);
  }

  // this function will return a value from column configuration
  // depending on the value that element holds
  showBooleanValue(elt, column) {
    return column.config.values[`${elt[column.key]}`];
  }
  getReservedValue(element){
    console.log("Event Received",element)
  }
  onMoveToLOPSheet(row){
    sessionStorage.setItem("GarageLossDetails", JSON.stringify(row));
    this.router.navigate(['./Home/PendingAuthLetter']);
    this.dialogRef.close();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  checkInvoicePdf(event:any){
      return (this.LossDetails.SubStatus == 'PFS' && this.logindata?.UserType == "claimofficer");
  }
  toggleExpandableSymbol(symbol: null): void {
    this.expandedSymbol = this.expandedSymbol === symbol
      ? null
      : symbol;
  }

}
