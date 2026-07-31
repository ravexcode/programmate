import { Resend } from "resend";

function getResendKey() {
  const key = process.env.RESEND_API_KEY;

  if(!key) throw new Error("Resend API Key not set");

  return key;
}

export const resend = new Resend(getResendKey());