// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pofjsgcgnvongqlfeneb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZmpzZ2NnbnZvbmdxbGZlbmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5Mjk0NzksImV4cCI6MjA1MTUwNTQ3OX0.2lWsSxiqPwU5ueDoNAUGc7JIuVpaMLG3KDUtOtQiJFA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);