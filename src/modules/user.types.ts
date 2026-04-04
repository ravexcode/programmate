export default class User {
  //ID del usuario
  public id: Number | undefined;
  //Nombre de usuario, sino se ingresó se reemplaza con el nombre de usuario
  public name: string | undefined;
  //Email en string
  public email: string;
  //Password hasheada en texto
  public password: string;
  //ToDoList encriptada en string, pero también puede estar vacía
  public to_do_list: string | undefined;
  //Plan de usuario, sino se ingresó se cambia a "free"
  public plan: string | undefined;
  //Datos del token de cancelación al crear la cuenta
  public cancel_token: string;
  public cancel_token_expires: Date;
  //Datos del token de cambio de contraseña
  public change_password_token: string | undefined;
  public change_password_token_expires: Date | undefined;
  //Team ID
  public teams: Array<Number> | undefined;

  public constructor(
    name: string | undefined,
    email: string,
    password: string,
    cancel_token: string,
    cancel_token_expires: Date
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.cancel_token = cancel_token;
    this.cancel_token_expires = cancel_token_expires;
  }
}