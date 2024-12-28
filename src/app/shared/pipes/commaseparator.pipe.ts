import { NgModule, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'commaseparator',
})
export class Commaseparator implements PipeTransform {
  constructor() { }

  transform(value: any): any {
    if (value) {
      console.log(value);
      const removecomma: any = value.toString().replace(/,/g, '');
      const number: any = Number(removecomma);
      console.log(removecomma, number);

      return new Intl.NumberFormat('en').format(number);
    } else {
      return '';
    }

  }

}
