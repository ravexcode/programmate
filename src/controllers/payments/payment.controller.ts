import { captureRequest } from "@/client/payment";

type CaptureData = {
  plan: "pro" | "enterprise";
  token: string;
}

export async function captureController(data: CaptureData) {
  const req = await captureRequest(data.token, data.plan);

  if(req.status >= 205) {
    return {
      message: req.data.message,
      status: req.status
    };
  }

  return {
    message: req.data.message,
    status: req.status,
    link: req.data.checkout_link
  }
}
