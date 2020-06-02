import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;
  @Input() link: any;
  @Input() showOptions: boolean = false;

  @Output() delete: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onDelete() {
    this.delete.emit();
  }
}
