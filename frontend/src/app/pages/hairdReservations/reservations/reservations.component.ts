import { Component, OnInit } from '@angular/core';
import { PricesService } from 'src/app/pages/prices/prices.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {
  private reservations
  constructor(private pricesService: PricesService) { }

  ngOnInit() {
    this.pricesService
      .getHairdresserReservations()
      .subscribe(arr => {
        console.log(arr)
        this.reservations = arr
      })
  }

}
