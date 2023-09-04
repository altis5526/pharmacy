import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopComponent } from './shop.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LobbyComponent } from './lobby/lobby.component';
import { LoginComponent } from './login/login.component';

import { ShopRoutingModule } from './shop-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderService } from '../@services/header.service';

import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login/socialauth.service';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { StoreComponent } from './store/store.component';
@NgModule({
  declarations: [
    ShopComponent,
    HeaderComponent,
    FooterComponent,
    LobbyComponent,
    LoginComponent,
    StoreComponent
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SocialLoginModule,
    GoogleSigninButtonModule
  ],
  providers:[
    HeaderService,
    {
      provide:'SocialAuthServiceConfig',
      useValue:{
        autoLogin: false,
        providers:[
          {
            id:GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('221257252087-8a7pd1tf4d4poaskaiv0nmvtovpmmlt5.apps.googleusercontent.com')
          }
        ],
        onError: (err) => {
          console.error(err)
        }
      } as SocialAuthServiceConfig,
    }
  ]
})
export class ShopModule { }
