import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  text: String;
  
  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.updateOnChange(this.text)
  }
}
