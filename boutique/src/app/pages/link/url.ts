export const BASE_URL = "http://localhost:5000/api";

export function getAPIUrl(path: string = ''): string {
  return `${BASE_URL}/${path}`;
}

