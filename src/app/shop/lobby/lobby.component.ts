import { Component, OnInit} from '@angular/core';
import { HostListener } from '@angular/core';
import { Product } from 'src/app/interface';
import { HeaderService } from 'src/app/@services/header.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit{
  displayedProducts: Product[] = [];
  remainingProducts: Product[] = [];
  index: number=0;

  menuItems = [[
    { name: '嬰幼兒與家庭'},
    { name: '寵物保健用品'},
    { name: '藥物與保健食品', subcategories: [
      { name: '紓壓好眠' },
      { name: '過敏' },
      { name: '頭痛' },
      { name: '感冒流感' },
      { name: '男性保健' },
      { name: '女性保健' },
      { name: '眼睛、鼻子耳朵保健' },
      { name: '防禦升級' },
      { name: '關節保健' },
      { name: '心血管保健' },
      { name: '腸胃保健' },
      { name: '減脂窈窕' },
      { name: '兒童成長保健' },
      { name: '維他命' },
      { name: '順勢療法與天然產品' },
      { name: '逆齡美肌保健' },
    ]},
    { name: '醫療用品' },
    { name: '藥妝保養' },
    { name: '日常護理' }
  ],[

  ],[

  ],[
    { name: '藥物與保健食品'},
    { name: '紓壓好眠' },
    { name: '過敏' },
    { name: '頭痛' },
    { name: '感冒流感' },
    { name: '男性保健' },
    { name: '女性保健' , subcategories: [
      { name: '月經問題' },
      { name: '親密與身體衛生' },
      { name: '衛生用品' },
      { name: '陰道保健' },
      { name: '停經' },
    ]},
    { name: '眼睛、鼻子耳朵保健', subcategories: [
      { name: '鼻子' },
      { name: '眼睛' },
      { name: '耳朵' },
    ]},
    { name: '防禦升級' },
    { name: '關節保健' },
    { name: '心血管保健' },
    { name: '腸胃保健' },
    { name: '減脂窈窕' },
    { name: '兒童成長保健' },
    { name: '維他命' },
    { name: '順勢療法與天然產品' },
    { name: '逆齡美肌保健' },
  ]
];
  constructor(private headerService: HeaderService) {}
  ngOnInit() {
    this.headerService.displayedProducts$.subscribe(res => {this.displayedProducts=res});
    this.headerService.remainingProducts$.subscribe(res => this.remainingProducts=res);
    this.headerService.selectedItemIndex$.subscribe(res => {
      this.index=res
    });
  }
  @HostListener('window:scroll', ['$event'])
  //-----------------滑動顯示剩餘項目
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
    const remainingCount = Math.min(4, this.remainingProducts.length); // 每次載入10個項目或剩餘項目數量的最小值
    const newProducts = this.remainingProducts.slice(0, remainingCount);

    // 添加到顯示的產品列表中
    this.displayedProducts = [...this.displayedProducts, ...newProducts];
    // 從剩餘的產品列表中刪除已載入的項目
    this.remainingProducts = this.remainingProducts.slice(remainingCount);
  }
}
//-----------------
