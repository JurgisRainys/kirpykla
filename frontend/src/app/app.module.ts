import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { PricesComponent } from './pages/prices/prices.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { FooterComponent } from './footer/footer.component';
import { ReservationsComponent } from './pages/hairdReservations/reservations/reservations.component'

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rezervacija', component: ReservationComponent },
  { path: 'kontaktai', component: ContactComponent },
  { path: 'kainos', component: PricesComponent },
  { path: 'prisijungti', component: LoginComponent },
  { path: 'rezervacijos', component: ReservationsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ReservationComponent,
    PricesComponent,
    ContactComponent,
    LoginComponent,
    FooterComponent,
    ReservationsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
