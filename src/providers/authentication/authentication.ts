import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { UserModel } from "../../model/user-model";
import { AngularFireDatabase } from "angularfire2/database";

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {
  USER_STORAGE_NAME = "USER";
  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase
  ) {}

  signup(userModel: UserModel) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .createUserAndRetrieveDataWithEmailAndPassword(
          userModel.username,
          userModel.password
        )
        .then(({ user } /*Filtra somente a propriedade user do retorno */) => {
          delete userModel.password;
          var usr = {
            ...userModel /* clona todas as propriedades do objeto UserModel */,
            uid: user.uid
          };
          this.afDatabase.database
            .ref("users")
            .child(user.uid)
            .set(usr, error => {
              if (error) reject(error);
              localStorage.setItem(this.USER_STORAGE_NAME, JSON.stringify(usr));
              resolve(usr);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  login(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .signInWithEmailAndPassword(username, password)
        .then(({ user }) => {
          this.afDatabase.database
            .ref(`users/${user.uid}`)
            .on("value", snapshot => {
              let usr = snapshot.val();
              localStorage.setItem(this.USER_STORAGE_NAME, JSON.stringify(usr));
              resolve(usr);
            });
        })
        .catch(error => reject(error));
    });
  }

  isLoggedIn() {
    let usr = localStorage.getItem(this.USER_STORAGE_NAME);
    return usr != undefined && usr != null;
  }

  getUser() {
    let usr = localStorage.getItem(this.USER_STORAGE_NAME);
    if (usr) return JSON.parse(usr);
    return null;
  }

  logout() {
    localStorage.removeItem(this.USER_STORAGE_NAME);
  }
}
