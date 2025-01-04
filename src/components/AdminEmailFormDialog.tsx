import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminAccount } from "@/types/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminEmailFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: AdminAccount | null;
  onEmailsAdded: () => void;
}

export const AdminEmailFormDialog = ({
  open,
  onOpenChange,
  admin,
  onEmailsAdded,
}: AdminEmailFormDialogProps) => {
  const { toast } = useToast();
  const [emails, setEmails] = useState<Array<{ email: string; provider: "google" | "microsoft" }>>([
    { email: "", provider: "google" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddEmail = () => {
    setEmails([...emails, { email: "", provider: "google" }]);
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = { ...newEmails[index], email: value };
    setEmails(newEmails);
  };

  const handleProviderChange = (index: number, value: "google" | "microsoft") => {
    const newEmails = [...emails];
    newEmails[index] = { ...newEmails[index], provider: value };
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;

    setIsSubmitting(true);
    try {
      const validEmails = emails.filter((email) => email.email.trim() !== "");
      
      const { error } = await supabase
        .from("email_accounts")
        .insert(
          validEmails.map((email) => ({
            admin_id: admin.id,
            email: email.email,
            provider: email.provider,
            status: "active",
            account_type: "secondary",
          }))
        );

      if (error) throw error;

      toast({
        title: "Success",
        description: "Secondary emails added successfully",
      });
      
      onEmailsAdded();
      setEmails([{ email: "", provider: "google" }]);
    } catch (error) {
      console.error("Error adding secondary emails:", error);
      toast({
        title: "Error",
        description: "Failed to add secondary emails",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Secondary Emails</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <Label>Email {index + 1}</Label>
                  <Input
                    type="email"
                    value={email.email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="w-40">
                  <Label>Provider</Label>
                  <Select
                    value={email.provider}
                    onValueChange={(value: "google" | "microsoft") =>
                      handleProviderChange(index, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="microsoft">Microsoft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-8"
                  onClick={() => handleRemoveEmail(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddEmail}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Email
          </Button>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setEmails([{ email: "", provider: "google" }]);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Emails"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};