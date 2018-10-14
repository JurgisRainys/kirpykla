import { Component, OnInit } from '@angular/core';
import { PricesService } from './prices.service';
import { ServiceWithPrice } from './serviceWithPrice';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {
  servicesWithPrices: ServiceWithPrice[];
  constructor(private pricesService: PricesService) { }

  ngOnInit() {
    this.pricesService
      .getServicesAndPrices()
      .subscribe(arr => {
        this.servicesWithPrices = arr.map(s => new ServiceWithPrice(s.id, s.name, s.price))
        console.log(this.servicesWithPrices)
      })
  }

}
