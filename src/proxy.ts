//Middleware made for prevent other requests

//Next imports
import { type NextRequest, NextResponse } from "next/server";

//Middleware
export function proxy(req: NextRequest) {
  //Ignore webhooks api
  const path = req.nextUrl.pathname;

  //Ignore webhooks api path
  if(path.startsWith('/api/webhooks')) return NextResponse.next();

  //Gets the API Key
  const api_key = req.headers.get("nexzero-api-key");

  //Verifies if the API Key in server exists
  const valid_api_key = process.env.API_KEY;
  if(!valid_api_key) throw new Error("Api key is not declared in .env or .env.local");

  //Verifies if key inserted is valid
  if(api_key !== valid_api_key) return NextResponse.json({
    message: "Api key invalid",
    error: "Unauthorized"
  }, {
    status: 401
  });

  //If all is ok returns to the route
  return NextResponse.next();
}

//Middleware only for API
export const config = {
  matcher: '/api/:path*',
};