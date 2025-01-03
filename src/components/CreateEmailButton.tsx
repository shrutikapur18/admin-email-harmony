import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminAccount } from "@/types/admin";

interface CreateEmailButtonProps {
  selectedAdmin: AdminAccount | null;
  onEmailCreated: () => void;
}

export const CreateEmailButton = ({ selectedAdmin, onEmailCreated }: CreateEmailButtonProps) => {
  const { toast } = useToast();

  const handleCreateEmail = async () => {
    if (!selectedAdmin) {
      toast({
        title: "Error",
        description: "Please select an admin first",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Creating new email account...");
      
      const { data, error } = await supabase.from("email_accounts").insert([
        {
          admin_id: selectedAdmin.id,
          email: "secondary@example.com",
          provider: selectedAdmin.provider,
          account_type: "secondary",
          status: "active",
        }
      ]).select().single();

      if (error) {
        console.error("Error creating email:", error);
        toast({
          title: "Error",
          description: "Failed to create email account",
          variant: "destructive",
        });
        return;
      }

      console.log("Email account created successfully:", data);
      onEmailCreated();
      toast({
        title: "Success",
        description: "Email account created successfully",
      });
    } catch (error) {
      console.error("Error in handleCreateEmail:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleCreateEmail} className="gap-2">
      <Plus className="h-4 w-4" />
      Add Email
    </Button>
  );
};