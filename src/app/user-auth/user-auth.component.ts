import { Component } from '@angular/core';
import { Cart, Product } from '../interface/product';
import { Login, SignUp } from '../interface/signup';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss'],
})
export class UserAuthComponent {
  showLogin: boolean = true;
  authError: string = '';
  constructor(
    private userService: UserService,
    private producService: ProductService
  ) {}
  ngOnInit() {
    this.userService.userAuthReload();
  }
  signUp(data: SignUp) {
    // console.log(data);
    this.userService.userSignUp(data);
  }
  userLogin(data: Login) {
    this.userService.userLogin(data);
    this.userService.invalidUserAuth.subscribe((res) => {
      if (res) {
        this.authError = 'Invalid Credentials';
        console.log(this.authError);
      } else {
        this.producService.currenCart()
        this.localCartToUserCart();
        this.producService.loginUpdateCartIdtoLocal()
      }
    });
  }
  openLogin() {
    this.showLogin = true;
  }
  openSignUp() {
    this.showLogin = false;
  }
  localCartToUserCart() {
    console.log('called');
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    let localStorageId:string[] = []
    if (data) {
      let cartDataList: Product[] = JSON.parse(data);

      cartDataList.forEach((product: Product, index) => {
        let cartData: Cart = {
          ...product,
          productId: product.id,
          userId,
        };
        delete cartData.id;
        setTimeout(()=> {
          this.producService.addToCart(cartData).subscribe((result) => {
            if (result) {
              console.log('data is stored in db');
            }
          });
        },500);
        if(cartDataList.length ===  index+1){
          localStorage.removeItem('localCart')
        }
      });
    }
    setTimeout(()=> {
      this.producService.getCartList(userId)
    }, 2000)
  }
}
