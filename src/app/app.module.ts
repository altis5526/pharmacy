import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { DeliverStateComponent } from './manager/deliver-state/deliver-state.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PharmacyListComponent } from './test_component/pharmacy-list/pharmacy-list.component';
import { PharmacyDetailsComponent } from './test_component/pharmacy-details/pharmacy-details.component';
import { AddPharmacyComponent } from './test_component/add-pharmacy/add-pharmacy.component';


const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;
  
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PrescriptionComponent,
    DeliverStateComponent,
    AddPharmacyComponent,
    PharmacyDetailsComponent,
    PharmacyListComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule {
}
