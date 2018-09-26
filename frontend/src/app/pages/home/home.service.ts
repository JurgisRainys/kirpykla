import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', 
})

export class HomeService {
  constructor(private http: HttpClient) { }

  // sufixint
  // getBanner(): String {
  //   this.http.get<String>('http://localhost:3000/home')
  // }
}