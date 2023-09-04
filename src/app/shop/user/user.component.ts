import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interface';
import { LoginService } from 'src/app/@services/login.service';
import { Product } from 'src/app/interface';
import { DatePipe } from '@angular/common';
import { Producer } from 'src/app/interface';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  accountData!: User;
  matchedProduct:Product[]=[];
  userId: string='';
  currentProgress:boolean=true;
  messageContent:string='';
  manager!:Producer;
  isSubmit:boolean=false;
  constructor(private http: HttpClient, private loginservice: LoginService, private router:Router) { }
  ngOnInit(){
    this.loginservice.user_id$.subscribe(res =>{
      this.userId=res;
      this.http.get<User[]>('http://localhost:3000/profile').subscribe(data =>{
      this.accountData = data[parseInt(this.userId)-1];
      })
    })
    this.http.get<Product[]>('http://localhost:3000/product').subscribe(all =>{
      for(const order of this.accountData.order_list){
        let matchedItem=all.find(idinfo =>
          parseInt(idinfo.store_id, 10) === order.item[0][0] && parseInt(idinfo.id, 10) === order.item[0][1]);
          this.matchedProduct.push(matchedItem!
        )
      }
    })
  }
  updateProfile() {
    // Send an HTTP request to update the member's profile data
    this.http.put('http://localhost:3000/profile/'+this.userId,this.accountData)
      .subscribe(response => {
        console.log('Profile updated successfully:', response);
      }, error => {
        console.error('Error updating profile:', error);
      });
  }
  submit(index:number){
    const commentData = { name: this.accountData.name , value: this.messageContent};
    this.matchedProduct[index].Comment.push(commentData)
    console.log(this.matchedProduct[index])
    this.http.put('http://localhost:3000/product/'+this.matchedProduct[index].id,this.matchedProduct[index]).subscribe()
    this.messageContent='';
    this.isSubmit=true;
  }
  complete(i:number){//兩邊status都更新成complete
    this.http.get<Producer[]>('http://localhost:3000/manager').subscribe(data =>{
        this.manager=data[parseInt(this.matchedProduct[i].store_id)-1]
        for (const order of this.manager.order_list) {//修改managerStatus
          if (order.orderId === this.accountData.order_list[i].orderId) {
            order.status = "complete";
            break;
          }
        }
        this.http.put('http://localhost:3000/manager/'+String(this.matchedProduct[i].store_id),this.manager).subscribe()
    })
    let currentTime: Date;
    currentTime = new Date();
    let dateToFormat = new DatePipe('en-US');
    const startTime = String(dateToFormat.transform(String(currentTime), 'MM/dd HH:mm'))

    this.accountData.order_list[i].status='complete';
    this.accountData.order_list[i].completeTime=startTime;

    this.http.put('http://localhost:3000/profile/'+String(this.accountData.id),this.accountData).subscribe()
  }
}
