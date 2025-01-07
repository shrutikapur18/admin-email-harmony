import React from "react";
import { AdminAccount } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminCardHeaderProps {
  admin: AdminAccount;
  isEditing: boolean;
  editedFields: Partial<AdminAccount>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onFieldChange: (field: keyof AdminAccount, value: any) => void;
}

export const AdminCardHeader = ({
  admin,
  isEditing,
  editedFields,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onFieldChange,
}: AdminCardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        {isEditing ? (
          <>
            <Input
              value={editedFields.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="Admin Name"
            />
            <Input
              value={editedFields.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              placeholder="Email"
              type="email"
            />
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
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900">{admin.name}</h3>
            <p className="text-sm text-gray-600">{admin.email}</p>
          </>
        )}
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
            <Button variant="ghost" size="icon" onClick={onSave}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};