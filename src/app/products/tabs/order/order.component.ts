import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  @Input() orderByItems: { text: string; value: string };
  @Input() activeItem;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(this.activeItem);
  }

  onOrderBy(orderBy: string) {
    this.activeItem = orderBy;
    this.modalCtrl.dismiss({ orderBy }, 'confirm');
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
