export class API {
  static prependBaseUrl(url: string): string {
    const baseUrl = import.meta.env.VITE_API_URL;
    const path = url.startsWith("/") ? url.slice(1) : url;
    return `${baseUrl}/v0/${path}`;
  }

  static async get<T = unknown>(url: string): Promise<T> {
    const response = await fetch(this.prependBaseUrl(url));
    return response.json();
  }

  static async post<T = unknown>(url: string, body?: unknown): Promise<T> {
    const response = await fetch(this.prependBaseUrl(url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.json();
  }
}

export default API;
