import { Injectable } from "@angular/core";
import { ToastController, LoadingController } from "ionic-angular";

/*
  Generated class for the UiMessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UiMessageProvider {
  loader: any;
  constructor(
    public toastCtrl: ToastController,
    public loginCtrl: LoadingController
  ) {}

  showToast(message, duration = 3000) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  hideLoading() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  showLoading(message, duration?) {
    let ldr: any = {
      content: message
    };
    if (duration) {
      ldr.durarion = duration;
    }
    this.loader = this.loginCtrl.create(ldr);
    this.loader.present();
  }
}
