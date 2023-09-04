import { Component } from '@angular/core';
import { Product } from 'src/app/interface';
import { HeaderService } from 'src/app/@services/header.service';
import { HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  searchTerm: string = '';
  public products: Product[] = [];
  public displayedProducts: Product[] = []; // 顯示的產品列表
  public remainingProducts: Product[] = []; // 剩餘的產品列表
  public filteredProducts: Product[] = [];


  showDropdown = false;
  constructor(private headerService: HeaderService,private http: HttpClient) {}
  ngOnInit() {
    //產品列表
    this.http.get<Product[]>('http://localhost:3000/product').subscribe(data =>{
      this.products = data;
      this.filteredProducts = this.products; // 設置初始值為 products // 剩下的產品
    })
    this.headerService.displayedProducts$.subscribe(res => this.displayedProducts=res);
    //this.headerService.updateDisplayedProducts(this.displayedProducts);
    this.headerService.remainingProducts$.subscribe(res => this.remainingProducts=res);
    //this.headerService.updateremainingProducts(this.remainingProducts);
    this.headerService.selectedItemIndex$.subscribe();
  }
  search():void {
    if (this.searchTerm.trim() === '') {
      this.filteredProducts = this.products;
    }
    else{
      this.filteredProducts = this.products.filter(product =>
        Array.from(this.searchTerm.toLowerCase()).every(char =>
          product.name.toLowerCase().includes(char)
        )
      );
    }
    this.displayedProducts = this.filteredProducts.slice(0, 4);
    this.remainingProducts = this.filteredProducts.slice(4);
    this.headerService.updateDisplayedProducts(this.displayedProducts);
    this.headerService.updateremainingProducts(this.remainingProducts);
  }
  //-----------------搜尋產品(點擊)
  searchByCategory(category: string): void {
    this.searchTerm = category;
    this.filteredProducts = this.products.filter(product =>
      Array.from(this.searchTerm.toLowerCase()).every(char =>
        product.name.toLowerCase().includes(char)
      ))
      this.displayedProducts = this.filteredProducts.slice(0, 4);
      this.remainingProducts = this.filteredProducts.slice(4);
      this.headerService.updateDisplayedProducts(this.displayedProducts);
      this.headerService.updateremainingProducts(this.remainingProducts);
  }
  setMenuItemIndex(index: number): void{
    this.headerService.setSelectedItemIndex(index)
  }

}
