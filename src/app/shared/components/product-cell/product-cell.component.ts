import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-cell',
  templateUrl: './product-cell.component.html',
  styleUrls: ['./product-cell.component.scss'],
})
export class ProductCellComponent implements OnInit {
  @Input() product: Product;
  @Input() link: any;

  constructor() {}

  ngOnInit() {}
}
