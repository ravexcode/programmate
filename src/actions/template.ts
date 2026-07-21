import { showSnackbar } from "@/components/ui/snackbar";

export async function fetchTemplate(
  url: string,
  method: string,
  snackbar: React.RefObject<null>,
  headers?: Record<string, string>,
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
          "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!
        },
        body
      }
    )

    const data = await res.json();

    if(res.status === 200 || res.status === 201) {
      showSnackbar(
        data.message,
        "valid",
        snackbar
      );
      return data;
    }
    
    showSnackbar(
      data.message || "Server error",
      (res.status >= 500 ? "critic" : "warn"),
      snackbar
    );
    return;
  } catch(e: unknown) {
    if(e instanceof Error) {
      showSnackbar(
        e.message,
        "critic",
        snackbar
      );
      return;
    };

    console.error(e);
    showSnackbar(
      "Server error",
      "critic",
      snackbar
    );
    return;
  }
}