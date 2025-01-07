import React, { useState } from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Trash2, Plus, Edit2, Save, X } from "lucide-react";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [editedFields, setEditedFields] = useState(admin);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("admin_accounts")
        .update(editedFields)
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

  const handleDeleteAdmin = async () => {
    try {
      const { error } = await supabase
        .from("admin_accounts")
        .delete()
        .eq("id", admin.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin account deleted successfully",
      });
      onDelete(admin);
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast({
        title: "Error",
        description: "Failed to delete admin account",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
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
            <div className="space-y-3">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedFields.name}
                    onChange={(e) => setEditedFields({ ...editedFields, name: e.target.value })}
                    placeholder="Admin Name"
                  />
                  <Input
                    value={editedFields.email}
                    onChange={(e) => setEditedFields({ ...editedFields, email: e.target.value })}
                    placeholder="Email"
                    type="email"
                  />
                  <Select
                    value={editedFields.provider}
                    onValueChange={(value) => setEditedFields({ ...editedFields, provider: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="microsoft">Microsoft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={editedFields.billing_date || ""}
                    onChange={(e) => setEditedFields({ ...editedFields, billing_date: e.target.value })}
                  />
                  <Select
                    value={editedFields.payment_method || "automatic"}
                    onValueChange={(value) => setEditedFields({ ...editedFields, payment_method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={editedFields.billing_amount || ""}
                    onChange={(e) => setEditedFields({ ...editedFields, billing_amount: parseFloat(e.target.value) })}
                    placeholder="Billing Amount"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">{admin.name}</h3>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="text-sm">
                      <span className="text-gray-500">Billing Date:</span>
                      <p className="font-medium text-gray-900">
                        {admin.billing_date ? format(new Date(admin.billing_date), 'PP') : 'Not set'}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Payment Method:</span>
                      <p className="font-medium text-gray-900 capitalize">
                        {admin.payment_method || 'Not set'}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Billing Amount:</span>
                      <p className="font-medium text-gray-900">
                        ${admin.billing_amount || '0'}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Secondary Accounts:</span>
                      <p className="font-medium text-gray-900">
                        {emails.length}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={admin.status === "active" ? "default" : "secondary"}>
              {admin.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {admin.provider}
            </Badge>
            {isEditing ? (
              <>
                <Button variant="ghost" size="icon" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEmailToDelete(null);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
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
            handleDeleteAdmin();
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