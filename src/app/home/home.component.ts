import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { pipe } from 'rxjs';
import { Cart, Product } from '../interface/product';
import { SignUp } from '../interface/signup';
import { NgbdModalContent } from '../modal.component';
import { OtherService } from '../services/other.service';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // addedCart!:boolean;
  itemInLocalCartProductId : number[] =[];
  currentUser: SignUp | undefined;
  popularProducts!: Product[];
  trendyProducts!: Product[];
  ids = localStorage.getItem('cartId') ? localStorage.getItem('cartId') : localStorage.setItem('cartId', JSON.stringify([]));
  itemIds: number[] = this.ids ? JSON.parse(this.ids) : [];
  constructor(
    private productService: ProductService,
    private otherService: OtherService,
    private userService: UserService,
    private router:Router,
    private modalService:NgbModal
  ) {}
  ngOnInit() {
    
    this.itemInLocalCartProductId = this.getLocalCart();
    this.productService.getCurrentCartIds();
    this.productService.localCartIds$.subscribe((result) => {
      this.itemIds = result;
    });
    this.currentUser = this.userService.getCurrentUser();
    this.productService.popularProducts().subscribe((data) => {
      this.popularProducts = data;
      this.otherService.collection$.next(true);
    });

    this.productService.trendyProducts().subscribe((data) => {
      this.trendyProducts = data;
    });
    // console.log(((this.itemInLocalCartProductId?.includes(1)) && (!this.currentUser )));
  }
  getLocalCart(){
    let locaCart = localStorage.getItem('localCart');
    let cart = locaCart && JSON.parse(locaCart);
    let newVals:number[] = []
    let hello = cart?.slice(0).forEach((element:any) => {
      newVals.push(element.id)
    });
    return newVals
  }
  addCart(product: Product) {
    // this.addedCart = true;
    if (!this.currentUser) {
      const modalRef = this.modalService.open(NgbdModalContent);
      modalRef.componentInstance.name = 'Please Login or Signup to AddCart';
      this.router.navigate(['user-auth'])
      // console.log("i am here");
      // product.quantity = 1
      // this.productService.localAddToCart(product)
      // this.itemInLocalCartProductId.push(product.id);
      // this.getLocalCart()
      // console.log(this.itemInLocalCartProductId);
    } else {
      this.itemIds.push(product.id);
      let ids = this.itemIds.slice(0);
      localStorage.setItem('cartId', JSON.stringify(ids));
      let user = localStorage.getItem('user');
      if (user) {
        let userId = JSON.parse(user)['id'];
        // console.log(userId);
        let cartData: Cart = { ...product, productId: product.id, userId };
        console.log(cartData);
        delete cartData.id;
        // console.log(cartData);
        cartData.quantity = 1;
        this.productService.addToCart(cartData).subscribe({
  
          next: (res) => {
            console.log(res);
            this.productService.currenCart();
            // this.addedCart = true;
          },
          error: (data) => {
            console.log(data);
          },
        });
      }
    }
  }
}
