import { Router } from '@angular/router';
import { Component,Inject} from '@angular/core';
import { LoginService } from 'src/app/@services/login.service';
import { User, storeInfo } from 'src/app/interface';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  login_status:boolean=false;
  public accountData!: User|storeInfo;

  constructor(private loginservice:LoginService,private http: HttpClient, private router:Router,@Inject(DOCUMENT) private _document: Document){}

  ngOnInit(){
    this.loginservice.login_status$.subscribe(res=>{
      this.login_status=res;
    })
    this.loginservice.user_id$.subscribe(res =>{
      this.loginservice.identity$.subscribe(identity =>{
        if(identity == 'user'){
          this.http.get<User[]>('http://localhost:3000/profile').subscribe(data =>{
          this.accountData = data[parseInt(res)-1];
          })
        }else if(identity == 'owner'){
          this.http.get<storeInfo[]>('http://localhost:3000/store').subscribe(data =>{
          this.accountData = data[parseInt(res)-1];
          })
        }
    });
  })
  }
  logout(){
    alert('您已登出');
    this.loginservice.Logout();
    this.router.navigate(['/shop/lobby']);
    this._document.location.reload();
}
  alert(){
    alert("請先登入")
  }
  
}
