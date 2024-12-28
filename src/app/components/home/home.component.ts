import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig],
  encapsulation: ViewEncapsulation.None,

})
export class HomeComponent implements OnInit {
  images = ['./assets/Images/Motor-Image.jpg', './assets/Images/Surveyor-image.jpg', './assets/Images/Garage-image.jpg'].map((n) =>n);
  constructor(
    private router: Router,
    config: NgbCarouselConfig
  ) {
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
   }

  ngOnInit(): void {
    // var myvid = (<HTMLVideoElement>document.getElementById('myvideo'));

    // myvid.addEventListener('ended', function (e) {
    //   // get the active source and the next video source.
    //   // I set it so if there's no next, it loops to the first one
    //   var activesource = document.querySelector("#myvideo source.active");
    //   var nextsource = (<HTMLInputElement>document.querySelector("#myvideo source.active + source")) || (<HTMLInputElement>document.querySelector("#myvideo source:first-child"));

    //   // deactivate current source, and activate next one
    //   activesource.className = "";
    //   nextsource.className = "active";

    //   // update the video source and play
    //   myvid.src = nextsource.src;
    //   myvid.play();
    // });
  }

  onGetUserLogin() {
    sessionStorage.removeItem('checkClaim');
    //this.router.navigate(['/Login/Claim-Intimate']);
    
    this.router.navigate(['/Login/ClaimIntimate']);   /* New Design */
    //window.location.href="http://102.69.166.162:8080/ClaimIntimateUat/"
  }

  onNavigateToPage(event){
    console.log("Event",event)
    if(event == "claim"){
      this.router.navigate(['./Login/Officer']);
    }
    else if(event == "surveyor"){
      this.router.navigate(['./Login/Surveyor']);
    }
    else if(event == "garage"){
      this.router.navigate(['./Login/Surveyor']);
    }
    else if(event == "intimate"){
      console.log("Intimate Entered");
      this.router.navigate(['./Home/Claimforms']);
    }

  }
}
