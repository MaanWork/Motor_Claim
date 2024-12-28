import { CommondataService } from '../services/commondata.service';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { AdminService } from 'src/app/admin/admin.service';
@Pipe({
  name: 'statename'
})
export class StatenamePipe implements PipeTransform {
  public stateList: any=[];
  constructor( private adminService: AdminService,private commondataService: CommondataService) {

  }

  async transform(value: any): Promise<any> {
    let RegionCode = sessionStorage.getItem('loginRegionCode');
    let InsuCode = sessionStorage.getItem('loginInsCode');
    if(InsuCode && value && value != ""){
      let countryCode:any="";
      if(InsuCode=='100002'){ countryCode = 'TZA'}
      else if(InsuCode=='100003'){ countryCode = 'UG'}
      let ReqObj = {
        CountryId: countryCode
      }
      let UrlLink = `master/dropdown/state`;
      return (await this.adminService.onPostMethodAsync(UrlLink,ReqObj))
        .toPromise()
        .then((BranchList: any) => {
          let list:any[] = BranchList.Result;
          console.log("Received Branch List",BranchList,value)
          if(list.length!=0){
            let val = list.find(x => x.Code == value)
           console.log(val)
            return val.CodeDesc;
          }
          else return null;
        })
    }
   
  }

}
