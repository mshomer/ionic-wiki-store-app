import { Injectable } from '@angular/core';
import { ProductsService } from './products.service';
import { AuthService } from '../auth/auth.service';
import { combineLatest } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class AppLoadService {
  constructor(
    private productsService: ProductsService,
    private authService: AuthService,
    private loadingController: LoadingController
  ) {}

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingController
        .create({
          cssClass: 'transparent',
        })
        .then((loadingEl) => {
          loadingEl.present();
          combineLatest(
            this.authService.autoLogin(),
            this.productsService.fetchProducts()
          ).subscribe(() => {
            loadingEl.dismiss();
            resolve();
          });
        });
    });
  }
}
