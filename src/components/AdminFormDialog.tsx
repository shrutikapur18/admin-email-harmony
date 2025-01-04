import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SecondaryEmailsSection } from "./SecondaryEmailsSection";
import { checkEmailExists } from "@/utils/emailValidation";

interface AdminFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdminCreated: () => void;
}

export const AdminFormDialog = ({ open, onOpenChange, onAdminCreated }: AdminFormDialogProps) => {
  const { toast } = useToast();
  const [adminName, setAdminName] = React.useState("");
  const [primaryEmail, setPrimaryEmail] = React.useState("");
  const [provider, setProvider] = React.useState<"google" | "microsoft">("google");
  const [secondaryEmails, setSecondaryEmails] = React.useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAddSecondaryEmail = () => {
    if (secondaryEmails.length < 20) {
      setSecondaryEmails([...secondaryEmails, ""]);
    }
  };

  const handleRemoveSecondaryEmail = (index: number) => {
    setSecondaryEmails(secondaryEmails.filter((_, i) => i !== index));
  };

  const handleSecondaryEmailChange = (index: number, value: string) => {
    const newEmails = [...secondaryEmails];
    newEmails[index] = value;
    setSecondaryEmails(newEmails);
  };

  const resetForm = () => {
    setAdminName("");
    setPrimaryEmail("");
    setProvider("google");
    setSecondaryEmails([""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Checking if email exists...");
      const emailExists = await checkEmailExists(primaryEmail);
      
      if (emailExists) {
        toast({
          title: "Error",
          description: "An admin with this email already exists",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log("Creating new admin account...");
      
      // Create admin account
      const { data: adminData, error: adminError } = await supabase
        .from("admin_accounts")
        .insert([{
          name: adminName,
          email: primaryEmail,
          provider,
          status: "active",
        }])
        .select()
        .single();

      if (adminError) {
        console.error("Error creating admin:", adminError);
        toast({
          title: "Error",
          description: "Failed to create admin account",
          variant: "destructive",
        });
        return;
      }

      console.log("Admin created successfully:", adminData);

      // Create secondary email accounts
      const validSecondaryEmails = secondaryEmails.filter(email => email.trim() !== "");
      
      if (validSecondaryEmails.length > 0) {
        const { error: emailError } = await supabase
          .from("email_accounts")
          .insert(
            validSecondaryEmails.map(email => ({
              admin_id: adminData.id,
              email,
              provider,
              account_type: "secondary",
              status: "active",
            }))
          );

        if (emailError) {
          console.error("Error creating secondary emails:", emailError);
          toast({
            title: "Warning",
            description: "Admin created but failed to create some secondary emails",
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Success",
        description: "Admin account created successfully",
      });
      
      onAdminCreated();
      onOpenChange(false);
      resetForm();
      
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Create a new admin account with primary and secondary email addresses.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adminName">Admin Name</Label>
                <Input
                  id="adminName"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryEmail">Primary Email</Label>
                <Input
                  id="primaryEmail"
                  type="email"
                  value={primaryEmail}
                  onChange={(e) => setPrimaryEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select value={provider} onValueChange={(value: "google" | "microsoft") => setProvider(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="microsoft">Microsoft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <SecondaryEmailsSection
              emails={secondaryEmails}
              onAdd={handleAddSecondaryEmail}
              onRemove={handleRemoveSecondaryEmail}
              onChange={handleSecondaryEmailChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};