import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-data-info-table',
  templateUrl: './data-info-table.component.html',
  styleUrls: ['./data-info-table.component.css']
})
export class DataInfoTableComponent implements OnInit {
  @Output("onAction") emitter = new EventEmitter();
  @Output("onChangeCheckBox") onChangeCheckBox = new EventEmitter();
  @Output ("onChangeCheck") onChangeCheck = new EventEmitter();



  @Input("data") tableData: any = [];
  @Input("cols") columnHeader: any = [];
  dataSource
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) private paginator: MatPaginator;
  sortProperty='AllotedYN';
  sortDirection='desc';
  actionValue: { event: any; element: any; };
  constructor() { }

  ngOnChanges() {
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
  getChoosedType(event,element){
    console.log("Event",event);
    if(event.value=='Y'){
        this.actionValue = {
          event:{checked:true},
          element:element
        }
    }
    else{
       this.actionValue = null;
    }
  }


}
