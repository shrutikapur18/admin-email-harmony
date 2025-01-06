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
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();

  const handleAddSecondaryEmail = async (adminId: string) => {
    try {
      const { error } = await supabase.from("email_accounts").insert({
        admin_id: adminId,
        email: newSecondaryEmail,
        provider: "google",
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

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="secondary-emails">
        <AccordionTrigger>Secondary Emails</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {emails.map((email) => (
              <div
                key={email.id}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div>
                  <p className="font-medium">{email.email}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{email.provider}</Badge>
                    <Badge
                      variant={
                        email.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {email.status}
                    </Badge>
                  </div>
                </div>
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
                <Button
                  size="sm"
                  onClick={() => handleAddSecondaryEmail(admin.id)}
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
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Secondary Email
              </Button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};