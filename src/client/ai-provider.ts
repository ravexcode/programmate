/**
 * Raw transport for external AI provider APIs.
 * These calls do NOT use the NexZero API key headers,
 * so they use plain fetch instead of apiFetch.
 */
export async function validateProviderRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
) {
  return fetch(url, {
    method,
    headers,
    body,
  });
}

export async function listProviderModelsRequest(
  url: string,
  headers: Record<string, string>
) {
  return fetch(url, {
    method: "GET",
    headers,
  });
}
