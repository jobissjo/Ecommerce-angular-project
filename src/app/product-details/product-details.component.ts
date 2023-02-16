import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cart, Product } from '../interface/product';
import { ProductService } from '../services/product.service';
// import swal from 'node_modules/sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { pipe, filter, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnChanges{
  productData: undefined | Product;
  Prodcount: number = 1;
  showRemoveCart: boolean = false;
  cartData!: Product;
  productId :string ='';
  prodIdObs$= new BehaviorSubject<Product|undefined>(undefined);
  constructor(
    private activateRoute: ActivatedRoute,
    private productSer: ProductService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.activateRoute.params.subscribe(data=> {
      // console.log(data['productId']);
      this.productId = data['productId']
      
    })
    this.prodIdObs$.subscribe(result=> {
      // this.productId = result;
      // console.log(result);
    })
    console.log(this.productId);
    this.productId &&
      this.productSer.getProductDetails(this.productId)
      this.productSer.singleproduct$.subscribe((result) => {
        // console.log(result);
        this.productData = result;
        let cartData = localStorage.getItem('localCart');
        if (this.productId && cartData) {
          let items: Product[] = JSON.parse(cartData);
          items = items.filter(
            (item: Product) => this.productId === item?.id.toString()
          );
          if (items.length) {
            this.showRemoveCart = true;
          } else {
            this.showRemoveCart = false;
          }
        }
        let user = localStorage.getItem('user');
        if (user) {
          let userId = user && JSON.parse(user).id;
          this.productSer.getCartList(userId);

          this.productSer.cartData.subscribe((result) => {
            let item = result.filter((item: Product) => {
              return this.productId?.toString() === item.productId?.toString();
            });
            if (item.length) {
              this.cartData = item[0];
              this.showRemoveCart = true;
            }
          });
        }
      });
  }
  handleQuantity(data: string) {
    if (data == 'plus' && this.Prodcount < 20) ++this.Prodcount;
    else if (data == 'min' && this.Prodcount > 1) --this.Prodcount;
  }
  ngOnChanges(){
    this.productSer.getProductDetails(this.productId);
    console.log('called');
  }
  addCart() {
    // Toaster for add Cart
    this.toastr.info('Item added to Cart', 'Done', {
      timeOut: 1000,
      positionClass: 'toast-top-center',
      progressBar: true,
      progressAnimation: 'decreasing',
      tapToDismiss: true,
      closeButton: true,
    });
    if (this.productData) {
      this.productData.quantity = this.Prodcount;
      console.log(this.productData.quantity);
      // User when not logged in
      if (!localStorage.getItem('user')) {
        console.log(this.productData);
        this.productSer.localAddToCart(this.productData);
      }
      // User When loggedin
      else {
        console.log('user is logged in');
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        console.log(userId);
        let cartData: Cart = {
          ...this.productData,
          productId: this.productData.id,
          userId,
        };
        delete cartData.id;
        this.productSer.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.productSer.getCartList(userId);
            this.showRemoveCart = true;
            this.productSer.currenCart();
            // localid push to
            let user = localStorage.getItem('cartId');
            if(user) {
              let userid =  JSON.parse(user)
              userid.push(cartData.productId)
              localStorage.setItem('cartId', JSON.stringify(userid))
              console.log(userid);
            }
          }
        });
      }
      this.showRemoveCart = true;
    }
  }
  removeFromCart(productId: number) {
    this.toastr.warning('Item delete from Cart', 'Removed', {
      timeOut: 1000,
      positionClass: 'toast-top-center',
      progressBar: true,
      progressAnimation: 'decreasing',
      tapToDismiss: true,
      closeButton: true,
    });
    if (!localStorage.getItem('user')) {
      console.log(productId);
      this.productSer.removeCartItem(productId);
      this.showRemoveCart = false;
    } else {
      console.log('cart data', this.cartData);
      this.cartData &&
        this.productSer.removeToCart(this.cartData.id).subscribe((result) => {
          let user = localStorage.getItem('user');
          let userId = user && JSON.parse(user).id;
          this.productSer.getCartList(userId);
          this.showRemoveCart = false;
          this.productSer.currenCart();
          // 
          this.productSer.loginUpdateCartIdtoLocal()
          // Update local Cartid in local Storage
          this.productSer.updateLocalCartId(productId)
        });
    }
  }
}
