import { LossService } from 'src/app/commonmodule/loss/loss.service';
import { ChangeDetectorRef, Injector, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
@Pipe({ name: 'losstypename'})
export class LosstypenamePipe implements PipeTransform {
  logindata: any;
  constructor(private LossService : LossService) {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
  }

  async transform(value: any): Promise<any> {
    let UrlLink = `api/claimlosstype`;
    let product = sessionStorage.getItem('productNo');
    if(!product || product != undefined){
      product = "01";
    }
    let ReqObj = {
      "InsuranceId": this.logindata.InsuranceId,
      "PolicytypeId": product,
      "Status": 'Y'
    }
    return (await this.LossService.getClaimLossType(UrlLink,ReqObj))
      .toPromise()
      .then((LossList: any) => {
        if(value!='' && value != null && value != undefined){
          let val = [...LossList.Primary,...LossList.Secondary].find(x => x.Code == value)
         console.log(val)
        return val.CodeDesc;
        }
        
      })
  }

}



