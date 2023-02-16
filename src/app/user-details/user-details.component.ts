import { Component } from '@angular/core';
import { SignUp } from '../interface/signup';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {
  user!: SignUp;
  errorMsg:string = '';
  successMsg:string = '';
  isNotChange: boolean = true;
  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {}
  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    console.log(this.user);
  }
  edit() {
    this.isNotChange = !this.isNotChange;
  }
  changePassword(data: string) {
    if (data.length >= 8) {
      this.userService.passwordChange(data).subscribe(result => {
        if(result){
          console.log(result);
          this.successMsg = "Your password updated";
          this.isNotChange = !this.isNotChange
        }

      })
    }else{
      this.errorMsg = "Password must be 8 Charecter";
      console.log(this.errorMsg);
    }
  }
}
