import { createBrowserClient } from '@supabase/ssr';

// For Client Components
export const createBrowserClientInstance = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Backwards compatibility for existing imports
export const createBrowserClientSub = createBrowserClientInstance;
export { createBrowserClientInstance as createBrowserClient };
