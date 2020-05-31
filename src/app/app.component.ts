import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';

import { AuthService } from './auth/auth.service';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authSub = combineLatest(
      this.authService.userIsAuthenticated,
      this.authService.userId
    )
      .pipe(
        map((userIsAuthenticated, userId) => {
          let navigateToAuthPage = false;
          if (userId && !userIsAuthenticated) {
            navigateToAuthPage = true;
          }

          return navigateToAuthPage;
        })
      )
      .subscribe((navigateToAuthPage) => {
        if (navigateToAuthPage) {
          this.router.navigateByUrl('/auth');
        }
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
