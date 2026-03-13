export const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"
}

export const getDefaultCountryCode = () => {
  return process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
}
