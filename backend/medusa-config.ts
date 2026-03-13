import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

if (!process.env.JWT_SECRET) {
  throw new Error(
    "Missing required environment variable: JWT_SECRET. Set JWT_SECRET before starting the Medusa backend."
  )
}

if (!process.env.COOKIE_SECRET) {
  throw new Error(
    "Missing required environment variable: COOKIE_SECRET. Set COOKIE_SECRET before starting the Medusa backend."
  )
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  }
})
