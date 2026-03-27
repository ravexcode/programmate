//Clase de usuario, con sus funciones

//Imports
import { supabase } from "@/utils/clients";
import { hash, genSalt, compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";

//Datos predefinidos del usuario
export default class User {
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

  public constructor(
    //Obligatorio
    email: string,
    password: string,
    cancelToken: string,
    cancelTokenExpires: Date,
    //No requerido, pero reemplazado
    name: string | undefined,
    plan: string | undefined,
    //No requerido
    toDoList: string | undefined,
    changePasswordToken: string | undefined,
    changePasswordTokenExpires: Date | undefined,
  ) {
    //Obligatorio
    this.email = email;
    this.password = password;
    this.cancelToken = cancelToken;
    this.cancelTokenExpires = cancelTokenExpires;
    //No requerido, pero reemplazado
    this.name = name || "Usuario";
    this.plan = plan || "free";
    //No requerido
    this.toDoList = toDoList;
    this.changePasswordToken = changePasswordToken;
    this.changePasswordTokenExpires = changePasswordTokenExpires;
  };


  //Función para guardar el usuario
  static async save(user: User) {
    //try-catch para verificar errores
    try {
      //Verificamos si el usuario existe
      const { data: exists } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

      //Si existe retornamos un error
      if(exists) return {
        message: "El email ya está en uso",
        error: "Email is already in use",
        status: 409,
      }

      //Generamos los saltrounds para hashear la password
      const salt = await genSalt(10);
      //hasheamos la password
      const hashed = await hash(user.password, salt);
      //Guardamos la contraseña hasheada dentro del usuario
      user.password = hashed;

      //Guardamos al usuario dentro de la base de datos
      const { data: savedUser, error: createUserError } = await supabase
      .from("users")
      .insert([user])
      .select()
      .single();

      //Si hay un error retornamos error
      if(createUserError) return {
        message: "Hubo un error al crear tu usuario",
        error: createUserError.message,
        status: 500,
      }

      //Si todo corre bien mandamos mensaje de éxito
      return {
        message: "Usuario creado con éxito",
        user: savedUser,
        status: 200
      }
    } catch(e: any) {
      //Si ocurre un error lo mostramos
      return {
        message: "Ocurrió un error en el servidor mientras guardabamos tu usuario",
        error: e.message,
        status: 500,
      }
    }
  };


  //Función para verificar si existe el usuario
  static async getDataFromEmail(email: string, password: string) {
     try {
      //Obtenemos los datos del usuario
      const { data: user, error: getUserError } = await supabase
      .from("users")
      .select("id, password")
      .eq("email", email)
      .maybeSingle();

      //Si el usuario no existe mandamos error
      if(!user) return {
        message: "El usuario no existe",
        error: "Not found",
        status: 404,
      };

      //Si ocurre un error retornamos mensaje de error
      if(getUserError) return {
        message: "Ocurrió un error al intentar buscar el usuario",
        error: getUserError,
        status: 500,
      };

      //Verificamos si la contraseña es valida
      const match = compare(password, user.password);
      //Sino son iguales retornamos error
      if(!match) return {
        message: "Las contraseñas no coinciden",
        error: "Unauthorized",
        status: 401,
      };

      //Obtenemos la clave secreta de jwt
      const jwtSecret: string | undefined = process.env.JWT_SECRET;
      //Creamos la variable token
      let token : string | undefined;
      //Si existe la llave JWT guardamos el token
      if(jwtSecret) {
        token = jwt.sign({ id: user.id }, jwtSecret);
      }
      
      //Retornamos mensaje de éxito
      return {
        message: "Sesión iniciada con éxito",
        token: token,
        status: 200,
      }
     } catch(e: any) {
      //Si ocurre un error lo mostramos
      return {
        message: "Ocurrió un error al hacer logIn",
        error: e.message,
        status: 500,
      }
    }
  }
}