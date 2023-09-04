import { Producer } from './../../interface';
import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/interface';
import { storeInfo } from 'src/app/interface';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/@services/login.service';
import { User } from 'src/app/interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  productId: any = '';
  storeId: any = '';

  currentContent: string = 'productFeature';

  login_status: boolean=false;
  userId: string=''; 

  quantity: number = 1;

  selectedSpec: string='';
  public product: Product=
  {
    name: '',
    description: '',
    id: '',
    image: '',
    price: [],
    store_id:'',
    ad:[],
    Spec:[],
    Comment:[],
  };
  public storeInfo: storeInfo =
  {
    name: '',
    location: '',
    product_rate: '',
    respond_rate: '',
    id: '',
    image: ''
  };
  public accountData!: User;
  public managerInfo: Producer | null = null;
  constructor(private route: ActivatedRoute,private http: HttpClient, private loginService:LoginService, private router:Router) {}

  ngOnInit() {
    //確認點擊的產品以及店家資訊
    this.productId = this.route.snapshot.paramMap.get('id');
    this.storeId = this.route.snapshot.paramMap.get('store_id');

    this.http.get<Product[]>('http://localhost:3000/product').subscribe(data =>{
      this.product = data[this.productId-1]
    })
    this.http.get<storeInfo[]>('http://localhost:3000/store').subscribe(data =>{
      this.storeInfo = data[this.storeId-1]
    })
    this.http.get<Producer[]>('http://localhost:3000/manager').subscribe(data =>{
      this.managerInfo = data[this.storeId-1]
    })
    // 根據 productId 加載產品資料，執行相應的操作
    this.loginService.user_id$.subscribe(res =>{
      this.userId=res
      this.http.get<User[]>('http://localhost:3000/profile').subscribe(data =>{
      this.accountData = data[parseInt(this.userId)-1];
    })
    });
    this.loginService.login_status$.subscribe(res => this.login_status=res)
  }
  addToCart(store_id:string,item_id:string,quantity:number) {
    if(this.login_status==true){
      this.http.get<User[]>('http://localhost:3000/profile').subscribe(data =>{
      this.accountData=data[parseInt(this.userId)-1];

      let sameOrder=this.accountData.shop_list.findIndex(idinfo =>
        String(idinfo[0]) === store_id && String(idinfo[1]) === item_id && String(idinfo[3]) === this.selectedSpec);

      if(sameOrder != -1){
        this.accountData.shop_list[sameOrder][2]=this.accountData.shop_list[sameOrder][2]+quantity
      }
      else{
        this.accountData.shop_list.push([parseInt(store_id),parseInt(item_id),quantity,parseInt(this.selectedSpec,10)]);
      }
      this.http.put('http://localhost:3000/profile/'+this.userId,this.accountData).subscribe()
      })
      this.quantity=1;
    }
  }
  showContent(contentId: string) {
    this.currentContent=contentId
    console.log(this.product.Comment)
  }
  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
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
    }else{
      alert('請先登入')
      this.router.navigate(['/shop/login']);
    }
  }
}
