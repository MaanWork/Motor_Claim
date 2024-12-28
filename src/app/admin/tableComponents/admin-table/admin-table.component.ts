import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ViewStatusComponent } from '../../components/masters/viewstatus/viewstatus.component';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css']
})
export class AdminTableComponent implements OnInit  {
  @Output("onAction") emitter = new EventEmitter();
  @Output("onSurveyEmit") surveyEmit = new EventEmitter();
  @Output("onChangeCheckBox") onChangeCheckBox = new EventEmitter();
  @Output('onStatus') onStatus = new EventEmitter();
  @Input("data") tableData: any = [];
  @Input("cols") columnHeader: any = [];
  dataSource
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) private paginator: MatPaginator;
  sortProperty='AllotedYN';
  sortDirection='desc';
  result:any;
  constructor(public dialog: MatDialog) { }

  ngOnChanges() {
    console.log("Table Source Data",this.tableData);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }


  ngOnInit() {
    console.log(this.tableData);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;

  }
  ngAfterViewInit() {
    this.sortProperty='AllotedYN';
    this.sortDirection='desc';
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  get keys() {
    return this.columnHeader.map(({ key }) => key);
  }

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
