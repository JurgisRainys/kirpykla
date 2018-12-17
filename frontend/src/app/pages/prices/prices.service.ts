import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceWithPrice } from './serviceWithPrice';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class PricesService {
  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  getHairdresserReservations(): Observable<ServiceWithPrice[]> {
    return this.http.get<any[]>(
      this.loginService.addAccessKey(
        `http://localhost:3000/reservations/hairdresser`
      )
    )
  }

  getServicesAndPrices(): Observable<ServiceWithPrice[]> {
    return this.http.get<ServiceWithPrice[]>('http://localhost:3000/prices');
  }

  getHairdressers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/hairdressers');
  }

  getAvailableTimes(hairdresserId, serviceId): Observable<any[]> {
    return this.http.get<any[]>(
      this.loginService.addAccessKey(
        `http://localhost:3000/reservations/freetimes/hairdresser/${hairdresserId}/service/${serviceId}`
      )
    )
  }

  reserveTime(hairdresserId, serviceId, time): Observable<any> {
    return this.http.post<any>(
      this.loginService.addAccessKey(`http://localhost:3000/reservations`),
      { hairdresser: hairdresserId, service: serviceId, time }
    )
  }

  getReservations(): Observable<any[]> {
    return this.http.get<any[]>(
      this.loginService.addAccessKey(
        `http://localhost:3000/reservations`
      )
    )
  }

  deleteReservation(reservationId): Observable<any[]> {
    return this.http.delete<any[]>(
      this.loginService.addAccessKey(
        `http://localhost:3000/reservations/${reservationId}`
      )
    )
  }
}
