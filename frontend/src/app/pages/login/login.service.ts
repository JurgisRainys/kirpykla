import { Injectable, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedIn: Subject<any> = new Subject()

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.loggedIn.next(this.isLoggedIn())
  }

  addAccessKey = (url) => 
    this.isLoggedIn() 
      ? `${url}?accessKey=` + this.cookieService.get('authJWT')
      : `${url}`

  loginEvent() {
    return this.loggedIn.asObservable()
  } 

  successfulLogin() {
    this.loggedIn.next(true)
  }

  successfulLogout() {
    this.cookieService.delete('authJWT')
    this.loggedIn.next(false)
  }

  login(name, pw): Observable<any> {
    return this.http.post(
      'http://localhost:3000/auth/login/local',
      { username: name, password: pw },
    )
  }

  register(name, pw): Observable<any> {
    return this.http.post(
      'http://localhost:3000/auth/register/local', 
      { username: name, password1: pw, password2: pw }
    )
  }

  isLoggedIn() {
    return this.cookieService.check('authJWT')
  }
}