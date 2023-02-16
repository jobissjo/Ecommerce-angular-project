import { Injectable,EventEmitter } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Login, SignUp } from '../interface/signup';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellService {
  sellerUrl = "http://localhost:3000/seller";
  // sellerUrl = "https://json-server-template-tawny.vercel.app/seller"
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError = new EventEmitter<boolean>(false);

  constructor(private http:HttpClient, private router:Router) { }
  userSignUp(data:SignUp){
    // console.warn('service called');
    this.http.post(this.sellerUrl,data, {observe: 'response'})
      .subscribe((result)=> {
        this.isSellerLoggedIn.next(true);
        localStorage.setItem('seller', JSON.stringify(result.body))
        this.router.navigate(['seller-home'])
        console.log( );
      })
  }
  reloadSeller(){
    if(localStorage.getItem('seller')){
      this.isSellerLoggedIn.next(true)
      this.router.navigate(['seller-home'])
    }
  }
  UserLogin(data:Login){
    this.http.get(`${this.sellerUrl}?email=${data.email}&password=${data.password}`,
    {observe: 'response'}).subscribe((result:any)=> {
      console.log(result);
      if(result && result.body && result.body.length){
        console.log(result.body);
        localStorage.setItem('seller', JSON.stringify(result.body));
        this.reloadSeller()
        // this.router.navigate(['seller-home']);
      }
      else{
        this.isLoginError.emit(true)
      }
    })
  }
}
