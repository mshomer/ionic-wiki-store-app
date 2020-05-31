import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrderComponent } from './tabs/order/order.component';
import { FilterComponent } from './tabs/filter/filter.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
  ],
  declarations: [ProductsPage, OrderComponent, FilterComponent, TabsComponent],
  entryComponents: [OrderComponent, FilterComponent],
})
export class ProductsPageModule {}
