import React, { useState } from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Plus, Save, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";

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
  const [editedEmail, setEditedEmail] = useState("");
  const [editedProvider, setEditedProvider] = useState<"google" | "microsoft">("google");
  const [emailToDelete, setEmailToDelete] = useState<EmailAccount | null>(null);
  const { toast } = useToast();

  const handleAddSecondaryEmail = async () => {
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
        email: newSecondaryEmail,
        provider: newProvider,
        status: "active",
        account_type: "secondary",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Secondary email added successfully",
      });
      setAddingSecondaryEmail(null);
      setNewSecondaryEmail("");
      setNewProvider("google");
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

  const handleEditEmail = async (email: EmailAccount) => {
    try {
      const { error } = await supabase
        .from("email_accounts")
        .update({
          email: editedEmail,
          provider: editedProvider,
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
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                {editingEmailId === email.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Select
                      value={editedProvider}
                      onValueChange={(value: "google" | "microsoft") => setEditedProvider(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="microsoft">Microsoft</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={() => handleEditEmail(email)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingEmailId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium">{email.email}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{email.provider}</Badge>
                        <Badge
                          variant={email.status === "active" ? "default" : "secondary"}
                        >
                          {email.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingEmailId(email.id);
                          setEditedEmail(email.email);
                          setEditedProvider(email.provider as "google" | "microsoft");
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEmailToDelete(email)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {addingSecondaryEmail === admin.id ? (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={newSecondaryEmail}
                  onChange={(e) => setNewSecondaryEmail(e.target.value)}
                  placeholder="Enter secondary email"
                  className="flex-1"
                />
                <Select
                  value={newProvider}
                  onValueChange={(value: "google" | "microsoft") => setNewProvider(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="microsoft">Microsoft</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleAddSecondaryEmail}
                >
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setAddingSecondaryEmail(null);
                    setNewSecondaryEmail("");
                  }}
                >
                  Cancel
                </Button>
              </div>
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