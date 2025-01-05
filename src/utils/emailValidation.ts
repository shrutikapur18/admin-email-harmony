import { supabase } from "@/integrations/supabase/client";

export const checkEmailExists = async (email: string): Promise<boolean> => {
  console.log("Checking if email exists:", email);
  
  const { data, error } = await supabase
    .from("admin_accounts")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  
  if (error) {
    console.error("Error checking email:", error);
    throw error;
  }
  
  console.log("Email check result:", data);
  return !!data;
};