import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-searchbar-list',
  templateUrl: './searchbar-list.component.html',
  styleUrls: ['./searchbar-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchbarListComponent implements OnInit {
  @Input() isSearchBarFocus = false;
  @Input() items$: Observable<any[]>;

  @ViewChild('ionSearchbar', { static: true }) ionSearchbar;

  filterBy$: Subject<{ title: string }> = new Subject();

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.isSearchBarFocus) {
      setTimeout(() => {
        this.ionSearchbar.el.setFocus();
      }, 0);
    }
  }

  openFullScreenSearchBar() {
    if (!this.isSearchBarFocus) {
      this.modalCtrl
        .create({
          component: SearchbarListComponent,
          componentProps: {
            isSearchBarFocus: true,
            items$: this.items$,
          },
        })
        .then((modalEl) => {
          modalEl.present();
        });
    }
  }

  closeFullScreenSearchBar() {
    this.modalCtrl.dismiss('cancel');
  }

  onSearchbarChange(value: string) {
    this.filterBy$.next({ title: value });
  }
}
