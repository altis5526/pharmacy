import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { User } from 'src/app/interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  last_id:number=0;
  constructor(private fb: FormBuilder,private http: HttpClient, private router: Router) {
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
  }
  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { mismatch: true };
  }
  register(): void {
    let newUser!: User;
      if (this.registrationForm.valid) {
        const phone = this.registrationForm.value['phoneNumber'];
        const name = this.registrationForm.value['username']
        const password = this.registrationForm.value['password'];
        const email = this.registrationForm.value['email'];
        newUser.id=String(this.last_id+1);
        newUser.phone=phone;
        newUser.password=password;
        newUser.email=email;
        newUser.name=name;
        this.http.post<User>('http://localhost:3000/profile', newUser)
        .subscribe(response => {
          console.log('New user added:', response);
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


