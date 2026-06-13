//Next imports
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Handlers imports
import {
  badRequestErrorHandler,
  errorTemplate,
  serverErrorHandler,
  unauthorizedErrorHandler
} from "@api/handlers"

export async function GET( req: NextRequest ){
  try {
    const headers_list = await headers();
    const provider_api_key = headers_list.get("provider-api-key");
    const provider_name = headers_list.get("provider");
    const token = headers_list.get("Authorization");

    if(!token) return unauthorizedErrorHandler("Authorization token not inserted");
    
    if(!provider_api_key || !provider_name) return badRequestErrorHandler();

    switch (provider_name) {
      //----------- GOOGLE VALIDATOR -----------
      case "google":
        const google_res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${provider_api_key}`,
          {
            method: "GET"
          }
        )
        .catch((e) => {
          return serverErrorHandler(e);
        });

        if(google_res.ok) {
          const data = await google_res.json();
          return NextResponse.json({
            message: "Google AI Api key validated",
            models: data.models
          })
        }

        return errorTemplate(
          "Google AI Api key error",
          "Provider error",
          500
        );

      //----------- CLAUDE VALIDATOR -----------
      case "claude":
        const claude_res = await fetch(
          `https://api.anthropic.com/v1/messages`,
          {
            method: "POST",
            headers: {
              'X-API-Key': provider_api_key,
              'Anthropic-Version': '2023-06-01',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'claude-3-5-sonnet-20240620',
              max_tokens: 1,
              messages: [{ role: 'user', content: 'Ping' }],
            }),
          }
        )
        .catch((e) => {
          return serverErrorHandler(e);
        });

        if(claude_res.ok) {
          const data = await claude_res.json();
          return NextResponse.json({
            message: "Claude AI Api key validated"
          })
        }

        return errorTemplate(
          "Claude AI Api key error",
          "Provider error",
          500
        );
        break;
        
      default:
        return errorTemplate(
          "Method not supported",
          "Conflict",
          409
        );
    }
  } catch(e) {
    return serverErrorHandler(e);
  }
}