//Imports
import { NextResponse, NextRequest } from "next/server";
import User from "@/app/lib/user";

//función de LogIn
export async function POST(req: NextRequest) {
  try {
    //Obtenemos los datos
    const { email, password } = await req.json();

    //Sino se ingresan datos retornamos error
    if(!email || !password) return NextResponse.json({ message: "No se ingresaron los datos requeridos", error: "Bad request" }, { status: 403 });

    //Hacemos logIn del usuario
    const logIn = await User.getDataFromEmail(email, password);

    //Si ocurre un error en el login retornamos mensaje de error
    if(logIn.error) {
      return NextResponse.json({message: logIn.message, error: logIn.error}, { status: logIn.status });
    }

    //Si todo corre bien retornamos mensaje de éxito
    return NextResponse.json({message: logIn.message, token: logIn.token}, { status: logIn.status });
  } catch(error: any) {
    //Si ocurre un error retornamos error
    return NextResponse.json({ message: "Hubo un error en el servidor", error: error.message }, { status: 500 });
  }
}