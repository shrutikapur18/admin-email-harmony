import React from "react";
import { AdminAccount } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface AdminCardDetailsProps {
  admin: AdminAccount;
  isEditing: boolean;
  editedFields: Partial<AdminAccount>;
  onFieldChange: (field: keyof AdminAccount, value: any) => void;
}

export const AdminCardDetails = ({
  admin,
  isEditing,
  editedFields,
  onFieldChange,
}: AdminCardDetailsProps) => {
  return (
    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
      <div className="text-sm">
        <span className="text-gray-500">Billing Date:</span>
        {isEditing ? (
          <Input
            type="date"
            value={editedFields.billing_date || ""}
            onChange={(e) => onFieldChange("billing_date", e.target.value)}
          />
        ) : (
          <p className="font-medium text-gray-900">
            {admin.billing_date ? format(new Date(admin.billing_date), 'PP') : 'Not set'}
          </p>
        )}
      </div>
      <div className="text-sm">
        <span className="text-gray-500">Payment Method:</span>
        {isEditing ? (
          <Select
            value={editedFields.payment_method as "automatic" | "manual" || "automatic"}
            onValueChange={(value: "automatic" | "manual") => onFieldChange("payment_method", value)}
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
          <p className="font-medium text-gray-900 capitalize">
            {admin.payment_method || 'Not set'}
          </p>
        )}
      </div>
      <div className="text-sm">
        <span className="text-gray-500">Billing Amount:</span>
        {isEditing ? (
          <Input
            type="number"
            value={editedFields.billing_amount || ""}
            onChange={(e) => onFieldChange("billing_amount", parseFloat(e.target.value))}
            placeholder="Billing Amount"
          />
        ) : (
          <p className="font-medium text-gray-900">
            ${admin.billing_amount || '0'}
          </p>
        )}
      </div>
    </div>
  );
};