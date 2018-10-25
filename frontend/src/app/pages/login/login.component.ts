import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: String;
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    // this.loginService
    //   .login()
    //   .subscribe(name => {
    //     this.user = name;
    //   })
  }
}
