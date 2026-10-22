// zod/mini keeps env validation out of the main bundle's weight; forms use full zod in lazy chunks.
import * as z from 'zod/mini';

const envSchema = z.object({
  VITE_APP_NAME: z._default(z.string(), 'RedRelay'),
  VITE_API_URL: z.url(),
  VITE_API_ORIGIN: z.url(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(`Invalid frontend env (see .env.example):\n${z.prettifyError(parsed.error)}`);
}

/** Validated env. The only place import.meta.env is read. */
export const env = {
  appName: parsed.data.VITE_APP_NAME,
  apiUrl: parsed.data.VITE_API_URL,
  apiOrigin: parsed.data.VITE_API_ORIGIN,
  isDev: import.meta.env.DEV,
} as const;
