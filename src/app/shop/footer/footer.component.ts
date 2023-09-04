import { Router } from '@angular/router';
import { Component} from '@angular/core';
import { LoginService } from 'src/app/@services/login.service';
import { User } from 'src/app/interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  login_status:boolean=false;
  public accountData!: User;

  constructor(private loginservice:LoginService,private http: HttpClient, private router:Router){}

  ngOnInit(){
    this.loginservice.login_status$.subscribe(res=>{
      this.login_status=res;
    })
    this.loginservice.user_id$.subscribe(res =>{
      this.http.get<User[]>('http://localhost:3000/profile').subscribe(data =>{
      this.accountData = data[parseInt(res)-1];
    });
  })
  }
  logout(){
    alert('您已登出');
    this.loginservice.Logout();
    this.router.navigate(['/shop/lobby']);
}
  alert(){
    alert("請先登入")
  }
  
}
