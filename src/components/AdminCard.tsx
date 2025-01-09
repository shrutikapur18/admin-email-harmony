import React, { useState } from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminCardHeader } from "./admin/AdminCardHeader";
import { AdminCardDetails } from "./admin/AdminCardDetails";
import { SecondaryEmailsAccordion } from "./admin/SecondaryEmailsAccordion";

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
              onDelete={() => setShowDeleteDialog(true)}
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
          <SecondaryEmailsAccordion
            admin={admin}
            emails={emails}
            onUpdate={onUpdate}
          />
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          onDelete(admin);
          setShowDeleteDialog(false);
        }}
        title="Delete Admin Account"
        description="Are you sure you want to delete this admin account? This action cannot be undone."
      />
    </Card>
  );
};