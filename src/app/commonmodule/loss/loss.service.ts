import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, retry, take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ClaimjourneyService } from '../claimjourney/claimjourney.service';
import { CommondataService } from 'src/app/shared/services/commondata.service';
import *  as  Mydatas from '../../appConfig.json';
@Injectable({
  providedIn: 'root'
})
export class LossService {
  public MotorClaim: any = (Mydatas as any).default;
  public ApiUrl: any = this.MotorClaim.ApiUrl;
  public DocApiUrl: any = this.MotorClaim.DocApiUrl;
  public DocApiUrl2: any = this.MotorClaim.DocApiUrl2;
  public PolicyInformation: any;


  public Token: any;
  private claimInfo: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private claimsummay: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private partyList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private LossList: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private lossInformation: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private lossInformationReq: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private damageId: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private claimLossType: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private claimIntimateval: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private partyRowValue: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private MapComponentDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private DamageComponentDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private updateDamageDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private documentReasonList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private UploadedDocumentList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private LossDetails: any;








  public logindata: any;
  public claimDetails: any;
  insuranceId: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private commondataService: CommondataService,
    private spinner: NgxSpinnerService,
    private claimjourneyService: ClaimjourneyService

  ) {

    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    this.insuranceId = this.logindata.InsuranceId;

  }


  commonReqObject() {
    return {
      "BranchCode": this.logindata.BranchCode,
      "InsuranceId": this.logindata.InsuranceId,
      "RegionCode": this.logindata.RegionCode,
      "CreatedBy": this.logindata.LoginId,
      "UserType": this.logindata.UserType,
      "UserId": this.logindata?.OaCode

    }
  }

  onPassClaimData(claimDetails) {
    this.claimDetails = claimDetails;
  }

  onGetLossDetails(LossDetails) {
    this.LossDetails = LossDetails;
  }
  Loss(){
    if (this.LossDetails != undefined) {
      return this.LossDetails;
    } else {
      return this.LossDetails = JSON.parse(sessionStorage.getItem("LossDetails"));
    }
  }

  onPostMethod(UrlLink, ReqObj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onGetClaimDetails() {
    if (this.claimDetails != undefined) {
      return this.claimDetails;
    } else {
      return this.claimDetails = JSON.parse(sessionStorage.getItem("ClaimDetails"));
    }
  }





  get rowClaimInfo() {
    return this.claimInfo.asObservable();
  }
  get getclaimsummay() {
    return this.claimsummay.asObservable();

  }
  get getPartyList() {
    return this.partyList.asObservable();

  }


  get getLossInformation() {
    return this.lossInformation.asObservable();

  }
  get getlossInformationReq() {
    return this.lossInformationReq.asObservable();

  }


  get getdamageId() {
    return this.damageId.asObservable();

  }

  get getLossType() {
    return this.claimLossType.asObservable();

  }

  get getClaimIntimateval() {
    return this.claimIntimateval.asObservable();

  }
  get getPartyRowDetails() {
    return this.partyRowValue.asObservable();

  }

  get getMapComponentDetails() {
    return this.MapComponentDetails.asObservable();

  }
  get getDamageComponentDetails() {
    return this.DamageComponentDetails.asObservable();

  }

  get getLossList() {
    return this.LossList.asObservable();
  }

  get getUpdateDamageDetails() {
    return this.updateDamageDetails.asObservable();
  }

  get getdocumentReasonList() {
    return this.documentReasonList.asObservable();

  }
  get getUploadedDocumentList() {
    return this.UploadedDocumentList.asObservable();

  }





  onClaimSummaryData(claimsummaryData) {
    this.claimsummay.next(claimsummaryData);
  }



  onGetLossInformation(lossDetails) {
    this.lossInformation.next(lossDetails);
  }
  onGetLossRowInformation(req) {
    this.lossInformationReq.next(req);
  }

  onGetDamagePartId(id) {
    this.damageId.next(id);
  }

  onGetClaimLossType(id) {
    this.claimLossType.next(id);
  }

  onGetClaimIntimateVal(claimIntaimate) {
    this.claimIntimateval.next(claimIntaimate);
  }

  onGetPartyRowDetails(rowPartyDetails) {
    this.partyRowValue.next(rowPartyDetails);
  }

  onGetMapComponentDetails(mapDetails) {
    this.MapComponentDetails.next(mapDetails)
  }
  ongetDamageComponentDetails(damageDetails) {

    this.DamageComponentDetails.next(damageDetails)
  }

  onGetUpdateDamageDetails(updateDamageDetails) {
    this.updateDamageDetails.next(updateDamageDetails);
  }
  onGetDocumentReasonList(docReasonList) {
    this.documentReasonList.next(docReasonList);
  }

  onUploadedDocumentList(uploaddoc) {
    this.UploadedDocumentList.next(uploaddoc);
  }




  getToken() {
    this.authService.isloggedToken.subscribe((event: any) => {
      if (event != undefined && event != '' && event != null) {
        this.Token = event;
      } else {
        this.Token = sessionStorage.getItem('UserToken');
      }
    });
    return this.Token;
  }


  async onGetLossList(item) {
    var ReqObj;
    var UrlLink;
    if (this.logindata?.UserType == "surveyor") {
      UrlLink = `api/lossforsurveyor`;
      ReqObj = {
        "ClaimNo": this.claimDetails.ClaimNo,
        "PartyNo": item.PartyNo,
        ...this.commonReqObject()
      }
    }
    if (this.logindata?.UserType == "claimofficer") {
      UrlLink = `api/getclaimlossdetails`;
      ReqObj = {
        "ChassisNo": this.claimDetails.ChassisNo,
        "PolicyNo": this.claimDetails.PolicyNo,
        "ClaimNo": this.claimDetails.ClaimNo,
        "PartyNo": item.PartyNo,
        "Status": this.Loss()?.SubStatus,
        "LosstypeId": this.Loss()?.LosstypeId,
        ...this.commonReqObject()
      }
    }

    let response = (await this.onCallLossList(UrlLink, ReqObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;

  }

  viewClaimLossDetails(row) {
    let ReqObj = {
      "ClaimNo": row.ClaimNo,
      "CustomerId": 123,
      "GarageId": 0,
      "PolicyNo": row.PolicyNo,
      "ProductId": 66,
      "ChassisNo": row.ChassisNo,
      ...this.commonReqObject()
    }
    let UrlLink = `api/claimdetailsbyid`;
    return this.onGetClaimLossDetails(UrlLink, ReqObj).subscribe((data: any) => {

      this.onPassClaimData(data);
      sessionStorage.setItem("ClaimDetails", JSON.stringify(data));

    }, (err) => {
      this.handleError(err);
    })
  }



  GetClaimLossDetails(row) {
    let ReqObj = {
      "ClaimNo": row.ClaimNo,
      "CustomerId": 123,
      "GarageId": 0,
      "PolicyNo": row.PolicyNo,
      "ProductId": 66,
      "ChassisNo": row.ChassisNo,
      ...this.commonReqObject()
    }

    let UrlLink = `api/claimdetailsbyid`;
    return this.onGetClaimLossDetails(UrlLink, ReqObj).subscribe((data: any) => {
      this.onPassClaimData(data);
      sessionStorage.setItem("ClaimDetails", JSON.stringify(data));
      sessionStorage.setItem('ChassisNumber', row.ChassisNo);
      sessionStorage.setItem("PolicyNumber", data.PolicyNo);
      this.claimjourneyService.onGetPolicyDetails(sessionStorage.getItem("PolicyNumber"), 'byChassisNo',data.Claimrefno);
      if (this.logindata.UserType == "surveyor" || this.logindata.UserType == "claimofficer") {
        sessionStorage.removeItem('LossDetails');
        console.log('rrrrrrrrrrr',row)
        sessionStorage.setItem('LossDetails', JSON.stringify(row));
        this.router.navigate(['/Home/Loss']);
      }
      if (this.logindata.UserType == "garage") {
        sessionStorage.setItem("GarageLossDetails", JSON.stringify(row));
        if (row.SubStatus == 'PLC' || row.SubStatus == 'QAFG' || row.SubStatus == 'GQA' || row.SubStatus == 'QRFG' || row.SubStatus == 'RQFG' || row.SubStatus == 'QS' || row.SubStatus == 'SD' || row.SubStatus == 'AS' || row.SubStatus == 'SA' || row.SubStatus == 'SR' || row.SubStatus == 'CLG' || row.SubStatus == 'CLS' || row.SubStatus == 'PCD' || row.SubStatus == 'QA' || row.SubStatus == 'SPCG' || (row.SubStatus == 'GA' && this.insuranceId == '100008')) {
          this.router.navigate(['/Home/Garage']);
        } if (row.SubStatus == 'SLP' || row.SubStatus == 'SLF' || row.SubStatus == 'SLPR' || row.SubStatus == 'RC' || row.SubStatus == 'RG' || row.SubStatus == 'CIRFP' || row.SubStatus == 'IVG' || row.SubStatus == 'PFS' || row.SubStatus == 'UP' || row.SubStatus == 'AFA'  ) {
          this.router.navigate(['/Home/PendingAuthLetter']);

        }
      }

      // if(this.logindata.UserType == "garage" && (row.SubStatus == 'SLPR' || row.SubStatus == 'UP' || row.SubStatus == 'IVR'
      // || row.SubStatus != 'CIRFP' || row.SubStatus != 'CDTCWFI' || row.SubStatus != 'PFS')){
      //   sessionStorage.setItem("GarageLossDetails", JSON.stringify(row));
      //   this.router.navigate(['/Home/PendingAuthLetter']);
      // }

    }, (err) => {
      this.handleError(err);
    })
  }






  async onGetPartyList() {
    let ReqObj = {
      "ChassisNo": this.onGetClaimDetails().ChassisNo,
      "ClaimNo": this.onGetClaimDetails().ClaimNo,
      "PolicyNo": this.onGetClaimDetails().PolicyNo,
      ...this.commonReqObject()

    }
    var UrlLink;
    if (this.logindata.UserType == "surveyor") {
      ReqObj["SurveyorId"] = this.logindata.OaCode;
      UrlLink = `api/surveyor/partydetails`;

    }
    if (this.logindata.UserType == "claimofficer") {
      UrlLink = `api/partydetails`;
    }
    let response = (await this.onCallPartyList(UrlLink, ReqObj)).toPromise()
      .then(res => {
        // this.partyList.next(res);
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;

  }


  async ongetClaimLossType(PolicyInformation) {
    let policyTypeId = PolicyInformation?.PolicyInfo?.Product;
    if(policyTypeId == "" || policyTypeId == null || policyTypeId == undefined){
      policyTypeId = "01";
    }
    let UrlLink = `api/claimlosstype`;
    let ReqObj = {
      "InsuranceId": this.logindata.InsuranceId,
      "PolicytypeId": policyTypeId,
      "Status":'Y'
    }

    let response = (await this.getClaimLossType(UrlLink,ReqObj)).toPromise()
      .then(res => {
        return res;
      })
      .catch((err) => {
        this.handleError(err)
      });
    return response;

  }






  onParallelPostMethod(UrlLink: string, ReqObj: any): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl+UrlLink, ReqObj, { headers: headers })
      .pipe(map(data => { return data }), catchError(this.handleError));
  }




  async onClaimSummaryDetails(UrlLink, ReqObj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  async getClaimRefNo(UrlLink, ReqObj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onGetClaimLossDetails(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  async onCallPartyList(UrlLink, Reqobj): Promise<Observable<any>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));


  }





  async onCallLossList(UrlLink, Reqobj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onGetDocumentList(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  getUploadedClaimIntDocList(UrlLink, ReqObj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  getDamagePartsList(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  async getRepairType(UrlLink): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  // async getReserveType(UrlLink,Reqobj): Promise<Observable<any[]>> {
  //   let headers = new HttpHeaders();
  //   headers = headers.append('Authorization', 'Bearer ' + this.getToken());
  //   return await this.http
  //     .get<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
  //     .pipe(retry(1), catchError(this.handleError));
  // }
  async getClaimLossType(UrlLink,ReqObj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink,ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  saveLossDetails(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onUpdateStatus(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  getReserveType(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  onBindClaimIntimateValue(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onLossDelete(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onUploadFiles(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onGetBase64Image(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onGetUploadedDocumentsAlt(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl2 + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onGetUploadedDocuments(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onGetUploadedDocumentsNoAuth(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    //headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  submitDamagedetails(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onEditDamageParts(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onDeleteDocument(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  async getFaultCategory(UrlLink): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  async getMobileCodeList(UrlLink): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  async getClaimPartyType(UrlLink, Reqobj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  async getNationality(UrlLink, Reqobj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  async getAllInsurancePartyInfo(UrlLink): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  onCreateNewParty(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onPaymentSubmit(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  onDeletePartyDetials(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onLossEdit(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  async onStatusList(UrlLink, ReqObj): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return await this.http
      .post<any>(this.ApiUrl + UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }



  onSubmitDocumentReports(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.DocApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  getGender(UrlLink): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .get<any>(this.ApiUrl + UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }



  onRemoveLossMarkDetails(UrlLink, Reqobj): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());
    return this.http
      .post<any>(this.ApiUrl + UrlLink, Reqobj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  // Error handling
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
