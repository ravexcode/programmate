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
          "prismaflow-api-key": process.env.NEXT_PUBLIC_API_KEY!
        },
        body
      }
    )
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