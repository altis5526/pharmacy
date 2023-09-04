import { Component, OnInit} from '@angular/core';
import { HostListener } from '@angular/core';
import { Product } from 'src/app/interface';
import { HeaderService } from 'src/app/@services/header.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { storeInfo } from 'src/app/interface';
import { LoginService } from 'src/app/@services/login.service';
import { User } from 'src/app/interface';
import { Producer } from 'src/app/interface';
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  products: Product[] = [];
  displayedProducts: Product[] = [];
  remainingProducts: Product[] = [];
  filteredProducts: Product[] = [];
  storeId: any = '';
  storeInfo!: storeInfo;

  login_status: boolean=false;
  userId: string=''; 
  accountData!: User;
  managerInfo: Producer | null = null;
  constructor(private headerService: HeaderService,private http: HttpClient,private route: ActivatedRoute,private loginService:LoginService,private router:Router) {
    this.storeId = this.route.snapshot.paramMap.get('store_id');
  }
  ngOnInit() {
    this.http.get<Product[]>('http://localhost:3000/product').subscribe(data =>{
      this.products = data.filter(item => item.store_id === String(this.storeId));
      this.filteredProducts = this.products; // 設置初始值為 products // 剩下的產品
      this.displayedProducts = this.filteredProducts.slice(0, 4);
      this.remainingProducts = this.filteredProducts.slice(4);
    })
    this.http.get<storeInfo[]>('http://localhost:3000/store').subscribe(data =>{
      this.storeInfo=data[this.storeId-1]
    })
    this.http.get<Producer[]>('http://localhost:3000/manager').subscribe(data =>{
      this.managerInfo = data[this.storeId-1]
    })
    this.loginService.user_id$.subscribe(res =>{
      this.userId=res
      this.http.get<User[]>('http://localhost:3000/profile').subscribe(data =>{
      this.accountData = data[parseInt(this.userId)-1];
    })
    });
    this.headerService.displayedProducts$.subscribe();
    this.headerService.remainingProducts$.subscribe();
    this.loginService.login_status$.subscribe(res => this.login_status=res)
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(){
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    console.log('onScroll')
    // 檢查是否接近底部
    if (windowHeight + scrollTop >= scrollHeight - 50) {
      // 載入剩餘的項目
      this.loadRemainingProducts();
    }
  }
  loadRemainingProducts() {
    const remainingCount = Math.min(4, this.remainingProducts.length); // 每次載入10個項目或剩餘項目數量的最小值
    const newProducts = this.remainingProducts.slice(0, remainingCount);

    // 添加到顯示的產品列表中
    this.displayedProducts = [...this.displayedProducts, ...newProducts];
    // 從剩餘的產品列表中刪除已載入的項目
    this.remainingProducts = this.remainingProducts.slice(remainingCount);
  }
  chat(){
    if(this.login_status == true){
      //將room分別新增在user以及manager裡
      const existingIndex = this.accountData.room_id.findIndex(item => {
        return Object.keys(item)[0] === this.storeId;
      });
      if (existingIndex === -1) {
        // 資料不存在，將資料加入 this.managerInfo.room_id
        this.managerInfo!.room_id.unshift({ [this.userId]: this.storeId+'-room-'+this.userId });
        this.http.put('http://localhost:3000/manager/'+this.storeId,this.managerInfo).subscribe()

        this.accountData.room_id.unshift({ [this.storeId]: this.storeId+'-room-'+this.userId })
        this.http.put('http://localhost:3000/profile/'+this.userId,this.accountData).subscribe()
      }
      else{
        //更改訊息順序
        const selectedItem = this.accountData.room_id.splice(existingIndex, 1)[0];
        this.accountData.room_id.unshift(selectedItem);
        this.http.put('http://localhost:3000/profile/'+this.userId,this.accountData).subscribe()
      }
      this.router.navigate(['/shop/chat']);
    }
  }
}
