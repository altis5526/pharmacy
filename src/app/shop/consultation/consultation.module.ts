import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultationRoutingModule } from './consultation-routing.module';
import { ConsultationComponent } from './consultation.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [ConsultationComponent],
  imports: [
    CommonModule,
    ConsultationRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
  ]
})
export class ConsultationModule { }
