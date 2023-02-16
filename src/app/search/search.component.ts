import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../interface/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchResults : undefined | Product[];
  query:string|null=''
  constructor(private activeRoute:ActivatedRoute, private productSer:ProductService){ }
  ngOnInit():void{
    // this.query = this.activeRoute.snapshot?.paramMap.get('query');
    this.activeRoute.params.subscribe(result => {
      this.query = result['query']
    })
    this.query && this.productSer.searchProduct(this.query).subscribe((result)=> {
      this.searchResults = result;
    })
  }
}
