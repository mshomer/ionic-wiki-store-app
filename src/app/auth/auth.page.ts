import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  isSigningUp = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  authenticate(email: string, password: string) {
    const message = this.isSigningUp ? 'Signing up...' : 'Signing in...';
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: message,
      })
      .then((loadingEl) => {
        loadingEl.present();

        let authObs: Observable<AuthResponseData>;
        if (this.isSigningUp) {
          authObs = this.authService.signUp(email, password);
        } else {
          authObs = this.authService.signIn(email, password);
        }

        authObs.subscribe(
          () => {
            loadingEl.dismiss();
            this.router.navigateByUrl('/store/admin');
          },
          (errRes) => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address exists already!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'Email address could not be found';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct';
            }
            this.showAlert(message);
          }
        );
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authenticated Failed',
        message: message,
        buttons: ['OK'],
      })
      .then((alertEl) => alertEl.present());
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email, password);
    form.reset();
  }

  onToggleSignUpRequest() {
    this.isSigningUp = !this.isSigningUp;
  }
}
