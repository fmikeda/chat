import { Component, NgZone, ViewChild } from "@angular/core";
import { NavController, App, Content } from "ionic-angular";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { LoginPage } from "../login/login";
import { MessageModel } from "../../model/message-model";
import { UserModel } from "../../model/user-model";
import { ChatProvider } from "../../providers/chat/chat";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  messages: Array<MessageModel>;
  user: UserModel;
  textMessage: string;
  @ViewChild(Content) content: Content;
  constructor(
    public navCtrl: NavController,
    private app: App,
    private authProvider: AuthenticationProvider,
    private chatProvider: ChatProvider,
    private zone: NgZone
  ) {
    this.user = authProvider.getUser();
    this.loadMessages();

    chatProvider.onMessageReceived.subscribe(() => {
      zone.run(() => {
        console.log("atualizado");
        this.loadMessages();
      });
    });
  }

  loadMessages() {
    this.chatProvider.getMessages().then(messages => {
      this.messages = messages;
      setTimeout(() => {
        if (this.content) {
          this.content.scrollToBottom(300);
        } else {
          console.log("Erro conteudo nao carregado");
        }
      }, 200);
    });
  }

  logout() {
    this.authProvider.logout();
    this.app.getRootNav().setRoot(LoginPage);
  }

  sendMessage() {
    let message: MessageModel = new MessageModel();
    message.date = new Date().toISOString();
    message.text = this.textMessage;
    message.user_id = this.user.uid;
    message.nickname = this.user.nickname;
    message.image = this.user.image;
    this.chatProvider
      .sendMessage(message)
      .then(() => (this.textMessage = ""))
      .catch(error => console.error(error));
  }
}
