import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ViewStatusComponent } from 'src/app/admin/components/masters/viewstatus/viewstatus.component';

@Component({
  selector: 'app-data-table-two',
  templateUrl: './data-table-two.component.html',
  styleUrls: ['./data-table-two.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DataTableTwoComponent implements OnInit, OnChanges, AfterViewInit{

  public logindata:any;
  public claimDetails:any;
  
  objectKeys = Object.keys;
  @Output("onAction") emitter = new EventEmitter();
  @Output("onSurveyEmit") surveyEmit = new EventEmitter();
  @Output("GetLossList") onGetLossList = new EventEmitter();
  @Output("onLossListView") onLossListView = new EventEmitter();
  @Output("onPartyPayView") onPartyPayView = new EventEmitter();
  @Output("onPartyPayAction") onPartyPayAction = new EventEmitter();
  @Output("onChangeCheckBox") onChangeCheckBox = new EventEmitter();
  @Input("data") tableData: any = [];
  @Input("cols") columnHeader: any = [];
  @Input("innerData") innerTableData: any = [];
  @Input("innerCols") innerColumnHeader:any=[];
  @Output('onStatus') onStatus = new EventEmitter();
  result:any;
  dataSource
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) private paginator: MatPaginator;
  constructor(public dialog: MatDialog) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    console.log(this.claimDetails,this.logindata.UserType);

    console.log("Party-header",this.columnHeader,"party-data",this.tableData);
  }

  onLossView(event){
   this.onLossListView.emit(event);
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.innerTableData;
    this.innerColumnHeader;
    console.log(this.innerTableData);
  }


  ngOnInit() {
    console.log(this.tableData);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;

  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onstatus(element){
    this.result=element;
    console.log('MMMMMMMMMMMMM',element)
    const dialogRef = this.dialog.open(ViewStatusComponent, {
      data: {
        title:this.result
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed',result);
      if(result){
      this.select({'data':result,"element":this.result});
      }
      //this.onStatus.emit(result);
      //this.animal = result;
    });
  }
  select(element){
    this.onStatus.emit(element);
  }

}
