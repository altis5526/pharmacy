import { ManagerOrderList } from './../../interface';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producer, User } from 'src/app/interface';
import { Product } from 'src/app/interface';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/@services/login.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OrderList } from 'src/app/interface';
@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit{
  orderForm: FormGroup;
  constructor(private fb: FormBuilder,private http: HttpClient, private router:Router, private loginservice: LoginService){
    this.orderForm = this.fb.group({
      checkout: this.fb.group({
        selectedDeliveryArea: ['', Validators.required],
        selectedPayMethod: ['', Validators.required],
        selectedDeliveryMethod: ['', Validators.required],
      }),
      memberInfo: this.fb.group({
        memberName: ['', Validators.required],
        memberPhone: ['', Validators.required]
      }),
      receiverInfo: this.fb.group({
        receiverName: ['', Validators.required],
        receiverPhone: ['', Validators.required]
      }),
      invoiceInfo: this.fb.group({
        selectedInvoiceType: ['統編'],
        email: ['', [Validators.required, Validators.email]],
        invoiceTaxId: [''],
        invoiceTaxIdHead: [''],
        phoneId: [''],
        natureId: [''],
        selectedDonate: ['財團法人中華民國自閉症基金會']
      }),
      orderNotes: ['']
    });
  }
  orderList!:OrderList;
  managerOrderList!:ManagerOrderList;

  shopList:number[][]=[]
  product:Product[]=[]
  matchedItems: Product[] = [];
  quantity: number[]=[];
  spec: number[]=[]

  login_status:boolean=false;
  userId: number=0;

  showCheckout:boolean=false;

  accountData!: User;
  store!: Producer;

  ngOnInit(){
    this.http.get<Product[]>('http://localhost:3000/product').subscribe(all =>{
      this.product=all;
    })
    this.loginservice.user_id$.subscribe(res =>{
      this.userId=parseInt(res);
    })
    this.http.get<User[]>('http://localhost:3000/profile').subscribe(data =>{
        this.accountData=data[this.userId-1];
        if(this.login_status==true){
          this.getmatchedItems();
        }
        this.orderForm.get('memberInfo.memberName')!.setValue(this.accountData.deliver_info.memberName);
        this.orderForm.get('memberInfo.memberPhone')!.setValue(this.accountData.deliver_info.memberPhone);
        this.orderForm.get('checkout.selectedDeliveryArea')!.setValue(this.accountData.deliver_info.selectedDeliveryArea);
        this.orderForm.get('checkout.selectedPayMethod')!.setValue(this.accountData.deliver_info.selectedPayMethod);
        this.orderForm.get('checkout.selectedDeliveryMethod')!.setValue(this.accountData.deliver_info.selectedDeliveryMethod);
        this.orderForm.get('invoiceInfo.selectedInvoiceType')!.setValue(this.accountData.deliver_info.selectedInvoiceType);
      })
    this.loginservice.login_status$.subscribe(res=>this.login_status=res)  
    this.loginservice.chart_item$.subscribe();
  }
  getmatchedItems(){
    this.matchedItems=[];
    this.quantity=[];
    this.spec=[];
    this.accountData.shop_list.forEach(item => {
      let matchedItem=this.product.find(idinfo =>
        parseInt(idinfo.store_id, 10) === item[0] && parseInt(idinfo.id, 10) === item[1]);
      if(matchedItem){
        this.matchedItems.push(matchedItem)
        this.quantity.push(item[2])
        this.spec.push(item[3])
      }
      });
  }
  getTotalItems(): number {
    return this.matchedItems.reduce((total, item, index) => total + this.quantity[index], 0);
  }
  getTotalPrice(): number {
    return this.matchedItems.reduce((total, item, index) => total + parseInt(item.price[this.spec[index]].value,10) * this.quantity[index], 0);
  }
  private countUniqueFirstElements(arr: number[][]): number[] {
    const uniqueElements: Set<number> = new Set();
  
    arr.forEach(item => {
      uniqueElements.add(item[0]);
    });
  
    return Array.from(uniqueElements);
  }
  private generateUniqueNumber(min: number, max: number): string {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString().padStart(4, '0');
  }
  show(){
    this.showCheckout=true;
  }
  checkout(){
    this.accountData.deliver_info.selectedDeliveryArea=this.orderForm.get('checkout.selectedDeliveryArea')!.value
    this.accountData.deliver_info.selectedPayMethod=this.orderForm.get('checkout.selectedPayMethod')!.value
    this.accountData.deliver_info.selectedDeliveryMethod=this.orderForm.get('checkout.selectedDeliveryMethod')!.value
    this.accountData.deliver_info.memberName=this.orderForm.get('memberInfo.memberName')!.value
    this.accountData.deliver_info.memberPhone=this.orderForm.get('memberInfo.memberPhone')!.value
    this.accountData.deliver_info.selectedInvoiceType=this.orderForm.get('invoiceInfo.selectedInvoiceType')!.value
    let currentTime: Date;
    currentTime = new Date();
    let dateToFormat = new DatePipe('en-US');
    const startTime = String(dateToFormat.transform(String(currentTime), 'MM/dd HH:mm'))

    const grouped = this.countUniqueFirstElements(this.accountData.shop_list);//區分不同店的訂單
    for (const store of grouped) {

      const filteredList=this.accountData.shop_list.filter(item => item[0] === store)//從shopList中區分不同店家的商品
      const originalIndexes: number[] = filteredList.map(item => this.accountData.shop_list.indexOf(item));//店家在原陣列的位置
      const newMatchedItems=originalIndexes.map(index => this.matchedItems[index]);
      const newSpec=originalIndexes.map(index => this.spec[index]);
      const newQuantityc=originalIndexes.map(index => this.quantity[index]);
      const uniqueNumber = this.generateUniqueNumber(1, 9999);

      this.orderList = {
        orderId: uniqueNumber,
        startTime: startTime,
        confirmTime: 'none',
        deliverTime: 'none',
        arriveTime: 'none',
        completeTime: 'none',
        item: filteredList,
        totalAmount: String(newMatchedItems.reduce((total, item, index) => total + parseInt(item.price[newSpec[index]].value,10) * newQuantityc[index], 0)),
        status: 'submit',
        shipMethod: this.orderForm.get('checkout.selectedDeliveryMethod')!.value,
        payMethod: this.orderForm.get('checkout.selectedPayMethod')!.value
      };
    this.accountData.order_list.push(this.orderList)

    this.http.get<Producer[]>('http://localhost:3000/manager').subscribe(data =>{
      this.store=data[store-1];
        this.managerOrderList = {
          userId:this.accountData.id,
          orderId: uniqueNumber,
          item:filteredList,
          startTime:startTime,
          totalAmount: String(newMatchedItems.reduce((total, item, index) => total + parseInt(item.price[newSpec[index]].value,10) * newQuantityc[index], 0)),
          phone: this.accountData.phone,
          shipMethod: this.orderForm.get('checkout.selectedDeliveryMethod')!.value,
          payMethod: this.orderForm.get('checkout.selectedPayMethod')!.value,
          status: 'submit',
        };
        this.store.order_list.push(this.managerOrderList)
        this.http.put('http://localhost:3000/manager/'+String(store),this.store).subscribe()
    })
    }
    console.log(this.accountData.shop_list)
    this.accountData.shop_list=[];
    this.http.put('http://localhost:3000/profile/'+String(this.userId),this.accountData).subscribe()
    alert('已送出訂單')
    this.router.navigate(['/shop/lobby']);
  }
  deleteItem(store_id:string,id:string,index:number){
    if(this.login_status==true){
      this.accountData.shop_list = this.accountData.shop_list.filter((item) => {
        return !(String(item[0])==store_id && String(item[1]) == id && String(item[3])==String(this.spec[index]))
      });
      this.getmatchedItems();
      this.http.put('http://localhost:3000/profile/'+String(this.userId),this.accountData).subscribe(()=>{
        this.loginservice.updateItem();
      })
    };
  }
  decreaseQuantity(index:number){
    if(this.quantity[index]>1){
      this.quantity[index]=this.quantity[index]-1;
    }
    this.accountData.shop_list[index][2]=this.quantity[index];
    this.http.put('http://localhost:3000/profile/'+String(this.userId),this.accountData).subscribe()
  }
  increaseQuantity(index:number){
    this.quantity[index]=this.quantity[index]+1;
    this.accountData.shop_list[index][2]=this.quantity[index];
    this.http.put('http://localhost:3000/profile/'+String(this.userId),this.accountData).subscribe()
  }
 
}
