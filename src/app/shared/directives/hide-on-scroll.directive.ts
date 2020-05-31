import {
  Directive,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { DomController } from '@ionic/angular';
import { HeaderComponent } from '../components/header/header.component';

@Directive({
  selector: '[hideOnScroll]',
})
export class HideOnScrollDirective implements OnInit {
  @Input('header') header: any;
  @Input('footer') footer: any;

  private lastY = 0;

  constructor(private renderer: Renderer2, private domCtrl: DomController) {}

  ngOnInit(): void {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.header, 'transition', 'margin-top 700ms');
      this.renderer.setStyle(this.footer, 'transition', 'margin-bottom 700ms');
    });
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
    if ($event.detail.scrollTop > this.lastY) {
      this.domCtrl.write(() => {
        this.renderer.setStyle(
          this.header,
          'margin-top',
          `-${this.header.clientHeight}px`
        );

        this.renderer.setStyle(
          this.footer,
          'margin-bottom',
          `-${this.footer.clientHeight}px`
        );
      });
    } else {
      this.domCtrl.write(() => {
        this.renderer.setStyle(this.header, 'margin-top', '0');
        this.renderer.setStyle(this.footer, 'margin-bottom', '0');
      });
    }

    this.lastY = $event.detail.scrollTop;
  }
}
