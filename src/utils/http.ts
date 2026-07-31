const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export function buildHeaders(
  token?: string,
  extra?: Record<string, string>
) {
  return {
    "Content-Type": "application/json",
    "nexzero-api-key": API_KEY,
    ...(token ? { Authorization: token } : {}),
    ...extra,
  };
}

export async function parseResponse(req: Response) {
  try {
    return await req.json();
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { message: e.message, status: req.status };
    }
    return { message: "Server error", status: 500 };
  }
}

type ApiFetchOptions = {
  method?: string;
  token?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function apiFetch(
  url: string,
  options: ApiFetchOptions = {}
) {
  const req = await fetch(url, {
    method: options.method || "GET",
    headers: buildHeaders(options.token, options.headers),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const data = await parseResponse(req);

  return {
    status: req.status,
    data,
  };
}
