import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/@services/login.service';
import { Producer } from 'src/app/interface';
import { User } from 'src/app/interface';
import { DatePipe } from '@angular/common';
import { storeInfo } from 'src/app/interface';
@Component({
  selector: 'app-deliver-state',
  templateUrl: './deliver-state.component.html',
  styleUrls: ['./deliver-state.component.css']
})
export class DeliverStateComponent implements OnInit{
  constructor(private http: HttpClient,private loginservice: LoginService) {}
  private StoreId: string='';
  manager!:Producer;
  storeInfo!:storeInfo;
  Image:string=''; 
  ngOnInit(): void {
    this.loginservice.user_id$.subscribe(res=> {
      this.StoreId=res;
      if(this.StoreId){
        this.http.get<Producer[]>('http://localhost:3000/manager').subscribe(data =>{
        this.manager=data[parseInt(this.StoreId)-1]
      })
        this.http.get<storeInfo[]>('http://localhost:3000/store').subscribe(data =>{
          this.storeInfo=data[parseInt(this.StoreId)-1]
        })
      }
    })
    
  }
  modifyStatus(i:number,status:string){
    this.manager.order_list[i].status=status;
    let currentTime: Date;
    currentTime = new Date();
    let dateToFormat = new DatePipe('en-US');
    const startTime = String(dateToFormat.transform(String(currentTime), 'MM/dd HH:mm'))

    this.http.get<User[]>('http://localhost:3000/profile').subscribe(data =>{
      let accountData = data[parseInt(this.manager.order_list[i].userId)-1];
      const index = accountData.order_list.findIndex(order => order.orderId === this.manager.order_list[i].orderId);
      if (index !== -1) {
      accountData.order_list[index].status = status;
      if(status == 'confirm'){
        accountData.order_list[index].confirmTime=startTime;
      }else if(status == 'available'){
        accountData.order_list[index].deliverTime=startTime;
      }else if(status == 'arrive'){
        accountData.order_list[index].arriveTime=startTime;
      }
      }
      this.http.put('http://localhost:3000/profile/'+String(this.manager.order_list[i].userId),accountData).subscribe()
    })
    this.manager.order_list[i].status=status;
    this.http.put('http://localhost:3000/manager/'+String(this.StoreId),this.manager).subscribe()
  }
  updateProfile(){
    console.log(this.storeInfo)
    if(this.Image!=''){
      this.storeInfo.image=this.Image;
      this.Image='';
    }
    this.http.put('http://localhost:3000/store/'+this.StoreId,this.storeInfo)
    .subscribe(response => {
      alert('完成資料更新')
      console.log('Profile updated successfully:', response);
    }, error => {
      console.error('Error updating profile:', error);
    });
  }
  handleImageUpload(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let file:any;
    if (inputElement.files && inputElement.files.length > 0) {
      file=inputElement.files[0]
      this.Image=this.getImageUrl(file)
    }
  }
  getImageUrl(image: File): string {
    return URL.createObjectURL(image);
  }
}
