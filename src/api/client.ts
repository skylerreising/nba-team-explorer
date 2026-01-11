const API_BASE_URL = "https://api.balldontlie.io/v1";
const API_KEY = import.meta.env.VITE_API_KEY;

export async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: API_KEY,
    },
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
