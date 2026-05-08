//Next imports
import { NextResponse } from "next/server";

//Types imports
import { type PostgrestError } from "@supabase/supabase-js";
import { type ErrorResponse } from "resend";

function errorTemplate(
  content: string,
  error: string | Error | unknown | PostgrestError,
  status: number
){
  return NextResponse.json({
    message: content,
    error: error
  }, {
    status
  });
}

export function serverErrorHandler(error: unknown){
  if(error instanceof Error) {
    return errorTemplate(
      error.message,
      error,
      500);
  }

  return errorTemplate(
    "Server error",
    error,
    500
  );
}

export function supabaseErrorHandler(error: PostgrestError) {
  return errorTemplate(
    error.message,
    error,
    502
  );
}

export function notFoundErrorHandler(content: string) {
  return errorTemplate(
    content,
    "Not Found",
    404
  );
}

export function unauthorizedErrorHandler(content: string) {
  return errorTemplate(
    content,
    "Unauthorized",
    401
  );
}

export function badRequestErrorHandler() {
  return errorTemplate(
    "Missing required fields",
    "Bad Request",
    400
  );
}

export function resendErrorHandler(error: ErrorResponse) {
  return errorTemplate(
    "An error has happened in resend",
    error,
    503
  );
}