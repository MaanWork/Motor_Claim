import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/shared/services/errors/error.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  service_count = 0;
  constructor(
    public router: Router,
    private errorService: ErrorService,
    private dialogRef: MatDialog,
    private spinner: NgxSpinnerService
  ) {}


  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.service_count++;
    this.spinner.show();
    return next.handle(req).pipe(
      finalize(() => {
        this.service_count--;
        if (this.service_count === 0) {
          this.errorService.clearTimeOut();
          this.spinner.hide();
        }
      }),
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if(error?.status==401){
            this.dialogRef.closeAll();
            this.router.navigate(['/Login/sessionRedirect'])
          }
        }
        console.log("401 Errors ",error)

        return throwError(error.message);
      })
    );
  }
}
