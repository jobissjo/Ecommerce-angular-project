import { Component } from '@angular/core';
import { SignUp } from '../interface/signup';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
  user!:SignUp;
  constructor(private productService:ProductService) {}
  ngOnInit(){
    let user = localStorage.getItem('user')
    this.user = user && JSON.parse(user);
    console.log(this.user);
  }
}
