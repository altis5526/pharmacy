import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliverStateRoutingModule } from './deliver-state-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DeliverStateRoutingModule,
    HttpClientModule,
  ]
})
export class DeliverStateModule { }
