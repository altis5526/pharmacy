import { Injectable } from '@angular/core';
import { BehaviorSubject  } from 'rxjs';
import { Product } from 'src/app/interface';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class HeaderService {
  private product:Product[]=[];

  constructor(private http: HttpClient) {
    this.initializeProducts();
   }
  displayedProductsSubject = new BehaviorSubject <Product[]>([]) ;
  remainingProductsSubject = new BehaviorSubject <Product[]>([]) ;
  selectedItemIndex = new BehaviorSubject<number>(0);

  displayedProducts$ = this.displayedProductsSubject.asObservable();
  remainingProducts$ = this.remainingProductsSubject.asObservable();
  selectedItemIndex$ = this.selectedItemIndex.asObservable();

  private initializeProducts() {
    this.http.get<Product[]>('http://localhost:3000/product').subscribe(data =>{
      this.product = data;
      this.displayedProductsSubject.next(this.product.slice(0, 4)); 
      this.remainingProductsSubject.next(this.product.slice(4));
    })
    // 根據 productId 加載產品資料，執行相應的操作
  }
  updateDisplayedProducts(products: Product[]):void {
  this.displayedProductsSubject.next(products); 
}
  updateremainingProducts(products: Product[]):void {
    this.remainingProductsSubject.next(products);
}
  setSelectedItemIndex(index: number) {
    this.selectedItemIndex.next(index);
  }
}