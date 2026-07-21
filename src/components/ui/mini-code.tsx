//React hooks imports
import { useState } from "react";

//Containers imports
import CodeText from "../containers/code";

export default function MiniCode() {
  const [ ex ] = useState(`//Next imports
import { NextResponse } from "next/server";

//Types imports
import { type PostgrestError } from "@supabase/supabase-js";
import { type ErrorResponse } from "resend";

export function errorTemplate(
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
`)

  return (
    <div
    className="w-full max-w-220 aspect-video rounded-sm border border-neutral-900 bg-neutral-950 mt-5 z-10 p-5">
      <CodeText
      text={ex} />
    </div>
  )
}