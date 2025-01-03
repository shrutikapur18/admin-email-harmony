import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { useToast } from "@/components/ui/use-toast";

export function useAdminData(selectedAdminId: string | null) {
  const { toast } = useToast();

  const { data: admins = [], refetch: refetchAdmins } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching admins:", error);
        toast({
          title: "Error",
          description: "Failed to fetch admin accounts",
          variant: "destructive",
        });
        return [];
      }
      return data as AdminAccount[];
    },
  });

  const { data: emails = [], refetch: refetchEmails } = useQuery({
    queryKey: ["emails", selectedAdminId],
    queryFn: async () => {
      let query = supabase
        .from("email_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedAdminId) {
        query = query.eq("admin_id", selectedAdminId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching emails:", error);
        toast({
          title: "Error",
          description: "Failed to fetch email accounts",
          variant: "destructive",
        });
        return [];
      }
      return data as EmailAccount[];
    },
  });

  return {
    admins,
    emails,
    refetchAdmins,
    refetchEmails,
  };
}