import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.page.html',
  styleUrls: ['./new-product.page.scss'],
})
export class NewProductPage implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private productService: ProductsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(500)],
      }),
      price: new FormControl(0, {
        validators: [Validators.required, Validators.min(0)],
      }),
      category: new FormControl(null, {
        validators: [Validators.required],
      }),
      indoors: new FormControl(false, {}),
      outdoors: new FormControl(false, {}),
      imageUrl: new FormControl(null, {}),
    });
  }

  onCreate() {
    if (!this.form.valid) {
      return;
    }
    const {
      title,
      description,
      price,
      category,
      indoors,
      outdoors,
      imageUrl,
    } = this.form.value;

    this.loadingCtrl
      .create({
        message: 'Creating new Product...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        this.productService
          .addProduct(
            title,
            description,
            price,
            category,
            indoors,
            outdoors,
            imageUrl
          )
          .subscribe(
            () => {
              loadingEl.dismiss();
              this.form.reset();
              this.router.navigateByUrl('/store/admin');
            },
            (err) => {
              loadingEl.dismiss();
              this.alertCtrl
                .create({
                  header: 'Error Occured',
                  message: err.error.error,
                })
                .then((alertEl) => alertEl.present());
            }
          );
      });
  }

  onSelectedImage(image: string) {
    this.form.patchValue({ imageUrl: image });
  }
}
