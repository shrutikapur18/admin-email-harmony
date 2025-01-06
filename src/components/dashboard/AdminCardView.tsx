import React from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";

interface AdminCardViewProps {
  admins: AdminAccount[];
  emails: EmailAccount[];
  onSelectAdmin: (admin: AdminAccount) => void;
}

export const AdminCardView = ({
  admins,
  emails,
  onSelectAdmin,
}: AdminCardViewProps) => {
  const getEmailsForAdmin = (adminId: string) => {
    return emails.filter(email => email.admin_id === adminId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {admins.map((admin) => (
        <Card key={admin.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{admin.name}</h3>
                <p className="text-sm text-muted-foreground">{admin.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSelectAdmin(admin)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Billing Date:</span>
                <p className="font-medium">
                  {admin.billing_date
                    ? format(new Date(admin.billing_date), "PP")
                    : "Not set"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <p className="font-medium">${admin.billing_amount || "0"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{admin.provider}</Badge>
              <Badge variant="outline" className="capitalize">
                {admin.payment_method || "Not set"}
              </Badge>
              <Badge>
                {getEmailsForAdmin(admin.id).length} Secondary Email
                {getEmailsForAdmin(admin.id).length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};