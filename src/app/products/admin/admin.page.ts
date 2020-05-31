import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  products$: Observable<Product[]>;

  constructor(
    private productsService: ProductsService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.products$ = this.productsService.products;
  }

  onDeleteProduct(productId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl
      .create({
        cssClass: 'transparent',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.productsService.deleteProduct(productId).subscribe(() => {
          loadingEl.dismiss();
        });
      });
  }
}
