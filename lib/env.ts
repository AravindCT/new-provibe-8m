// Validate environment variables at startup
function validateEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    console.error(`Missing required environment variable: ${name}`)
    // For development, provide helpful error message
    if (process.env.NODE_ENV === "development") {
      console.log(`Please add ${name} to your environment variables`)
    }
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: validateEnvVar("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: validateEnvVar(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
}

// Log environment status in development
if (process.env.NODE_ENV === "development") {
  console.log("Environment variables loaded:", {
    SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
    SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
    SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
    OPENAI_API_KEY: env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing",
  })
}
