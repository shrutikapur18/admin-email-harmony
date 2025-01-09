import React from "react";
import { EmailAccount } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface SecondaryEmailDisplayProps {
  email: EmailAccount;
  onEdit: () => void;
  onDelete: () => void;
}

export const SecondaryEmailDisplay = ({
  email,
  onEdit,
  onDelete,
}: SecondaryEmailDisplayProps) => {
  return (
    <div className="flex items-center justify-between">
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
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={onEdit}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};