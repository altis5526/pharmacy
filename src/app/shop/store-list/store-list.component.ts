import { Component } from '@angular/core';
import { storeInfo } from 'src/app/interface';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent {
  displayedStores:storeInfo[]=[];
  remainingStores:storeInfo[]=[];
  constructor(private http: HttpClient) {
    this.http.get<storeInfo[]>('http://localhost:3000/store').subscribe(data =>{
      this.displayedStores=data.slice(0,4);
      this.remainingStores=data.slice(4);
    })
  }
  onScroll() {
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    // 檢查是否接近底部
    if (windowHeight + scrollTop >= scrollHeight - 50) {
      // 載入剩餘的項目
      this.loadRemainingProducts();
    }
  }
  // 載入剩餘的項目
  loadRemainingProducts() {
    const remainingCount = Math.min(4, this.remainingStores.length); // 每次載入10個項目或剩餘項目數量的最小值
    const newProducts = this.remainingStores.slice(0, remainingCount);

    // 添加到顯示的產品列表中
    this.displayedStores = [...this.displayedStores, ...newProducts];
    // 從剩餘的產品列表中刪除已載入的項目
    this.remainingStores = this.remainingStores.slice(remainingCount);
  }
}

