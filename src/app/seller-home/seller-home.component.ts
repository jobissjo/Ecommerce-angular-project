import { Component } from '@angular/core';
import { Product } from '../interface/product';
import { ProductService } from '../services/product.service';
import {faTrash } from '@fortawesome/free-solid-svg-icons';
import {faPenToSquare } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.scss']
})
export class SellerHomeComponent {
  productList : Product[] =[];
  productMsg: undefined| string;
  deleteIcon = faTrash;
  updateIcon = faPenToSquare;
  constructor(private productService:ProductService) {}
  ngOnInit(){
    this.listingProduct()
  }
  delete(id:number){
    console.log(`Id No: ${id}`);
    this.productService.deleteProduct(id).subscribe(result => {
      if(result){
        this.productMsg = "Product is Deleted";
        this.listingProduct()
      }
      setTimeout(()=> this.productMsg=undefined,3000)
      
    })
  }

  listingProduct(){
    this.productService.getProductsBySellerId().subscribe(result=> {
      console.log(result);
      if(result){
        this.productList = result;
      }
    })
    // Old Method
    // this.productService.productList().subscribe(result => {
    //   console.log(result);
    //   if(result){
        
    //   }
    // })
  }
}
