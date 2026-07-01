import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a safe mock client to prevent crash when .env credentials are not configured yet
const makeMockSupabase = () => {
  console.warn(
    'Supabase credentials missing. PlannersHub is running in mock offline mode. Configure your .env file to enable authentication and DB features.'
  );
  
  const mockQuery = {
    eq: () => mockQuery,
    order: () => mockQuery,
    limit: () => mockQuery,
    single: async () => ({ data: null, error: new Error('Supabase not configured') }),
    then: (resolve) => resolve({ data: [], error: null }),
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signInWithPassword: async () => {
        throw new Error('Supabase credentials are not configured. Please add them to your .env file.');
      },
      signUp: async () => {
        throw new Error('Supabase credentials are not configured. Please add them to your .env file.');
      },
      signOut: async () => {},
      updateUser: async () => {
        throw new Error('Supabase credentials are not configured. Please add them to your .env file.');
      },
    },
    from: () => mockQuery,
    isMock: true,
  };
};

let supabaseInstance;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  supabaseInstance = makeMockSupabase();
} else {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    supabaseInstance = makeMockSupabase();
  }
}

export const supabase = supabaseInstance;
export const isSupabaseConfigured = !supabase.isMock;
