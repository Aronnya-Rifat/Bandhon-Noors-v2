/**
 * Central API client for Bandhon Noors.
 *
 * All frontend communication with FastAPI
 * should go through this file.
 */


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";  


interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}


/**
 * Generic API request handler.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      method:
        options.method || "GET",

      headers: {
        "Content-Type":
          "application/json",

        ...(options.token
          ? {
              Authorization:
                `Bearer ${options.token}`,
            }
          : {}),
      },

      body: options.body
        ? JSON.stringify(options.body)
        : undefined,
    },
  );


  if (!response.ok) {

    const error =
      await response.json()
        .catch(
          () => ({
            detail:
              "Something went wrong",
          }),
        );


    throw new Error(
      error.detail ||
      "API request failed",
    );
  }


  return response.json();
}
