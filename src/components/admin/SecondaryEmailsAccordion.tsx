import React, { useState } from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";
import { SecondaryEmailEditor } from "./SecondaryEmailEditor";
import { SecondaryEmailDisplay } from "./SecondaryEmailDisplay";

interface SecondaryEmailsAccordionProps {
  admin: AdminAccount;
  emails: EmailAccount[];
  onUpdate: () => void;
}

export const SecondaryEmailsAccordion = ({
  admin,
  emails,
  onUpdate,
}: SecondaryEmailsAccordionProps) => {
  const [addingSecondaryEmail, setAddingSecondaryEmail] = useState<string | null>(null);
  const [newSecondaryEmail, setNewSecondaryEmail] = useState("");
  const [newProvider, setNewProvider] = useState<"google" | "microsoft">("google");
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [emailToDelete, setEmailToDelete] = useState<EmailAccount | null>(null);
  const { toast } = useToast();

  const handleAddSecondaryEmail = async (email: string, provider: "google" | "microsoft") => {
    if (emails.length >= 50) {
      toast({
        title: "Error",
        description: "Maximum limit of 50 secondary emails reached",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("email_accounts").insert({
        admin_id: admin.id,
        email: email,
        provider: provider,
        status: "active",
        account_type: "secondary",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Secondary email added successfully",
      });
      setAddingSecondaryEmail(null);
      onUpdate();
    } catch (error) {
      console.error("Error adding secondary email:", error);
      toast({
        title: "Error",
        description: "Failed to add secondary email",
        variant: "destructive",
      });
    }
  };

  const handleEditEmail = async (email: EmailAccount, newEmail: string, newProvider: "google" | "microsoft") => {
    try {
      const { error } = await supabase
        .from("email_accounts")
        .update({
          email: newEmail,
          provider: newProvider,
        })
        .eq("id", email.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Secondary email updated successfully",
      });
      setEditingEmailId(null);
      onUpdate();
    } catch (error) {
      console.error("Error updating secondary email:", error);
      toast({
        title: "Error",
        description: "Failed to update secondary email",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmail = async () => {
    if (!emailToDelete) return;

    try {
      const { error } = await supabase
        .from("email_accounts")
        .delete()
        .eq("id", emailToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Secondary email deleted successfully",
      });
      setEmailToDelete(null);
      onUpdate();
    } catch (error) {
      console.error("Error deleting secondary email:", error);
      toast({
        title: "Error",
        description: "Failed to delete secondary email",
        variant: "destructive",
      });
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="secondary-emails">
        <AccordionTrigger>Secondary Emails ({emails.length})</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {emails.map((email) => (
              <div
                key={email.id}
                className="p-2 bg-muted rounded-md"
              >
                {editingEmailId === email.id ? (
                  <SecondaryEmailEditor
                    email={email.email}
                    provider={email.provider as "google" | "microsoft"}
                    onSave={(newEmail, newProvider) => handleEditEmail(email, newEmail, newProvider)}
                    onCancel={() => setEditingEmailId(null)}
                  />
                ) : (
                  <SecondaryEmailDisplay
                    email={email}
                    onEdit={() => setEditingEmailId(email.id)}
                    onDelete={() => setEmailToDelete(email)}
                  />
                )}
              </div>
            ))}
            {addingSecondaryEmail === admin.id ? (
              <SecondaryEmailEditor
                email=""
                provider="google"
                onSave={handleAddSecondaryEmail}
                onCancel={() => setAddingSecondaryEmail(null)}
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => setAddingSecondaryEmail(admin.id)}
                disabled={emails.length >= 50}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Secondary Email
              </Button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      <DeleteConfirmationDialog
        isOpen={emailToDelete !== null}
        onClose={() => setEmailToDelete(null)}
        onConfirm={handleDeleteEmail}
        title="Delete Secondary Email"
        description="Are you sure you want to delete this secondary email? This action cannot be undone."
      />
    </Accordion>
  );
};