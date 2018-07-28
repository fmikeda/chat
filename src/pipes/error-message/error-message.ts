import { Pipe, PipeTransform } from "@angular/core";

/**
 * Generated class for the ErrorMessagePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: "errorMessage"
})
export class ErrorMessagePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    switch (value) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Usuário ou senha inválidos";
      case "auth/invalid-email":
        return "Digite um e-mail válido";
      default:
        break;
    }
    return value.toLowerCase();
  }
}
