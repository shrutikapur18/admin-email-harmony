import React from "react";
import { EmailAccount } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmailListProps {
  emails: EmailAccount[];
  className?: string;
}

const EmailList: React.FC<EmailListProps> = ({ emails, className }) => {
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
                <span className="text-xs text-gray-500">
                  Created: {new Date(email.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EmailList;