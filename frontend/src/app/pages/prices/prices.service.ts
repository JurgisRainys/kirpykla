import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceWithPrice } from './serviceWithPrice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PricesService {

  constructor(private http: HttpClient) { }

  getServicesAndPrices(): Observable<ServiceWithPrice[]> {
    return this.http.get<ServiceWithPrice[]>('http://localhost:3000/prices');
  }
}
