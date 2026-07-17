type CaptureData = {
  plan: "pro" | "enterprise";
  token: string;
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export async function captureController(data: CaptureData) {
  const req = await fetch(
    "/api/payments/capture",
    {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify({
        plan: data.plan
      })
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {
      console.error("Server error:", e.cause);

      return {
        message: e.message,
        status: req.status
      }
    }

    return {
      message: "Server error",
      status: 500
    }
  });

  if(req.status >= 205) {
    console.error("Expected error:", response);
    console.error("Current status:", req);
    
    return {
      message: response.message,
      status: req.status
    };
  }

  return {
    message: response.message,
    status: req.status,
    link: response.checkout_link
  }
}