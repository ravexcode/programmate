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
  public toDoList: string | undefined;
  //Plan de usuario, sino se ingresó se cambia a "free"
  public plan: string | undefined;
  //Datos del token de cancelación al crear la cuenta
  public cancelToken: string;
  public cancelTokenExpires: Date;
  //Datos del token de cambio de contraseña
  public changePasswordToken: string | undefined;
  public changePasswordTokenExpires: Date | undefined;
  //Team ID
  public teamId: Number | undefined;

  public constructor(
    name: string | undefined,
    email: string,
    password: string,
    cancelToken: string,
    cancelTokenExpires: Date
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.cancelToken = cancelToken;
    this.cancelTokenExpires = cancelTokenExpires;
  }
}