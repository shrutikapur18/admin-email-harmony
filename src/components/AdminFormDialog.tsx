import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
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
      
      // Reset form
      setAdminName("");
      setPrimaryEmail("");
      setProvider("google");
      setSecondaryEmails([""]);
      
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Secondary Email Accounts</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSecondaryEmail}
                  disabled={secondaryEmails.length >= 20}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Email
                </Button>
              </div>
              
              <div className="space-y-2">
                {secondaryEmails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => handleSecondaryEmailChange(index, e.target.value)}
                      placeholder={`Secondary Email ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveSecondaryEmail(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Admin
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};