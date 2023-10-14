import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { User } from 'src/app/interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/@services/login.service';
import { Producer } from 'src/app/interface';
import { storeInfo } from 'src/app/interface';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  last_id:number=0;
  producer_last_id:number=0;
  userOptions: string[] = ['一般用戶', '藥局'];
  constructor(private fb: FormBuilder,private http: HttpClient, private router: Router,private Loginservice:LoginService) {
    this.registrationForm = this.fb.group({
      username: ['',Validators.required],
      phoneNumber:['',Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmPassword: ['', Validators.required],
      selectedUser:  ['', Validators.required],
    },{ validator: this.passwordMatchValidator });
  }
  ngOnInit(){
    this.http.get<User[]>('http://localhost:3000/profile').subscribe(res=>{
      this.last_id=Number(res[res.length-1].id)
    })
    this.http.get<Producer[]>('http://localhost:3000/manager').subscribe(res=>{
      this.producer_last_id=Number(res[res.length-1].id)
    })
    this.Loginservice.login_status$.subscribe();
    this.Loginservice.user_id$.subscribe();
  }
  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { mismatch: true };
  }
  register(): void {
    
      if (this.registrationForm.valid) {
        if(this.registrationForm.value['selectedUser']=='一般用戶'){
        const phone = this.registrationForm.value['phoneNumber'];
        const name = this.registrationForm.value['username']
        const password = this.registrationForm.value['password'];
        const email = this.registrationForm.value['email'];
        let newUser: User={
          id: String(this.last_id+1),
          phone: phone,
          name: name,
          password: password,
          email: email,
          shop_list: [],
          room_id: [],
          deliver_info: {
            selectedDeliveryArea: "",
            selectedPayMethod: "",
            selectedDeliveryMethod: "",
            memberName: name,
            memberPhone: "",
            selectedInvoiceType:""
          },
          order_list: []
        }
        this.http.post<User>('http://localhost:3000/profile', newUser)
        .subscribe(response => {
          console.log('New user added:', response);
          this.Loginservice.Login(String(this.last_id),'user')
          this.last_id=this.last_id+1;
          this.router.navigate(['/shop/lobby']);
        }, error => {
          console.error('Error adding user:', error);
        });
        }else if (this.registrationForm.value['selectedUser']=='藥局'){
          const name = this.registrationForm.value['username']
          const password = this.registrationForm.value['password'];

          let newStore: Producer={
            name: name,
            password: password,
            id: String(this.producer_last_id+1),
            room_id: [],
            order_list:[]
          }
          let newStoreInfo:storeInfo={
            name: name,
            location: "",
            product_rate: "0",
            respond_rate: "95%",
            id:String(this.producer_last_id+1),
            image: ""
          }
          this.http.post<Producer>('http://localhost:3000/manager', newStore)
          .subscribe(response => {
            console.log('New producer added:', response);
            this.http.post<storeInfo>('http://localhost:3000/store', newStoreInfo).subscribe(()=>{
            this.Loginservice.Login(String(this.producer_last_id),'owner')
            this.last_id=this.last_id+1;
            this.router.navigate(['/orderInfo']);
          })
          }, error => {
            console.error('Error adding user:', error);
          });
        }
        
    }
        // 重置表单
        this.registrationForm.reset();
    }
}


