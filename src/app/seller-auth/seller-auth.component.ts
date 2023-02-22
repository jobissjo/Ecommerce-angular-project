import { Component } from '@angular/core';
import { FormBuilder, NgForm, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login, SignUp } from '../interface/signup';
import { SellService } from '../services/sell.service';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.scss'],
})
export class SellerAuthComponent {
  showLogin: boolean = false;
  authError: string = '';
  sellerSignUp = this.form.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(8)]]
})
  constructor(
    private sellService: SellService,
    private router: Router,
    private form:FormBuilder
  ) {}
  
  ngOnInit() {
    this.sellService.reloadSeller();
  }
  signUp(data:any) {
    // console.warn(this.sellerSignUp.value);
    console.log(data);
    this.sellService.userSignUp(data);
  }
  switchLog() {
    this.showLogin = !this.showLogin;
  }
  login(data: Login) {
    this.authError = '';
    console.log(data);
    this.sellService.UserLogin(data);
    this.sellService.isLoginError.subscribe((err) => {
      if (err) {
        this.authError = 'Email or Password is not correct';
      }
    });
  }
}
