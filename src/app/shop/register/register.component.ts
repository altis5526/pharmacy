import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { User } from 'src/app/interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/@services/login.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  last_id:number=0;
  constructor(private fb: FormBuilder,private http: HttpClient, private router: Router,private Loginservice:LoginService) {
    this.registrationForm = this.fb.group({
      username: ['',Validators.required],
      phoneNumber:['',Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmPassword: ['', Validators.required],
    },{ validator: this.passwordMatchValidator });
  }
  ngOnInit(){
    this.http.get<User[]>('http://localhost:3000/profile').subscribe(res=>{
      this.last_id=Number(res[res.length-1].id)
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
        };
        this.http.post<User>('http://localhost:3000/profile', newUser)
        .subscribe(response => {
          console.log('New user added:', response);
          this.Loginservice.Login(String(this.last_id),'user')
          this.last_id=this.last_id+1;
          this.router.navigate(['/shop/lobby']);
        }, error => {
          console.error('Error adding user:', error);
        });
    }
        // 重置表单
        this.registrationForm.reset();
    }
}


