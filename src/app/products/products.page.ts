import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';

import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products$: Observable<Product[]>;
  orderBy: string = 'price';
  filterBy: {} | {}[];
  viewBy: 'grid' | 'list';
  storage = Plugins.Storage;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.storage.get({ key: 'viewBy' }).then((res) => {
      this.viewBy = (res.value as any) || 'list';
    });
  }

  ionViewWillEnter() {
    this.products$ = this.productsService.products;
  }

  onSelectedImage(base64Image: string) {
    this.productsService.predict(base64Image).then((product) => {
      if (product) {
        this.router.navigateByUrl(`/store/${product.id}`);
      } else {
        this.filterBy = undefined;
      }
    });
  }

  onViewBy(viewBy: 'grid' | 'list') {
    this.viewBy = viewBy;
    this.storage.set({ key: 'viewBy', value: viewBy }).then(() => {});
  }
}
