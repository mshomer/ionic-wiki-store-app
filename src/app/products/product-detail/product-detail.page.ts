import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  product$: Observable<Product>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const productId = paramMap.get('productId');
      this.product$ = this.productsService.getProduct(productId);
      this.product$.pipe(take(1)).subscribe((product) => {
        if (isEmpty(product)) {
          this.alertCtrl
            .create({
              header: 'An error occurred!',
              message: 'Product could not be fetched. Please try again later',
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    this.router.navigateByUrl('/store');
                  },
                },
              ],
            })
            .then((alertEl) => alertEl.present());
        }
      });
    });
  }
}
