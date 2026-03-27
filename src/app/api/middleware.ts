import { NextResponse, NextRequest } from "next/server";

export function authMiddleware(req: NextRequest) {
  //Valor ingresado
  const apiKey : string = req.headers.get('api-key') || "";
  //Valor requerido
  const validApiKey : string = process.env.API_KEY || "";

  //Verificamos si se ingresó la clave de acceso
  if(!apiKey) return NextResponse.json({ message: "No se ingresó la clave de acceso a la API", error: "Bad request" }, { status: 403 });
  //Verificamos que nuestra API key de validación exista
  if(!validApiKey) return NextResponse.json({ message: "Hubo un error en el servidor", error: "API key validator doesn't exists" }, { status: 500 });
  //Verificamos la validación
  if(apiKey !== validApiKey) return NextResponse.json({ message: "Clave de acceso invalida", error: "Unauthorized" }, { status: 401 });

  return NextResponse.next();
}

//Hacemos que solo funcione con /api
export const config = {
  matcher: '/api/:path*',
};