import { FormGroup } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, Input, NgZone, OnInit, ViewChild, OnDestroy, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LossService } from 'src/app/commonmodule/loss/loss.service';

@Component({
  selector: 'app-loss-map',
  templateUrl: './loss-map.component.html',
  styleUrls: ['./loss-map.component.css']
})
export class LossMapComponent implements OnInit,OnDestroy,OnChanges {

  public logindata:any;
  public latitude:number;
  public longitude:number;
  public zoom:number=5;
  public mapClickListener: any;
  public LossInformation:any;
  private geoCoder

  @ViewChild("search")
  public searchElementRef: ElementRef;
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: any;
  private subscription = new Subscription();
  @Input() MapInfo:any;

  @Input() form:FormGroup;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _sanitizer: DomSanitizer,
    private lossService:LossService

  ) { }

  ngOnInit(): void {
    this.logindata = JSON.parse(sessionStorage.getItem("Userdetails"))?.LoginResponse;
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 5;
        });
      });
    });

   this.subscription = this.lossService.getLossInformation.subscribe((event:any)=>{
      this.LossInformation = event;

    })


  }

  ngOnChanges(){
    // this.form.controls['Latitude'].setValue(this.latitude);
    // this.form.controls['Longitude'].setValue(this.longitude);
  }

  private setCurrentLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 5;
          if(this.form.controls['Latitude'].value == null || this.form.controls['Longitude'].value == null || this.form.controls['Latitude'].value == "" || this.form.controls['Longitude'].value == ""){
            this.form.controls['Latitude'].setValue(this.latitude);
            this.form.controls['Longitude'].setValue(this.longitude);
          }

        });

    }


  }



  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      this.ngZone.run(() => {
        // Here we can get correct event
        this.latitude = e.latLng.lat();
        this.longitude = e.latLng.lng();
        this.zoom = 5;
        console.log(this.form)
        console.log(this.latitude,this.longitude);
        this.form.controls['Latitude'].setValue(this.latitude);
        this.form.controls['Longitude'].setValue(this.longitude);

      });
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();

    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }

  damageListDisabled() {
    if (this.logindata?.UserType == "claimofficer") {
      return true;
    }
  }

}
