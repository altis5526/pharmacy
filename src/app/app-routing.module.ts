import { RouterModule,Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { PharmacyListComponent } from './test_component/pharmacy-list/pharmacy-list.component';
import { PharmacyDetailsComponent } from './test_component/pharmacy-details/pharmacy-details.component';
import { AddPharmacyComponent } from './test_component/add-pharmacy/add-pharmacy.component';

const routes: Routes = [
  { path: 'menu',data: { preload: false }, component: MenuComponent},
  { path: 'shop',loadChildren: () => import('./shop/shop.module').then(m=>m.ShopModule)},
  { path: 'prescription',data: { preload: false }, component: PrescriptionComponent},
  { path: 'productUpload',loadChildren: () => import('./manager/product-edit/product-edit.module').then(m=>m.ProductEditModule)},
  { path: 'orderInfo', loadChildren: () => import("./manager/deliver-state/deliver-state.module").then(m=>m.DeliverStateModule)},
  { path: '', redirectTo: 'menu', pathMatch:'full'},
  { path: 'pharmacy', component: PharmacyListComponent },
  { path: 'pharmacy/:id', component: PharmacyDetailsComponent },
  { path: 'add', component: AddPharmacyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
