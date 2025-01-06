import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminTableActions } from "./admin/AdminTableActions";
import { AdminTableRow } from "./admin/AdminTableRow";

interface AdminEmailTableProps {
  admins: AdminAccount[];
  emails: EmailAccount[];
  onUpdate: () => void;
}

export const AdminEmailTable = ({ admins, emails, onUpdate }: AdminEmailTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedFields, setEditedFields] = useState<Partial<AdminAccount>>({});
  const { toast } = useToast();

  const handleEdit = (admin: AdminAccount) => {
    setEditingId(admin.id);
    setEditedFields({
      name: admin.name,
      email: admin.email,
      provider: admin.provider,
      payment_method: admin.payment_method,
      billing_amount: admin.billing_amount,
      billing_date: admin.billing_date,
      num_secondary_accounts: admin.num_secondary_accounts,
    });
  };

  const handleSave = async (admin: AdminAccount) => {
    try {
      console.log("Saving admin changes:", editedFields);
      
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
    } catch (error) {
      console.error("Error updating admin:", error);
      toast({
        title: "Error",
        description: "Failed to update admin details",
        variant: "destructive",
      });
    }
    setEditingId(null);
    setEditedFields({});
  };

  const handleFieldChange = (field: keyof AdminAccount, value: any) => {
    setEditedFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      <AdminTableActions
        admins={admins}
        emails={emails}
        searchTerm=""
        onSearchChange={() => {}}
        onUpdate={onUpdate}
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Admin Name</TableHead>
            <TableHead>Primary Email</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Billing Date</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Billing Amount</TableHead>
            <TableHead>Secondary Accounts</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <AdminTableRow
              key={admin.id}
              admin={admin}
              emails={emails}
              editingId={editingId}
              editedFields={editedFields}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={() => {
                setEditingId(null);
                setEditedFields({});
              }}
              onFieldChange={handleFieldChange}
              onEmailsUpdate={onUpdate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};