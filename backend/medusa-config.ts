import { defineConfig } from "@medusajs/framework/utils"

const requireEnv = (key: string): string => {
  const value = process.env[key]

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Set ${key} before starting the Medusa backend.`
    )
  }

  return value
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: requireEnv("DATABASE_URL"),
    // Optional. If not provided, session data is stored in-memory.
    redisUrl: process.env.REDIS_URL || undefined,
    http: {
      storeCors: requireEnv("STORE_CORS"),
      adminCors: requireEnv("ADMIN_CORS"),
      authCors: requireEnv("AUTH_CORS"),
      jwtSecret: requireEnv("JWT_SECRET"),
      cookieSecret: requireEnv("COOKIE_SECRET"),
    },
  },
})
