import React from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SecondaryEmailsAccordion } from "./SecondaryEmailsAccordion";

interface AdminTableRowProps {
  admin: AdminAccount;
  emails: EmailAccount[];
  editingId: string | null;
  editedFields: Partial<AdminAccount>;
  onEdit: (admin: AdminAccount) => void;
  onSave: (admin: AdminAccount) => void;
  onCancel: () => void;
  onFieldChange: (field: keyof AdminAccount, value: any) => void;
  onEmailsUpdate: () => void;
}

export const AdminTableRow = ({
  admin,
  emails,
  editingId,
  editedFields,
  onEdit,
  onSave,
  onCancel,
  onFieldChange,
  onEmailsUpdate,
}: AdminTableRowProps) => {
  const isEditing = editingId === admin.id;

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedFields.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="w-full"
          />
        ) : (
          admin.name
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedFields.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            className="w-full"
          />
        ) : (
          admin.email
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editedFields.provider}
            onValueChange={(value) => onFieldChange("provider", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="microsoft">Microsoft</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="outline">{admin.provider}</Badge>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={admin.status === "active" ? "default" : "secondary"}>
          {admin.status}
        </Badge>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="date"
            value={editedFields.billing_date}
            onChange={(e) => onFieldChange("billing_date", e.target.value)}
            className="w-full"
          />
        ) : (
          admin.billing_date ? format(new Date(admin.billing_date), 'PP') : 'Not set'
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editedFields.payment_method}
            onValueChange={(value) => onFieldChange("payment_method", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          admin.payment_method || 'Not set'
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editedFields.billing_amount}
            onChange={(e) => onFieldChange("billing_amount", parseFloat(e.target.value))}
            className="w-full"
          />
        ) : (
          `$${admin.billing_amount || '0'}`
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editedFields.num_secondary_accounts}
            onChange={(e) => onFieldChange("num_secondary_accounts", parseInt(e.target.value))}
            className="w-full"
          />
        ) : (
          admin.num_secondary_accounts || '0'
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onSave(admin)}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(admin)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <SecondaryEmailsAccordion
          admin={admin}
          emails={emails.filter(email => email.admin_id === admin.id)}
          onUpdate={onEmailsUpdate}
        />
      </TableCell>
    </TableRow>
  );
};