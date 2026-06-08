import { showSnackbar } from "@/components/ui/snackbar";

export async function fetchTemplate(
  url: string,
  method: string,
  snackbar: React.RefObject<null>,
  headers?: any,
  body?: string,
) {
  try {
    const res = await fetch(
      url,
      {
        method,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!
        },
        body
      }
    )

    const data = await res.json();

    if(res.status === 200 || res.status === 201) {
      return showSnackbar(
        data.message,
        "valid",
        snackbar
      );
    }
    
    return showSnackbar(
      data.message || "Server error",
      (res.status >= 500 ? "critic" : "warn"),
      snackbar
    );
  } catch(e: unknown) {
    if(e instanceof Error) {
      return showSnackbar(
        e.message,
        "critic",
        snackbar
      )
    };

    console.error(e);
    return showSnackbar(
      "Server error",
      "critic",
      snackbar
    )
  }
}