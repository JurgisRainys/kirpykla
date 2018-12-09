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

  loggedInLinks = [
    [ "/rezervacija", 'REZERVACIJA' ],
    [ "/kainos", 'KAINOS' ],
    [ "/kontaktai", 'KONTAKTAI' ],
  ]

  links
  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  assignLinks(loggedIn: boolean) {
    this.links = loggedIn
      ? this.loggedInLinks
      : this.loggedOutLinks
  }

  logout() {
    this.loginService.successfulLogout()
    // this.router.navigateByUrl('/')
  }

  ngOnInit() {
    this.assignLinks(this.loginService.isLoggedIn())
    this.loginService.loginEvent().subscribe(loggedIn => this.assignLinks(loggedIn))
  }
}