import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { DeliverStateComponent } from './manager/deliver-state/deliver-state.component';

const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;
  
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PrescriptionComponent,
    DeliverStateComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule {
}
