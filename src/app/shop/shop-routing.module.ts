import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { LobbyComponent } from './lobby/lobby.component';
import { LoginComponent } from './login/login.component';
import { StoreListComponent } from './store-list/store-list.component';
const routes: Routes = [
  {
    path: '', component: ShopComponent,
    children:[
      { path: 'lobby',data :{ preload:false}, component: LobbyComponent},
      { path: 'user',loadChildren: () => import('./user/user.module').then(m=>m.UserModule)},
      { path: 'product/:store_id/:id',loadChildren: () => import('./product/product.module').then(m=>m.ProductModule)}, // 創建產品頁面的路由
      { path: 'login',data :{ preload:false}, component: LoginComponent},
      { path: 'register',loadChildren: () => import('./register/register.module').then(m=>m.RegisterModule)},
      { path: 'chat',loadChildren: () => import('./consultation/consultation.module').then(m=>m.ConsultationModule)},
      { path: 'market', loadChildren: () => import('./market/market.module').then(m => m.MarketModule) },
      { path: 'storelist',data :{ preload:false}, component: StoreListComponent},
      { path: 'store/:store_id',loadChildren: () => import('./store/store.module').then(m=>m.StoreModule)},
      { path: '', redirectTo: 'lobby', pathMatch:'full'},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
