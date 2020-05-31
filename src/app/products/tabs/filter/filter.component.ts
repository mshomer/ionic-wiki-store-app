import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Input() activeItem: { column: string; value: any };

  priceChanged: Subject<string> = new Subject<string>();

  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.priceChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.onFilterBy('price', value);
      });
  }

  onFilterBy(column: string, value: any) {
    this.activeItem = { column, value };
    this.modalCtrl.dismiss({ filterBy: { [column]: value } }, 'confirm');
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onClear() {
    this.activeItem = { column: undefined, value: undefined };
    this.modalCtrl.dismiss({ filterBy: {} }, 'confirm');
  }

  onFilterByCategoryClicked() {
    this.actionSheetCtrl
      .create({
        header: 'Choose a category',
        buttons: [
          {
            text: 'Planets',
            handler: () => {
              this.onFilterBy('category', 'Plants');
            },
          },
          {
            text: 'Flowers',
            handler: () => {
              this.onFilterBy('category', 'Flowers');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  onPriceRangeChange(value) {
    this.activeItem.value = value;

    this.priceChanged.next(value);
  }
}
