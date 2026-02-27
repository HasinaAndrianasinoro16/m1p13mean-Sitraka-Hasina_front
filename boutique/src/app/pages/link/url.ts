export const BASE_URL = "https://m1p13mean-sitraka-hasina-backend.vercel.app/api";
// export const BASE_URL = "http://localhost:5000/api"

export function getAPIUrl(path: string = ''): string {
  return `${BASE_URL}/${path}`;
}

