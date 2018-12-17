import { Component, OnInit } from '@angular/core';
import { LoginService } from '../pages/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedOutLinks = [
    [ "/kainos", 'KAINOS' ],
    [ "/kontaktai", 'KONTAKTAI' ],
    [ "/prisijungti", 'PRISIJUNGTI' ]
  ]

  loggedInClientLinks = [
    [ "/rezervacija", 'REZERVACIJA' ],
    [ "/kainos", 'KAINOS' ],
    [ "/kontaktai", 'KONTAKTAI' ],
  ]

  loggedInHairdresserLinks = [
    [ "/rezervacijos", 'REZERVACIJOS' ],
  ]

  links
  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  assignLinks(user: any) {
    this.links = user
      ? user.role === 'hairdresser'
        ? this.loggedInHairdresserLinks
        : this.loggedInClientLinks
      : this.loggedOutLinks
  }

  logout() {
    this.loginService.successfulLogout()
    // this.router.navigateByUrl('/')
  }

  ngOnInit() {
    this.assignLinks(this.loginService.getUser())
    this.loginService.loginEvent().subscribe(loggedIn => 
      this.assignLinks(this.loginService.getUser())
    )
  }
}