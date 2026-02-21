export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET missing in .env")
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET missing in .env")
}