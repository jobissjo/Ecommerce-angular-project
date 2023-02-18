import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login, SignUp } from '../interface/signup';
import { SellService } from '../services/sell.service';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.scss']
})
export class SellerAuthComponent {
  showLogin:boolean = false;
  authError:string = '';
  constructor(private sellService:SellService, private router:Router){}
  ngOnInit(){
    this.sellService.reloadSeller()
  }
  signUp(form:SignUp){
    console.warn(form)
    this.sellService.userSignUp(form)
  }
  switchLog(){
    this.showLogin =!this.showLogin;
  }
  login(data:Login){
    this.authError = '';
    console.log(data);
    this.sellService.UserLogin(data)
    this.sellService.isLoginError.subscribe(err => {
      if (err){
        this.authError = "Email or Password is not correct"
      }
    })
  }
}
