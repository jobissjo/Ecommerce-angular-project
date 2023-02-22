import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; //ToastContainerDirective,
import { Product } from '../interface/product';
import { ProductService } from '../services/product.service';
import { SellService } from '../services/sell.service';


@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.scss'],
})
export class SellerUpdateProductComponent implements OnInit {
  productId!: string;
  // @ViewChild(ToastContainerDirective, { static: true })
  // toastContainer!: ToastContainerDirective;
  productData: undefined | Product;
  productMsg: undefined | string;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private sellService:SellService
  ) {}

  ngOnInit() {
    let productId = this.route.snapshot.paramMap.get('id');
    console.log(this.productId);
    productId &&
      this.productService.getProduct(productId).subscribe((data) => {
        console.log(data);
        this.productData = data;
      });
      // this.toastr.overlayContainer = this.toastContainer;
  }
  updateProduct(data: Product) {
    if (this.productData) {
      data.id = this.productData.id;
      let seller = this.sellService.getSeller()[0]
      // console.log(seller);
      data.sellerId = seller.id;
      // data.sellerId = seller
    }
    this.productService.updateProduct(data).subscribe((result) => {
      if (result) {
        this.toastr.success('Product has been updated', "Successful",{ positionClass: 'toast-top-right' });
      }
      setTimeout(() => {
        this.productMsg = undefined;
        this.router.navigate(['/seller-home']);
      }, 3000);
    });
  }
}
