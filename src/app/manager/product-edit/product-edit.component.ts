import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Product } from 'src/app/interface';
import { LoginService } from 'src/app/@services/login.service';
interface Spec{
  name: string;
  value: string;
}
interface Price{
  spec: string;
  value: string;
}
@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})

export class ProductEditComponent {
  Spec: Spec[] = [{ name: '', value: '' }];
  Price: Price[] = [{ spec: '', value: '' }];
  Ad:string[][]=[];
  ProductName:string='';
  Description:string='';
  Image:string=''; 
  private LastId: number=0;
  private StoreId: string='';
  constructor(private http: HttpClient,private loginservice: LoginService) {}
  ngOnInit(){
    this.http.get<Product[]>('http://localhost:3000/product').subscribe(data =>{
      this.LastId=Number(data[data.length-1].id)
    })
    this.loginservice.user_id$.subscribe(res=> {
      this.StoreId=res;
    })
  }
  addSpec() {
    this.Spec.push({ name: '', value: '' });
  }
  addPrice(){
    this.Price.push({ spec: '', value: '' });
  }
  handleImageUpload(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let file:any;
    if (inputElement.files && inputElement.files.length > 0) {
      file=inputElement.files[0]
      this.Image=this.getImageUrl(file)
    }
  }
  handleAdUpload(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let file:any
    if (inputElement.files && inputElement.files.length > 0){
      for(let i = 0; i < inputElement.files.length; i++ ){
        file=inputElement.files[i]
        this.Ad.push([this.getImageUrl(file)])
      }
    }
  }
  getImageUrl(image: File): string {
    return URL.createObjectURL(image);
  }
  submit(){
    let newProduct: Product={
      name:this.ProductName,
      description:this.Description,
      id:String(this.LastId+1),
      image:this.Image,
      price:this.Price,
      store_id:this.StoreId,
      ad:this.Ad,
      Spec:this.Spec,
      Comment: []
    };
    this.http.post<Product>('http://localhost:3000/product', newProduct)
        .subscribe(response => {
          console.log('New product added:', response);
          this.LastId=this.LastId+1;
        }, error => {
          console.error('Error adding user:', error);
    });
    //把商品資料新增至db
  }
}
