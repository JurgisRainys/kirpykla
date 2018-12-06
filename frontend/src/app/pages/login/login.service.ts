import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  login(name, pw): Observable<any> {
    return this.http.post(
      'http://localhost:3000/auth/login/local',
      { username: name, password: pw },
      { observe: 'response' }
    )
  }

  register(name, pw): Observable<any> {
    return this.http.post(
      'http://localhost:3000/auth/register/local', 
      { username: name, password1: pw, password2: pw }
    )
  }
}