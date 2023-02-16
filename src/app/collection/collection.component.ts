import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../interface/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit{
  searchResults : undefined | Product[];
  query:string|null='';
  constructor(private activeRoute:ActivatedRoute, private productService:ProductService){}
  ngOnInit(){
    this.activeRoute.params.subscribe(result => {
      this.query = result['query']
    })
    this.query && this.productService.getProductByCategory(this.query).subscribe((result)=> {
      this.searchResults = result;
    })
  }
}
