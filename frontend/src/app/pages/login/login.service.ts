import { Injectable, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import * as jwt from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedIn: Subject<any> = new Subject()
  private user

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.user = this.isLoggedIn() 
      ? (new jwt.JwtHelperService()).decodeToken(this.cookieService.get('authJWT'))
      : undefined
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
    this.user = (new jwt.JwtHelperService()).decodeToken(this.cookieService.get('authJWT'))
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

  getUser() {
    return this.user
  }
}