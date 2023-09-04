import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { Component, OnInit} from '@angular/core';

import { ChatService } from '../../@services/chat/chat.service';
import { LoginService } from 'src/app/@services/login.service';
import { User } from 'src/app/interface';
import { Producer } from 'src/app/interface';
import { RoomMapping } from 'src/app/interface';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css'],
})

export class ConsultationComponent implements OnInit{
  
  public login_status:boolean=false;
  public identity:string='';
  public userId:string='';

  public roomId: string='';
  public messageText:string='';
  public messageArray: {user: string,message: string}[]=[];
  private storageArray:any = [];

  public showScreen = false;
  public phone:string='';
  public currentUser!:Producer | User;


  public selectedUser:any;
  public userList:Array<Producer | User> = [];

  constructor(private loginservice:LoginService, private chatServices:ChatService,private http:HttpClient,private router:Router) {
    this.chatServices.getMessage().subscribe(data => this.messageArray.push(data))
  }
  ngOnInit(){
    this.chatServices.getMessage()
    .subscribe(({ user, room, message }) => {
      if (this.roomId) {
        setTimeout(() => {
          this.storageArray = this.chatServices.getStorage();
          const storeIndex = this.storageArray
            .findIndex((storage: any) => storage.roomId === this.roomId);//找目前的聊天室
  
          if (storeIndex > -1) {
            this.messageArray = this.storageArray[storeIndex].chats;
          } else {
            this.messageArray = [];
          }
        }, 700);
      }
    });
    this.loginservice.login_status$.subscribe(res=>{
      this.login_status=res;
    })
    this.loginservice.identity$.subscribe(res=>{
      this.identity=res;
    })
    this.loginservice.user_id$.subscribe(res=>{
      this.userId=res;
      this.loadData(); // 加載數據
    })
  }
  loadData(): void {
    if (this.login_status === false) {
      this.router.navigate(['/shop/login']);
    } else {
      if (this.identity === 'user') {
        this.http.get<User[]>('http://localhost:3000/profile').subscribe(data => {
          this.currentUser = data[parseInt(this.userId)-1];
  
          this.http.get<Producer[]>('http://localhost:3000/manager').subscribe(data => {
            this.userList = this.currentUser.room_id.map(room => {
              const roomId = Object.keys(room)[0];
              const store = data.find(store => store.id === roomId);
              return store!;
            });
            if (this.userList.length > 0) {
              this.selectUserHandler(this.userList[0].id);
            }
          });
          if (this.currentUser) {
            this.showScreen = true;
          }
        });
      } else if (this.identity === 'owner') {
        this.http.get<Producer[]>('http://localhost:3000/manager').subscribe(data => {
          this.currentUser = data[parseInt(this.userId)-1];
          this.http.get<User[]>('http://localhost:3000/profile').subscribe(data => {
            this.userList = this.currentUser.room_id.map(room => {
              const roomId = Object.keys(room)[0];
              const store = data.find(store => store.id === roomId);
              return store!;
            });
          });
          if (this.currentUser) {
            this.showScreen = true;
          }
        });
      }

    }
  }

  // openPopup(content: any): void {
  //   this.modalService.open(content, {backdrop: false, centered:true});
  // }

  // login(dismiss: any): void {
  //   this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
  //   //userList改成從profile出來
  //   this.userList = this.userList.filter((user) => user.phone !== this.phone.toString());

  //   if (this.currentUser) {
  //     this.showScreen = true;
  //     dismiss();
  //   }
  // }

  selectUserHandler(id: string): void {
    //選擇廠商id
    this.selectedUser = this.userList.find(user => user.id === id);
    this.roomId = this.selectedUser.room_id.find((mapping: RoomMapping) => mapping.hasOwnProperty(this.currentUser.id))?.[this.currentUser.id] || null;
    this.messageArray = [];
  
    this.storageArray = this.chatServices.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage:any) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId:string):void {
    this.chatServices.joinRoom( {user: username, room:roomId})
  }

  sendMessage(): void {
    this.chatServices.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText
    });
  
    this.storageArray = this.chatServices.getStorage();
    const storeIndex = this.storageArray.findIndex((storage: any) => storage.roomId === this.roomId);
  
    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      });
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };
  
      this.storageArray.push(updateStorage);
    }
  
    this.chatServices.setStorage(this.storageArray);
    this.messageText = '';  
    //更新selectedUser訊息順序
    const selectedIndex = this.selectedUser.room_id.findIndex((item: RoomMapping) => Object.keys(item)[0] === this.currentUser.id);
    if (selectedIndex > -1) {
      const selectedItem = this.selectedUser.room_id.splice(selectedIndex, 1)[0];
      this.selectedUser.room_id.unshift(selectedItem);
    }
    
    if(this.identity == 'user'){
      this.http.put('http://localhost:3000/manager/'+this.selectedUser.id,this.selectedUser).subscribe()
    }
    else if(this.identity == 'owner'){
      this.http.put('http://localhost:3000/profile/'+this.selectedUser.id,this.selectedUser).subscribe()
    }
  }
  clearChatHistory(): void {
    if (this.roomId) {
      this.chatServices.clearChat(this.roomId);
      this.messageArray = [];
    }
  }
  
}
