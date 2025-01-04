import React, { useState } from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Trash2, Plus } from "lucide-react";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface AdminCardProps {
  admin: AdminAccount;
  emails: EmailAccount[];
  onDelete: (admin: AdminAccount) => void;
  onAddEmail: (admin: AdminAccount) => void;
  onDeleteEmail: (email: EmailAccount) => void;
}

export const AdminCard = ({
  admin,
  emails,
  onDelete,
  onAddEmail,
  onDeleteEmail,
}: AdminCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<EmailAccount | null>(null);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <div>
              <h3 className="text-lg font-semibold">{admin.name}</h3>
              <p className="text-sm text-gray-600">{admin.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={admin.status === "active" ? "default" : "secondary"}>
              {admin.status}
            </Badge>
            <Badge variant="outline">{admin.provider}</Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="pl-8 space-y-2">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Secondary Emails</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddEmail(admin)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Email
              </Button>
            </div>
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
                      variant={email.status === "active" ? "default" : "secondary"}
                    >
                      {email.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEmailToDelete(email);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setEmailToDelete(null);
        }}
        onConfirm={() => {
          if (emailToDelete) {
            onDeleteEmail(emailToDelete);
          } else {
            onDelete(admin);
          }
          setShowDeleteDialog(false);
          setEmailToDelete(null);
        }}
        title={`Delete ${emailToDelete ? "Email Account" : "Admin Account"}`}
        description={`Are you sure you want to delete this ${
          emailToDelete ? "email" : "admin"
        } account? This action cannot be undone.`}
      />
    </Card>
  );
};