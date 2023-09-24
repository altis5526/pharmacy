import { Component } from '@angular/core';
import { FormControl,FormGroup, Validators} from '@angular/forms';
import { Router} from '@angular/router';
import { User, Producer} from 'src/app/interface';
import { HttpClient} from '@angular/common/http';

import { LoginService } from 'src/app/@services/login.service';
import { SocialAuthService,GoogleLoginProvider } from '@abacritt/angularx-social-login';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public user:any;
  last_id:number=0;
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    selectedUser:  new FormControl(''),
  })

  userOptions: string[] = ['一般用戶', '藥局'];
  accountData: User[]=[];
  storeData: Producer[]=[];

  constructor(private router: Router,private http: HttpClient,private Loginservice:LoginService,private authService: SocialAuthService) {}

  ngOnInit(){
    this.http.get<User[]>('http://localhost:3000/profile').subscribe(data =>{
      this.accountData = data;
      this.last_id=Number(data[data.length-1].id)
    })
    this.http.get<Producer[]>('http://localhost:3000/manager').subscribe(data =>{
      this.storeData = data;
    })
    this.authService.authState.subscribe(user=> {
      this.user=user;
      if(this.user!=null){
        this.signIn();
      }
    })
    this.Loginservice.login_status$.subscribe();
    this.Loginservice.user_id$.subscribe();
  }
  login(){
    let matchedAccount;
    let matchedAccountIndex;
    let identity: string='none';
    const selectedUser = this.loginForm.value.selectedUser;
    if (this.loginForm.valid && selectedUser!='') {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      // 尋找對應資料
      if(selectedUser=='藥局'){
        matchedAccount = this.storeData.find(account =>
        account.name === username && account.password === password);
        if(matchedAccount){
          matchedAccountIndex = this.storeData.indexOf(matchedAccount);
          identity='owner';
          this.router.navigate(['/orderInfo']);
        }
      }else if (selectedUser=='一般用戶'){
        matchedAccount = this.accountData.find(account =>
        account.phone === username && account.password === password);
        if(matchedAccount){
          matchedAccountIndex = this.accountData.indexOf(matchedAccount);
          identity='user';
          this.router.navigate(['/shop/lobby']);
        }
      }
      if (matchedAccount) {
          this.Loginservice.Login(String(matchedAccountIndex),identity)
          alert('登入成功！');
      } else {
        alert('使用者名稱或密碼錯誤！');
      }
    } 
    else if(selectedUser ==''){
      alert('請先選擇身分！');
    }
    else {
      alert('请输入有效的用户名和密码！');
    }
  }
  signIn(): void {
    let matchedAccount;
    let matchedAccountIndex;
    let identity: string='user';

    matchedAccount = this.accountData.find(account =>
      account.name === this.user.name && account.email === this.user.email);
    if(matchedAccount){
      matchedAccountIndex = this.accountData.indexOf(matchedAccount);
      this.router.navigate(['/shop/lobby']);
        this.Loginservice.Login(String(matchedAccountIndex),identity)
        alert('登入成功！');
    }else{
      //尚未註冊(加入db)
      let newUser: User={
        id: String(this.last_id+1),
        phone: "",
        name: this.user.name,
        password: "",
        email: this.user.email,
        shop_list: [],
        room_id: [],
        deliver_info: {
          selectedDeliveryArea: "",
          selectedPayMethod: "",
          selectedDeliveryMethod: "",
          memberName: this.user.name,
          memberPhone: "",
          selectedInvoiceType:""
        },
        order_list: []
      }

      this.http.post<User>('http://localhost:3000/profile', newUser)
        .subscribe(response => {
          console.log('New user added:', response);
          this.Loginservice.Login(String(this.last_id),identity)
          this.last_id=this.last_id+1;
          this.router.navigate(['/shop/lobby']);
        }, error => {
          console.error('Error adding user:', error);
        });
    }
  }
  refreshToken(): void{
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID)
  }
}
