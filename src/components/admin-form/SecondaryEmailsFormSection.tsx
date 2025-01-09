import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SecondaryEmail {
  email: string;
  provider: "google" | "microsoft";
}

interface SecondaryEmailsFormSectionProps {
  emails: SecondaryEmail[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onEmailChange: (index: number, value: string) => void;
  onProviderChange: (index: number, value: "google" | "microsoft") => void;
}

export const SecondaryEmailsFormSection: React.FC<SecondaryEmailsFormSectionProps> = ({
  emails,
  onAdd,
  onRemove,
  onEmailChange,
  onProviderChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Secondary Email Accounts</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={emails.length >= 50}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Email
        </Button>
      </div>
      
      <div className="space-y-2">
        {emails.map((email, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <Input
                type="email"
                value={email.email}
                onChange={(e) => onEmailChange(index, e.target.value)}
                placeholder={`Secondary Email ${index + 1}`}
              />
            </div>
            <div className="w-40">
              <Select
                value={email.provider}
                onValueChange={(value: "google" | "microsoft") => onProviderChange(index, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="microsoft">Microsoft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};