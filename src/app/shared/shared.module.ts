import { NgModule } from '@angular/core';
import { LimitToPipe } from './pipes/limitTo.pipes';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderByPipe } from './pipes/orderBy.pipe';
import { HideOnScrollDirective } from './directives/hide-on-scroll.directive';
import { ProductCellComponent } from './components/product-cell/product-cell.component';
import { FilterByPipe } from './pipes/filterBy.pipe';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { SearchbarListComponent } from './components/searchbar-list/searchbar-list.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  imports: [RouterModule, CommonModule, IonicModule],
  declarations: [
    LimitToPipe,
    ProductItemComponent,
    ProductCardComponent,
    ProductCellComponent,
    OrderByPipe,
    HideOnScrollDirective,
    FilterByPipe,
    ImagePickerComponent,
    ProductGridComponent,
    SearchbarListComponent,
    HeaderComponent,
  ],
  exports: [
    LimitToPipe,
    ProductItemComponent,
    ProductCardComponent,
    ProductCellComponent,
    OrderByPipe,
    HideOnScrollDirective,
    FilterByPipe,
    ImagePickerComponent,
    ProductGridComponent,
    SearchbarListComponent,
    HeaderComponent,
  ],
  entryComponents: [SearchbarListComponent],
})
export class SharedModule {}
