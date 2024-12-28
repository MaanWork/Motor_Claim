import { CommondataService } from './../../shared/services/commondata.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavItem } from 'src/app/shared/Interfaces/nav-item';
import { Location } from '@angular/common';
import { MultilevelMenuService } from 'ng-material-multilevel-menu';
import Swal from 'sweetalert2';
import { log } from 'console';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  public isExpanded = true;
  public showSubmenu: boolean = false;
  public isShowing = false;
  public showSubSubMenu: boolean = false;
  public logindata: any;
  public UserType: any;
  public appitems: any = [];
  public UpdateMenuName: any = 'No User';

  config = {
    paddingAtStart: true,
    classname: 'my-custom-class',
    listBackgroundColor: `rgb(211, 233, 251)`,
    fontColor: `#362C82`,
    backgroundColor: `rgb(211, 233, 251)`,
    selectedListFontColor: `#362C82`,
    highlightOnSelect: true,
    collapseOnSelect: true,
  };

  public hidebackbtn: boolean;
  branchValue: any = '';
  branchList: any[] = [];
  insuranceId: any;
  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private location: Location,
    private router: Router,
    private commondataService: CommondataService,
    private multilevelMenuService: MultilevelMenuService
  ) {
    this.logindata = JSON.parse(sessionStorage.getItem('Userdetails'));
    this.UserType = JSON.parse(sessionStorage.getItem('UserType'));
    this.insuranceId = this.logindata.LoginResponse.InsuranceId;
  }

  ngOnInit(): void {
    
    this.onMenuCall();
    this.setBranchValue();
    this.setExpandCollapseStatus('expand');
  }

  setBranchValue() {
    this.branchList = this.logindata.LoginResponse.BranchCodeList;
    for (let branch of this.branchList) {
      if (branch.Code == this.logindata.LoginResponse.BranchCode) {
        this.branchValue = branch.CodeDesc;
      }
    }
  }
  finaliseBranchValue(rowData) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Change Branch!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.logindata.LoginResponse.BranchCode = rowData.Code;
        this.logindata.LoginResponse.RegionCode = rowData.RegionCode;
        this.branchValue = rowData.CodeDesc;
        sessionStorage.removeItem('Userdetails');
        sessionStorage.setItem('Userdetails', JSON.stringify(this.logindata));
        if (this.UserType == 'admin') {
          if (this.router.url == '/Home/Admin') {
            window.location.reload();
          } else {
            this.router.navigate(['/Home/Admin']);
          }
        } else {
          if (this.router.url == '/Home/Dashboard') {
            window.location.reload();
          } else {
            this.router.navigate(['/Home/Dashboard']);
          }
        }
      } else {
      }
    });
  }
  onMenuCall() {
    if (this.logindata.LoginResponse.UserType == 'surveyor') {
      this.UpdateMenuName = 'Surveyor';
      this.appitems = [
        {
          label: this.UpdateMenuName,
          faIcon: 'fas fa-user-tie',

          items: [
            {
              label: 'Dashboard',
              link: '/Home/Dashboard',
              faIcon: 'fas fa-border-all',
            },
          ],
        },
        {
          label: 'Item 4',
          link: '/item-4',
          icon: 'star_rate',
          hidden: true,
        },
      ];
    }
    if (this.logindata.LoginResponse.UserType == 'claimofficer') {
      this.UpdateMenuName = 'Claim Officer';
      this.appitems = [
        {
          label: this.UpdateMenuName,
          faIcon: 'fas fa-user-tie',

          items: [
            {
              label: 'Dashboard',
              link: '/Home/Dashboard',
              faIcon: 'fas fa-border-all',
            },
            {
              label: 'Claim Journey',
              link: '/Home/Claim',
              faIcon: 'far fa-folder-open',
            },
            {
              label: 'Claim Intimate',
              link: '/Home/ClaimIntimate',
              faIcon: 'far fa-folder-open',
            },
            {
              label: 'Claim Search',
              link: '/Home/claimsearch',
              faIcon: 'far fa-folder-open',
            },
          ],
        },
        {
          label: 'Item 4',
          link: '/item-4',
          icon: 'star_rate',
          hidden: true,
        },
      ];
    }
    if (this.logindata.LoginResponse.UserType == 'garage') {
      this.UpdateMenuName = 'Garage';
      this.appitems = [
        {
          label: this.UpdateMenuName,
          faIcon: 'fas fa-user-tie',

          items: [
            {
              label: 'Dashboard',
              link: '/Home/Dashboard',
              faIcon: 'fas fa-border-all',
            },
            {
              label: 'Claim Intimate',
              link: '/Home/ClaimIntimate',
              faIcon: 'far fa-folder-open',
            },
          ],
        },
        {
          label: 'Item 4',
          link: '/item-4',
          icon: 'star_rate',
          hidden: true,
        },
      ];
    }

    if (this.logindata.LoginResponse.UserType == 'admin') {
      this.UpdateMenuName = 'Admin';
      this.appitems = [
        {
          label: 'Master',
          faIcon: 'fas fa-user-tie',
          items: [
            {
              label: 'Bank Master',
              link: 'Admin//BankMaster',
              faIcon: 'fas fa-th',
            },
            // {
            //   label: 'Bank City Master',
            //   link: 'Admin/BankCityMaster',
            //   faIcon: 'fas fa-th'
            // },
            // {
            //   label: 'Bank Branch Master',
            //   link: 'Admin/BankBranchMaster',
            //   faIcon: 'fas fa-th'
            // },
            {
              label: 'Branch Master',
              link: 'Admin/BranchMaster',
              faIcon: 'fas fa-th',
            },
            // {
            //   label: 'Bank City Master',
            //   link: 'Admin/BankCityMaster',
            //   faIcon: 'fas fa-th'
            // },
            // {
            //   label: 'Bank Branch Master',
            //   link: 'Admin/BankBranchMaster',
            //   faIcon: 'fas fa-th'
            // },
            {
              label: 'City Master',
              link: 'Admin/CityMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Claim Status Master',
              link: 'Admin//ClaimStatusMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Claim SubStatus Master',
              link: 'Admin//ClaimSubStatusMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Country Master',
              link: 'Admin//CountryMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Currency Master',
              link: 'Admin//CurrencyMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Document Master',
              link: 'Admin//DocumentMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Exchange Master',
              link: 'Admin//ExchangeMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Insurance Master',
              link: 'Admin/InsuranceMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Loss Type Master',
              link: 'Admin//LossTypeMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Mail Master',
              link: 'Admin//MailMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Nationality Master',
              link: 'Admin//NationalityMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Notify Master',
              link: 'Admin//NotifyMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Occupation Master',
              link: 'Admin//OccupationMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Party Type Master',
              link: 'Admin//PartyTypeMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Region Master',
              link: 'Admin//RegionMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Role Master',
              link: 'Admin/RoleMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Sms Master',
              link: 'Admin//SmsMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Usertype Master',
              link: 'Admin/UsertypeMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Vehicle BodyParts Master',
              link: 'Admin/VehicleMaster',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Vehicle PartsGroup Master',
              link: 'Admin/VehicleParts',
              faIcon: 'fas fa-th',
            },
            {
              label: 'Cause Of Loss',
              link: 'Admin/CauseofLoss',
              faIcon: 'fas fa-th',
            },
          ],
        },
        {
          label: 'Login Creation',
          faIcon: 'fas fa-user-tie',
          items: [
            {
              label: 'Admin',
              link: 'Admin',
              faIcon: 'fas fa-border-all',
            },
            {
              label: 'Claim Officer',
              link: 'Admin/ClaimLogin',
              faIcon: 'fas fa-border-all',
            },
            {
              label: 'Assessor',
              link: '/Home/SurveyorLogin',
              faIcon: 'fas fa-border-all',
            },
            {
              label: 'Garage',
              link: '/Home/GarageLogin',
              faIcon: 'fas fa-border-all',
            },
          ],
        },
        {
          label: 'Search',
          link: '/Home/Search',
          faIcon: 'fas fa-search',
        },
        {
          label: 'Claims',
          link: '/Home/Claims',
          faIcon: 'fas fa-border-all',
        },
      ];
    }
  }
  setExpandCollapseStatus(type) {
    this.multilevelMenuService.setMenuExapandCollpaseStatus(type);
  }

  onLogout() {
    this.authService.logout();
  }

  selectedItem(val) {
    //sessionStorage.setItem('garageLoginReload','true');
    console.log('URL Selected', val);
  }
}
