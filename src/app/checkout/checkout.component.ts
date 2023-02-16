import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { Cart, Order } from '../interface/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit{
  totalPrice:number|undefined;
  cartData:Cart[]| undefined;
  orderMsg:string = '';
  constructor(private productService:ProductService, private router:Router){ }
  ngOnInit(){
    this.productService.currenCart().subscribe(result => {
      let price:number = 0;
      this.cartData = result;
      result.forEach(item => {
        if(item.quantity){
          price += +item.price * item.quantity
        }
      })
      console.log(price);
      this.totalPrice = price + Math.round(price/8) + 50 - price/10;
    })
  }
  orderNow(data:{email:string,address:string,contact:string}){
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if(this.totalPrice){
      let orderData:Order ={
        ...data,
        userId,
        totalPrice:this.totalPrice
      }
      this.cartData?.forEach(item => {
        setTimeout(()=> {
          item.id && this.productService.deleteCartItem(item.id);
        },500)
      })
      this.productService.orderNow(orderData).subscribe(result => {
        if(result){
          this.orderMsg = "Order has been Placed";
          setTimeout(()=> {
            this.orderMsg ='';
            this.router.navigate(['my-orders'])
          }, 4000)
          
          // alert("order placed")
          // console.log(result);
        }
      })
    }
   
  }
}
