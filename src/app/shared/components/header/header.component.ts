import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonHeader } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('ionHeader', { static: false }) ionHeader: IonHeader;

  constructor() {}

  ngOnInit() {}
}
