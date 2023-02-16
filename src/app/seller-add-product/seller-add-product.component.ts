import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../interface/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.scss'],
})
export class SellerAddProductComponent {
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private router:Router
  ) {}
  addProductMsg: string | undefined;

  addProd(data: Product) {
    let sellerId = this.productService.getCurrentSellerId();
    data.sellerId = sellerId;
    this.productService.addProduct(data).subscribe((result) => {
      if (result) {
        this.toastr.success('Product has been updated', 'Successful', {
          positionClass: 'toast-top-right', timeOut: 2000,
        });
      }
      setTimeout(() => {
        this.addProductMsg = undefined
        this.router.navigate(['/seller-home'])
         },3000);
    });
  }
}
