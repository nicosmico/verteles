export class HttpError extends Error {
  constructor(readonly status: number) {
    super(`HTTP ${status}`);
  }
}

export async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new HttpError(response.status);
  return response.text();
}
