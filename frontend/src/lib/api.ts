/**
 * Central API client for Bandhon Noors.
 *
 * All frontend communication with FastAPI
 * should go through this file.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic API request handler.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const requestBody: BodyInit | undefined = options.body
    ? isFormData
      ? (options.body as FormData)
      : JSON.stringify(options.body)
    : undefined;
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || "GET",

    headers: {
      ...(!isFormData
        ? {
            "Content-Type":
              "application/json",
          }
        : {}),

      ...(options.token
        ? {
            Authorization:
              `Bearer ${options.token}`,
          }
        : {}),
    },

    body: requestBody,
  });

  if (!response.ok) {
    const error: unknown = await response.json().catch(() => null);

    const message =
      typeof error === "object" &&
      error !== null &&
      "detail" in error &&
      typeof error.detail === "string"
        ? error.detail
        : "API request failed";

    throw new ApiError(message, response.status);
  }

  return response.json();
}

export function getApiAssetUrl(
  path: string,
): string {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_URL}/${path.replace(
    /^\/+/,
    "",
  )}`;
}
