import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { PricesService } from '../prices/prices.service'
import { ServiceWithPrice } from '../prices/serviceWithPrice'
import { CookieService } from 'ngx-cookie-service';
declare var $: any;

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  reservationForm
  hourDisabled
  dateDisabled
  hairdressersDisabled: boolean

  services: ReadonlyArray<ServiceWithPrice>
  hairdressers: ReadonlyArray<any>
  hairdressersShown: ReadonlyArray<any>
  availableTimes: ReadonlyArray<any>
  availableDates
  availableHours
  reservations

  selectedServiceId: string
  selectedHairdresserId: string
  selectedDate: string

  constructor(
    private loginService: LoginService,
    private pricesService: PricesService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pricesService.getServicesAndPrices().subscribe(arr => {
      this.services = arr.map(s => new ServiceWithPrice(s.id, s.name, s.price))
    })
    this.pricesService.getHairdressers().subscribe(arr => {
      this.hairdressers = arr
    })
    this.pricesService.getReservations().subscribe(arr => {
      this.reservations = arr
    }, err => {
      this.loginService.successfulLogout()
      this.router.navigateByUrl('/prisijungti')
    })
    this.hairdressersDisabled = true
    this.hourDisabled = true
    this.dateDisabled = true
    this.reservationForm = new FormGroup({
      service: new FormControl(undefined, Validators.compose([
        Validators.required,
      ])),
      hairdresser: new FormControl(undefined, Validators.compose([
        Validators.required,
      ])),
      date: new FormControl(undefined, Validators.compose([
        Validators.required,
      ])),
      hour: new FormControl(undefined, Validators.compose([
        Validators.required,
      ])),
    });
    if (!this.loginService.isLoggedIn()) this.router.navigateByUrl('/prisijungti')
  }

  serviceSelected(sId) {
    this.selectedServiceId = sId
    this.hairdressersDisabled = false
    this.hourDisabled = true
    this.hairdressersShown = this.hairdressers.filter(h => h.services.includes(sId))
  }

  hairdresserSelected(hId) {
    this.selectedHairdresserId = hId
    this.hourDisabled = true
    this.dateDisabled = true
    this.pricesService.getAvailableTimes(hId, this.selectedServiceId).subscribe(times => {
      this.availableTimes = times
      this.dateDisabled = false
      this.availableDates = this.unique(this.availableTimes.map(_ => _.date))
    })
  }

  dateSelected(date) {
    this.selectedDate = date
    this.availableHours = this.availableTimes.filter(_ => _.date === date).map(_ => _.hour)
    this.hourDisabled = false
  }

  unique = arr => Array.from(new Set(arr))

  reserve(formData) {
    const time = ({ date: this.selectedDate, hour: formData.hour })
    this.pricesService.reserveTime(
      this.selectedHairdresserId, 
      this.selectedServiceId, 
      time
    ).subscribe(response => {
      const { price, name } = this.services.find(h => h.id === this.selectedServiceId) 
      console.log(response)
      this.reservations.push({
        time,
        price,
        hairdresser: this.hairdressers.find(h => h.id === this.selectedHairdresserId).name,
        service: name,
        client: response.client,
        _id: response._id
      })
      this.availableTimes = this.availableDates = this.availableHours = undefined
      this.dateDisabled = this.hourDisabled = this.hairdressersDisabled = true
      $('#hairdresser-input').val(0)
      $('#hour-input').val(0)
      $('#date-input').val(0)
      $('#service-input').val(0)
      $('#reservation-modal').modal('show');
    })
  }

  deleteReservation(reservationId) {
    this.pricesService.deleteReservation(reservationId).subscribe(_ => {
      this.reservations = this.reservations.filter(x => !(x._id === reservationId))
    }, err => {
      this.loginService.successfulLogout()
      this.router.navigateByUrl('/prisijungti')
    })
  }
}

