import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";

interface SecondaryEmailEditorProps {
  email: string;
  provider: "google" | "microsoft";
  onSave: (email: string, provider: "google" | "microsoft") => void;
  onCancel: () => void;
}

export const SecondaryEmailEditor = ({
  email,
  provider,
  onSave,
  onCancel,
}: SecondaryEmailEditorProps) => {
  const [editedEmail, setEditedEmail] = React.useState(email);
  const [editedProvider, setEditedProvider] = React.useState<"google" | "microsoft">(provider);

  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        value={editedEmail}
        onChange={(e) => setEditedEmail(e.target.value)}
        className="flex-1"
      />
      <Select
        value={editedProvider}
        onValueChange={(value: "google" | "microsoft") => setEditedProvider(value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="google">Google</SelectItem>
          <SelectItem value="microsoft">Microsoft</SelectItem>
        </SelectContent>
      </Select>
      <Button
        size="sm"
        onClick={() => onSave(editedEmail, editedProvider)}
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};