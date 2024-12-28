import { CommondataService } from './../services/commondata.service';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'countryname'
})
export class CountrynamePipe implements PipeTransform {
  public NationalityList: any=[];
  constructor(private commondataService: CommondataService) {

  }

  transform(value: any): any {
    this.commondataService.nationalityList.subscribe(
      (data) => {
        this.NationalityList=data;
      }
    );
      let nationalityname = this.NationalityList.find(ele=>ele.Code ==value);
      return nationalityname.CodeDesc;

  }

}
