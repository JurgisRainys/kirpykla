import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', 
})

export class HomeService {
  constructor(private http: HttpClient) { }

  updateOnChange(text: String): void {
    this.http.get<String>('http://localhost:3000/home')
    .subscribe(data =>
      text = data
    )
  }
}