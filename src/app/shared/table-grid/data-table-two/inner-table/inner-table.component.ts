import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-inner-table',
  templateUrl: './inner-table.component.html',
  styleUrls: ['./inner-table.component.css']
})
export class InnerTableComponent implements OnInit {

  @Output("onLossView") onLossView = new EventEmitter();
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
    console.log(this.tableData);

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

}
