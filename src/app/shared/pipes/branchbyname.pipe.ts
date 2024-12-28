import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { ChangeDetectorRef, Injector, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
@Pipe({ name: 'branchbyname'})
export class BranchbynamePipe implements PipeTransform {
  regionCode: any;
  InsuCode: any;
  constructor( private adminService: AdminService,private LossService : LossService) {
    this.regionCode = "";
    this.InsuCode = "";
  }

  async transform(value: any): Promise<any> {
    let RegionCode = sessionStorage.getItem('loginRegionCode');
    let InsuCode = sessionStorage.getItem('loginInsCode');
    if(InsuCode && value && value != ""){
      let UrlLink = `api/branches/${InsuCode}`;
      return (await this.adminService.onGetMethodAsync(UrlLink))
        .toPromise()
        .then((BranchList: any) => {
          console.log("Received Branch List",BranchList,value)
          let val = BranchList.find(x => x.Code == value)
           console.log(val)
          return val.CodeDesc;
        })
    }
   
  }
  

}



