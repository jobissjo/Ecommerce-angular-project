import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart, PriceSummary } from '../interface/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {
  cartData: Cart[] | undefined;
  showRemoveCart!: any;
  Prodcount: number = 0;

  priceSummary: PriceSummary = {
    price: 0,
    tax: 0,
    delivery: 0,
    total: 0,
    discount: 0,
  };
  constructor(private productService: ProductService, private router: Router) {}
  ngOnInit() {
    this.loadDetails();
  }
  loadDetails() {
    localStorage.getItem('user') &&
      this.productService.currenCart().subscribe((result) => {
        this.cartData = result;
        console.log(this.cartData);
        let price = 0;
        result.forEach((item) => {
          if (item.quantity) {
            this.Prodcount = item.quantity;
            price = price + +item.price * +item?.quantity;
          }
        });
        this.priceSummary.price = price;
        this.priceSummary.discount = price / 10;
        this.priceSummary.delivery = 50;
        this.priceSummary.tax = Math.round(price / 8);
        this.priceSummary.total =
          price +
          this.priceSummary.tax +
          this.priceSummary.delivery -
          this.priceSummary.discount;
        console.log(this.priceSummary);
      });
  }
  checkout() {
    this.router.navigate(['/checkout']);
  }
  removeFromCart(cartId: number | undefined) {
    cartId &&
      this.productService.removeToCart(cartId).subscribe((res) => {
        this.loadDetails();
        this.productService.currenCart();
        this.productService.loginUpdateCartIdtoLocal();
        this.productService.updateLocalCartId(cartId);
      });
  }
  handleQuantity(calc: string, id: any) {
    this.cartData?.map((data) => {
      if (data.id == id && data.quantity) {
        if (calc == 'min' && data.quantity > 1) {
          data.quantity = --data.quantity;
        } else if (calc == 'plus' && data.quantity < 10) {
          data.quantity = ++data.quantity;
        }
        this.productService.handleQuantity(id, data).subscribe((data) => {
          this.loadDetails();
        });
      }
    });
  }
}
