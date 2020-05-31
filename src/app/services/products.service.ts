import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';

import { Product } from '../models/product.model';
import { AuthService } from '../auth/auth.service';
import { LoadingController } from '@ionic/angular';

import * as ml from 'ml5';

interface predictionResult {
  label: string;
  confidence: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private classifier: any;

  private baseUrl = `https://wiki-store-2ae38.firebaseio.com/products`;

  private _products = new BehaviorSubject<Product[]>([]);

  get products(): Observable<Product[]> {
    return this._products.asObservable();
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private loadingController: LoadingController
  ) {
    this.loadModel();
  }

  fetchProducts(): Observable<Product[]> {
    return this.http
      .get<{ [key: string]: Product }>(`${this.baseUrl}.json`)
      .pipe(
        map((res) => {
          const products = [];
          for (const key in res) {
            const product = res[key];
            product.id = key;
            products.push(product);
          }
          return products;
        }),
        tap((products) => {
          this._products.next(products);
        })
      );
  }

  getProduct(productId: string): Observable<Product> {
    return this.products.pipe(
      take(1),
      map((products) => {
        return { ...products.find((p) => p.id === productId) };
      })
    );
  }

  deleteProduct(productId: string): Observable<Product[]> {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http
          .delete(`${this.baseUrl}/${productId}.json?auth=${token}`)
          .pipe(
            switchMap(() => {
              return this.products;
            }),
            take(1),
            tap((products) => {
              return this._products.next(
                products.filter((p) => p.id !== productId)
              );
            })
          );
      })
    );
  }

  addProduct(
    title: string,
    description: string,
    price: number,
    category: string,
    indoors: boolean,
    outdoors: boolean,
    imageUrl: string
  ) {
    const newProduct = new Product(
      title,
      description,
      price,
      category,
      indoors,
      outdoors,
      imageUrl
    );

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .post<{ name: string }>(
            `${this.baseUrl}.json?auth=${token}`,
            newProduct
          )
          .pipe(
            switchMap((res) => {
              // res['name'] - the generated id got from the response
              newProduct.id = res.name;
              return this.products;
            }),
            take(1),
            tap((products) => {
              return this._products.next(products.concat(newProduct));
            })
          );
      })
    );
  }

  editProduct(
    id: string,
    title: string,
    description: string,
    price: number,
    category: string,
    indoors: boolean,
    outdoors: boolean,
    imageUrl: string
  ) {
    let updatedProducts: Product[];
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.products.pipe(
          take(1),
          switchMap((products) => {
            const updatedProductIndex = products.findIndex((p) => p.id === id);
            updatedProducts = [...products];
            updatedProducts[updatedProductIndex].title = title;
            updatedProducts[updatedProductIndex].description = description;
            updatedProducts[updatedProductIndex].price = price;
            updatedProducts[updatedProductIndex].category = category;
            updatedProducts[updatedProductIndex].indoors = indoors;
            updatedProducts[updatedProductIndex].outdoors = outdoors;
            updatedProducts[updatedProductIndex].imageUrl = imageUrl;

            return this.http.put(`${this.baseUrl}/${id}.json?auth=${token}`, {
              ...updatedProducts[updatedProductIndex],
              id: null,
            });
          }),
          tap(() => {
            this._products.next(updatedProducts);
          })
        );
      })
    );
  }

  // Predict Logic
  private async loadModel() {
    this.classifier = await ml.imageClassifier('/assets/model.json');
  }

  predict(base64Image: string): Promise<Product> {
    return new Promise((resolve, reject) => {
      this.loadingController
        .create({
          cssClass: 'transparent',
        })
        .then((loadingEl) => {
          loadingEl.present();
          var imageData = new Image();
          imageData.src = base64Image;
          imageData.width = 320;
          imageData.height = 240;

          this.classifier.classify(
            imageData,
            (err, predictions: predictionResult[]) => {
              loadingEl.dismiss();
              if (err) {
                reject(err);
              }

              const product = this.products.pipe(
                take(1),
                map((products) => {
                  return products.find(
                    (product) => product.id === predictions[0].label
                  );
                })
              );

              resolve(product.toPromise());
            }
          );
        });
    });
  }
}
