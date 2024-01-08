import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User} from 'src/app/interface';
import { Observable } from 'rxjs';
import { Store } from 'src/app/models/store.model';

const baseUrl = 'http://localhost:8080/api/pharmacy';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private router:Router,private http: HttpClient ) { }

  private login_status = new BehaviorSubject<boolean>(false);
  private user_id = new BehaviorSubject<string>("");
  private identity= new BehaviorSubject<string>('none');
  private chart_item=new BehaviorSubject<number>(0);

  login_status$ = this.login_status.asObservable();
  user_id$ = this.user_id.asObservable();
  identity$ = this.identity.asObservable();
  chart_item$ = this.chart_item.asObservable();
  

  Login(index:string,user:string) {

    this.login_status.next(true);
    this.user_id.next(String(parseInt(index)+1));
    this.identity.next(user)
    this.updateItem();
  }
  Logout(){
    this.login_status.next(false);
    this.user_id.next('');
    this.identity.next('none')
  }

  getAll(): Observable<Store[]> {
    return this.http.get<Store[]>(baseUrl);
  }

  get(id: any): Observable<Store> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<Store[]> {
    return this.http.get<Store[]>(`${baseUrl}?title=${title}`);
  }
  

  updateItem(){
    let accountData :User;
    this.http.get<User[]>('http://localhost:3000/profile').subscribe(data =>{//品項種類
    accountData=data[parseInt(this.user_id.getValue())-1];
    let uniqueCategories = new Set();
    for (const item of accountData.shop_list) {
      const categoryKey = item.filter((value, index) => [0, 1, 3].includes(index)).join(' ');
      uniqueCategories.add(categoryKey);
    }
    
    this.chart_item.next(uniqueCategories.size);
  })
    
  }
}
