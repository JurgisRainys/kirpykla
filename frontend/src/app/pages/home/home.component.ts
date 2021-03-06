import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service'
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  banner: String;
  
  constructor(
    private homeService: HomeService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    let banner = document.querySelector("#home-banner") as HTMLElement
    banner.style.color = 'black';
    // './assets/img/banner_4.jpg';
    // this.homeService.updateOnChange(this.text)
  }
}
