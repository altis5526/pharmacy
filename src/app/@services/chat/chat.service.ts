import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io,Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket:Socket;
  private url = 'http://localhost:4000'

  constructor() { 
    this.socket = io(this.url, {transports: ['websocket', 'polling', 'flashsocket']});
  }
  joinRoom(data:any): void{
    this.socket.emit('join',data)
  }
  sendMessage(data:any):void{
    this.socket.emit('message',data)
  }
  getMessage(): Observable<any> {
    return new Observable<{user: string, message: string}>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }
  getStorage(): any[] {
    const storage: string | null = localStorage.getItem('chats');
    return storage ? JSON.parse(storage) as any[] : [];
  }

  setStorage(data: any[]): void {
    localStorage.setItem('chats', JSON.stringify(data));
  }
  
  clearChat(roomId: string): void {
    const storageArray = this.getStorage();
    const storeIndex = storageArray.findIndex((storage: any) => storage.roomId === roomId);
    if (storeIndex > -1) {
      storageArray.splice(storeIndex, 1);
      this.setStorage(storageArray);
    }
  }
}
