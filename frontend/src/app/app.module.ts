import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { ShopServicesComponent } from './pages/shop-services/shop-services.component';
import { ContactsComponent } from './pages/contacts/contacts.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rezervacija', component: ReservationComponent},
  { path: 'paslaugos', component: ShopServicesComponent},
  { path: 'kontaktai', component: ContactsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ReservationComponent,
    ShopServicesComponent,
    ContactsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
