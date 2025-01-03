import React from "react";
import { EmailAccount } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EmailListProps {
  emails: EmailAccount[];
  className?: string;
  onDeleteEmail: () => void;
}

const EmailList: React.FC<EmailListProps> = ({
  emails,
  className,
  onDeleteEmail,
}) => {
  const { toast } = useToast();

  const handleDelete = async (email: EmailAccount) => {
    const { error } = await supabase
      .from("email_accounts")
      .delete()
      .eq("id", email.id);

    if (error) {
      console.error("Error deleting email:", error);
      toast({
        title: "Error",
        description: "Failed to delete email account",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Email account deleted successfully",
    });
    onDeleteEmail();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {emails.map((email) => (
        <Card key={email.id} className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{email.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={email.status === "active" ? "default" : "secondary"}>
                  {email.status}
                </Badge>
                <Badge variant="outline">{email.provider}</Badge>
                <Badge variant="outline">{email.account_type}</Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(email)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EmailList;