/// <reference types="vite/client" />

// Environment variables interface for type safety and documentation
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_HF_ACCESS_TOKEN?: string // Optional - users can provide their own
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
