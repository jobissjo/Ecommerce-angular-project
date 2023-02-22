import { Component } from '@angular/core';
import { SignUp } from '../interface/signup';
import { SellService } from '../services/sell.service';

@Component({
  selector: 'app-seller-details',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.scss'],
})
export class SellerDetailsComponent {
  seller!: SignUp;
  errorMsg: string = '';
  successMsg: string = '';
  isNotChange: boolean = true;
  constructor(private sellService: SellService) {}
  ngOnInit() {
    this.seller = this.sellService.getSeller()[0];
  }
  sellerHome() {
    this.sellService.reloadSeller();
  }
  changePassword(password: string) {
    this.seller.password = password;
    this.sellService.changeSellerPassword(this.seller).subscribe((result) => {
      if (result) {
        this.seller = result;
        console.log(this.seller);
        this.successMsg = "Your Password Updated Successfully";
        this.isNotChange = !this.isNotChange;
        setTimeout(()=> {
          this.successMsg = ''
        }, 3000)
      }
    });
  }
  edit() {
    this.isNotChange = !this.isNotChange;
  }
}
