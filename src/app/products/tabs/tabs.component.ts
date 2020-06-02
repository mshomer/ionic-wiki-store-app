import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderComponent } from './order/order.component';
import { FilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  @Input() orderBy: string;
  @Output() orderByChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() filterBy: {};
  @Output() filterByChange: EventEmitter<{}> = new EventEmitter();

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onTabClick(tab: string) {
    if (tab === 'order') {
      this.openOrderByModal();
    } else if (tab === 'filter') {
      this.openFilterByModal();
    }
  }

  openOrderByModal() {
    this.modalCtrl
      .create({
        component: OrderComponent,
        componentProps: {
          orderByItems: [
            { text: 'Price', value: 'price' },
            { text: 'A-Z', value: 'title' },
            { text: 'Categories', value: 'category' },
          ],
          activeItem: this.orderBy,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'confirm') {
          this.orderByChange.emit(resultData.data.orderBy);
        }
      });
  }

  openFilterByModal() {
    const column = this.filterBy ? Object.keys(this.filterBy)[0] : undefined;
    const value = this.filterBy ? this.filterBy[column] : undefined;
    this.modalCtrl
      .create({
        component: FilterComponent,
        componentProps: {
          activeItem: { column, value },
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'confirm') {
          this.filterByChange.emit(resultData.data.filterBy);
        }
      });
  }
}
