import { RouterModule,Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { PrescriptionComponent } from './prescription/prescription.component';
const routes: Routes = [
  { path: 'menu',data: { preload: false }, component: MenuComponent},
  { path: 'shop',loadChildren: () => import('./shop/shop.module').then(m=>m.ShopModule)},
  { path: 'prescription',data: { preload: false }, component: PrescriptionComponent},
  { path: 'productUpload',loadChildren: () => import('./manager/product-edit/product-edit.module').then(m=>m.ProductEditModule)},
  { path: 'orderInfo', loadChildren: () => import("./manager/deliver-state/deliver-state.module").then(m=>m.DeliverStateModule)},
  { path: '', redirectTo: 'menu', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
