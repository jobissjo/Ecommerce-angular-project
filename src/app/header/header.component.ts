import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { Product } from '../interface/product';
import { OtherService } from '../services/other.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  menuType: string = 'default';
  sellerName: string = '';
  userName: string = '';
  activeRouter:string = '';
  hidden: boolean = true;
  cartItemsCount: number = 0;
  searchResult: undefined | Product[];
  productData: Product[] = [];
  showCollection!: boolean;
  currentUrl:string = '/';
  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private productServ: ProductService,
    private otherService: OtherService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((data:any) => {
      this.currentUrl = data.url
    })
    this.otherService.collection$.subscribe((result) => {
      this.showCollection = result;
    });
    this.router.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          this.menuType = 'seller';
          let sellerStore = localStorage.getItem('seller');
          let sellerData = sellerStore && JSON.parse(sellerStore)[0];
          this.sellerName = sellerData.name;
        } else if (localStorage.getItem('user')) {
          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName = userData.name;
          this.menuType = 'user';
          this.productServ.getCartList(userData.id);
        } else {
          this.menuType = 'default';
        }
      }
    });

    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItemsCount = JSON.parse(cartData).length;
      this.productServ.cartData.subscribe((items) => {
        this.cartItemsCount = items.length;
      });
    } else if (localStorage.getItem('user')) {
      this.productServ.currenCart().subscribe((result) => {
        this.cartItemsCount = result.length;
      });
      this.productServ.cartData$.subscribe((result) => {
        this.cartItemsCount = result.length;
      });
    }
  }
  ngOnChanges() {
    this.productServ.currenCart().subscribe((result) => {
      this.cartItemsCount = result.length;
    });
    this.showCollection = true;
  }
  userData() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return userData;
  }
  logout() {
    localStorage.removeItem('seller');
    this.router.navigate(['/']);
  }
  searchProduct(data: string) {
    this.otherService.collection$.next(false);
    this.hidden = false;
    this.productServ.searchProduct(data).subscribe((result) => {
      this.searchResult = result;
      this.router.navigate([`/search/${data}`]);
    });
  }
  getCollectionProduct(data: string) {
    this.otherService.collection$.next(false);
    this.productServ.getProductByCategory(data).subscribe((result) => {
      this.productData = result;
      this.router.navigate([`/collection/${data}`]);
    });
  }
  prodSearch(query: KeyboardEvent) {
    if (query) {
      this.hidden = true;
      const element = query.target as HTMLInputElement;
      this.productServ.searchProduct(element.value).subscribe((result) => {
        this.searchResult = result;
      });
    }
  }
  hideSuggSearch() {
    this.searchResult = undefined;
  }
  redirecPro(id: number) {
    this.router.navigate(['/details/' + id]);
  }
  userLogOut() {
    localStorage.removeItem('user');
    this.router.navigate(['/user-auth']);
    this.productServ.cartData.next([]);
    this.productServ.cartData$.next([]);
    localStorage.removeItem('cartId');
    this.productServ.localCartIds$.next([])
    console.log('logOut');
  }
}
