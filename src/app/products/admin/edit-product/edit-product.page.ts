import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Subscription } from 'rxjs';
import { LoadingController, AlertController } from '@ionic/angular';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit, OnDestroy {
  private productSubscription: Subscription;
  private productId: string;
  form: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.productId = paramMap.get('productId');
      this.productSubscription = this.productService
        .getProduct(this.productId)
        .subscribe((product) => {
          if (isEmpty(product)) {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message: 'Product could not be fetched. Please try again later',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.router.navigateByUrl('/store/admin');
                    },
                  },
                ],
              })
              .then((alertEl) => alertEl.present());
          }

          this.form = new FormGroup({
            title: new FormControl(product.title, {
              validators: [Validators.required],
            }),
            description: new FormControl(product.description, {
              validators: [Validators.required, Validators.maxLength(500)],
            }),
            price: new FormControl(product.price, {
              validators: [Validators.required, Validators.min(0)],
            }),
            category: new FormControl(product.category, {
              validators: [Validators.required],
            }),
            indoors: new FormControl(product.indoors, {}),
            outdoors: new FormControl(product.outdoors, {}),
            imageUrl: new FormControl(product.imageUrl, {}),
          });
        });
    });
  }

  onEdit() {
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
        message: 'Editing Product...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        this.productService
          .editProduct(
            this.productId,
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

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
