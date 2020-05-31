import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  products$: Observable<Product[]>;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.products$ = this.productsService.products;
  }

  onSelectedImage(base64Image: string) {
    this.productsService.predict(base64Image).then((product) => {
      if (product) {
        this.router.navigateByUrl(`/store/${product.id}`);
      } else {
        // alert not found
      }
    });
  }
}
