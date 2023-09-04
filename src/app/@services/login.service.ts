import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private router:Router) { }

  private login_status = new BehaviorSubject<boolean>(false);
  private user_id = new BehaviorSubject<string>("");
  private identity= new BehaviorSubject<string>('none')
  login_status$ = this.login_status.asObservable();
  user_id$ = this.user_id.asObservable();
  identity$ = this.identity.asObservable();

  Login(index:string,user:string) {
    this.login_status.next(true);
    this.user_id.next(String(parseInt(index)+1));
    this.identity.next(user)
  }
  Logout(){
    this.login_status.next(false);
    this.user_id.next('');
    this.identity.next('none')
  }
}
