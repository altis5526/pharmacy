import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductEditRoutingModule } from './product-edit-routing.module';
import { ProductEditComponent } from './product-edit.component';
@NgModule({
  declarations: [ProductEditComponent],
  imports: [
    CommonModule,
    ProductEditRoutingModule,
    FormsModule,
    HttpClientModule
  ]
})
export class ProductEditModule { }
