import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Cart, Order, Product } from '../interface/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
//   productUrl = 'http://localhost:3000/products';
//   cartUrl = 'http://localhost:3000/carts';
//   orderUrl = 'http://localhost:3000/orders';
  productUrl = "https://json-server-template-tawny.vercel.app/products";
  cartUrl = "https://json-server-template-tawny.vercel.app/carts";
  orderUrl = "https://json-server-template-tawny.vercel.app/orders";
  singleproduct$ = new BehaviorSubject<Product | undefined>(undefined);
  localCartIds$ = new BehaviorSubject<number[]>([]);
  
  cartData = new BehaviorSubject<Product[]>([]);
  cartData$ = new BehaviorSubject<Cart[]>([]);
  constructor(private http: HttpClient) {}
  getProductDetails(id: any) {
    return this.http
      .get<Product>(`${this.productUrl}/${id}`)
      .subscribe((data) => {
        // console.log(data);
        this.singleproduct$.next(data);
      });
  }
  addProduct(data: Product) {
    return this.http.post(this.productUrl, data);
  }
  getProductByCategory(category: string) {
    return this.http.get<Product[]>(`${this.productUrl}?category=${category}`);
  }
  productList() {
    return this.http.get<Product[]>(this.productUrl);
  }
  deleteProduct(id: number) {
    return this.http.delete(`${this.productUrl}/${id}`);
  }
  getProduct(id: string) {
    return this.http.get<Product>(`${this.productUrl}/${id}`);
  }
  updateProduct(data: Product) {
    return this.http.put<Product>(`${this.productUrl}/${data.id}`, data);
  }
  popularProducts() {
    return this.http.get<Product[]>(`${this.productUrl}?_limit=3`);
  }
  trendyProducts() {
    return this.http.get<Product[]>(`${this.productUrl}?_limit=8`);
  }
  searchProduct(query: string) {
    return this.http.get<Product[]>(`${this.productUrl}?q=${query}`);
  }
  localAddToCart(data: Product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.next([data]);
    } else {
      cartData = JSON.parse(localCart);

      console.log(cartData);
      // If adding item is already available, + the quantity ----== logic
      let itemData = cartData.find((item: Product) => item.name == data.name);
      if (itemData) {
        let index = cartData.findIndex((item: any) => item.data == data.name);
        cartData.splice(index, 1);
        itemData.quantity += data.quantity;
        cartData.push(itemData);
        //
      } else {
        cartData.push(data);
      }
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.next(cartData);
    }
  }
  removeCartItem(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: Product[] = JSON.parse(cartData);
      items = items.filter((item: Product) => item.id !== productId);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.next(items);
    }
  }
  addToCart(cartData: Cart) {
    return this.http.post(this.cartUrl, cartData);
  }
  getCartList(userId: number) {
    return this.http
      .get<Product[]>(`${this.cartUrl}?userId=${userId}`, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result?.body) {
          this.cartData.next(result.body);
        }
      });
  }
  removeToCart(cartId: number) {
    return this.http.delete(`${this.cartUrl}/${cartId}`);
  }
  currenCart() {
    let user = localStorage.getItem('user');
    let userData = user && JSON.parse(user);
    userData &&
      this.http
        .get<Cart[]>(`${this.cartUrl}?userId=${userData.id}`)
        .subscribe((result) => {
          this.cartData$.next(result);
        });
    return this.http.get<Cart[]>(`${this.cartUrl}?userId=${userData.id}`);
  }
  orderNow(data: Order) {
    return this.http.post(this.orderUrl, data);
  }
  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    this.http.get<Order[]>(`${this.orderUrl}?user_id=${userData.id}`);
    return this.http.get<Order[]>(`${this.orderUrl}?user_id=${userData.id}`);
  }
  deleteCartItem(cartId: number) {
    return this.http.delete(`${this.cartUrl}/${cartId}`).subscribe((result) => {
      this.cartData.next([]);
    });
  }
  cancelOrder(orderId: number) {
    return this.http.delete(`${this.orderUrl}/${orderId}`);
  }
  getCurrentCartIds() {
    let localID = localStorage.getItem('cartId');
    let id = localID && JSON.parse(localID);
    this.localCartIds$.next(id);
    return id;
  }
  updateLocalCartId(productId: any) {
    // Delete cart id from localStorage
    let idArr = this.getCurrentCartIds();
    idArr = idArr?.filter((id: any) => id !== productId);
    console.log('idArr', idArr);
    // update to localStorage
    localStorage.setItem('cartId', JSON.stringify(idArr));
  }
  loginUpdateCartIdtoLocal() {
    let ids: number[] = [];
    this.currenCart().subscribe((result) => {
      result.map((data) => {
        if (data.id) ids.push(data.id);
        console.log(data);
      });
      console.log(ids);
      this.localCartIds$.next(ids);
      localStorage.setItem('cartId', JSON.stringify(ids));
    });
  }
  handleQuantity(cartId: number, data: Cart) {
    return this.http.put<Cart>(`${this.cartUrl}/${cartId}`, data);
  }
  getProductsBySellerId() {
    let sellerId = this.getCurrentSellerId();
    return this.http.get<Product[]>(`${this.productUrl}?sellerId=${sellerId}`);
  }
  getCurrentSellerId() {
    let seller = localStorage.getItem('seller');
    return seller && JSON.parse(seller)[0].id;
  }
}
