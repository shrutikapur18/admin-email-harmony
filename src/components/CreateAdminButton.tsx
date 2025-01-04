import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateAdminButtonProps {
  onAdminCreated: () => void;
}

export const CreateAdminButton = ({ onAdminCreated }: CreateAdminButtonProps) => {
  const { toast } = useToast();

  const handleCreateAdmin = async () => {
    try {
      console.log("Creating new admin account...");
      
      // Generate a unique email using timestamp
      const timestamp = new Date().getTime();
      const uniqueEmail = `admin${timestamp}@example.com`;
      
      const { data, error } = await supabase.from("admin_accounts").insert([
        {
          name: "New Admin",
          email: uniqueEmail,
          provider: "google",
          status: "active",
        }
      ]).select().single();

      if (error) {
        console.error("Error creating admin:", error);
        let errorMessage = "Failed to create admin account";
        
        // Provide more specific error messages based on the error type
        if (error.code === '23505') {
          errorMessage = "An admin with this email already exists";
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      console.log("Admin created successfully:", data);
      onAdminCreated();
      toast({
        title: "Success",
        description: "Admin account created successfully",
      });
    } catch (error) {
      console.error("Error in handleCreateAdmin:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleCreateAdmin} className="gap-2">
      <Plus className="h-4 w-4" />
      Add Admin
    </Button>
  );
};