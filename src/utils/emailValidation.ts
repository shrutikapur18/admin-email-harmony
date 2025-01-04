import { supabase } from "@/integrations/supabase/client";

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const { data } = await supabase
    .from("admin_accounts")
    .select("email")
    .eq("email", email)
    .single();
  
  return !!data;
};