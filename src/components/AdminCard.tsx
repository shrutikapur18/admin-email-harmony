import React, { useState } from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminCardHeader } from "./admin/AdminCardHeader";
import { AdminCardDetails } from "./admin/AdminCardDetails";

interface AdminCardProps {
  admin: AdminAccount;
  emails: EmailAccount[];
  onDelete: (admin: AdminAccount) => void;
  onAddEmail: (admin: AdminAccount) => void;
  onDeleteEmail: (email: EmailAccount) => void;
  onUpdate: () => void;
}

export const AdminCard = ({
  admin,
  emails,
  onDelete,
  onAddEmail,
  onDeleteEmail,
  onUpdate,
}: AdminCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<EmailAccount | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<Partial<AdminAccount>>(admin);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("admin_accounts")
        .update({
          ...editedFields,
          payment_method: editedFields.payment_method as "automatic" | "manual"
        })
        .eq("id", admin.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin details updated successfully",
      });
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating admin:", error);
      toast({
        title: "Error",
        description: "Failed to update admin details",
        variant: "destructive",
      });
    }
  };

  const handleFieldChange = (field: keyof AdminAccount, value: any) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 p-1 h-6 w-6"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <div className="flex-1">
            <AdminCardHeader
              admin={admin}
              isEditing={isEditing}
              editedFields={editedFields}
              onEdit={() => setIsEditing(true)}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              onDelete={() => {
                setEmailToDelete(null);
                setShowDeleteDialog(true);
              }}
              onFieldChange={handleFieldChange}
            />
            <AdminCardDetails
              admin={admin}
              isEditing={isEditing}
              editedFields={editedFields}
              onFieldChange={handleFieldChange}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="pl-10 space-y-3 mt-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-900">Secondary Emails</h4>
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
            <div className="space-y-2">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{email.email}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="capitalize">
                        {email.provider}
                      </Badge>
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
              {emails.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No secondary emails added
                </p>
              )}
            </div>
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
