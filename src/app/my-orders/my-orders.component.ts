import { Component } from '@angular/core';
import { Order } from '../interface/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent {
  orderData:Order[] = [];
  constructor(private productService:ProductService){ }
  ngOnInit(){
    this.getOrderList();
  }
  cancelOrder(orderId:number|undefined){
    orderId && this.productService.cancelOrder(orderId).subscribe(result=> {
      if(result){
        this.getOrderList()
      }
    })
  }
  getOrderList(){
    this.productService.orderList().subscribe(result=> {
      this.orderData = result;
    })
  }
}
