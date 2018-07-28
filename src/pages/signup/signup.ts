import { Component } from "@angular/core";
import { NavController, NavParams, App } from "ionic-angular";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { UserModel } from "../../model/user-model";
import { HomePage } from "../home/home";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ErrorMessagePipe } from "../../pipes/error-message/error-message";
import { UiMessageProvider } from "../../providers/ui-message/ui-message";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-signup",
  templateUrl: "signup.html",
  providers: [Camera]
})
export class SignupPage {
  image: string;
  errorPipe = new ErrorMessagePipe();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthenticationProvider,
    private app: App,
    private camera: Camera,
    private uiMessageProvider: UiMessageProvider
  ) {}

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.image = "data:image/jpeg;base64," + imageData;
      },
      err => {}
    );
  }

  signup(name, nickname, username, password) {
    let userModel: UserModel = new UserModel();
    userModel.name = name;
    userModel.nickname = nickname;
    userModel.username = username;
    userModel.password = password;
    userModel.image = this.image;
    this.uiMessageProvider.showLoading("Carregando...");
    this.authProvider
      .signup(userModel)
      .then(user => {
        this.uiMessageProvider.hideLoading();
        this.app.getRootNav().setRoot(HomePage);
        console.log(user);
      })
      .catch(error => {
        this.uiMessageProvider.hideLoading();
        this.uiMessageProvider.showToast(this.errorPipe.transform(error.code));
      });
  }
}
