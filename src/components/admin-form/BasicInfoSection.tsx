import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoSectionProps {
  adminName: string;
  setAdminName: (value: string) => void;
  primaryEmail: string;
  setPrimaryEmail: (value: string) => void;
  provider: "google" | "microsoft";
  setProvider: (value: "google" | "microsoft") => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  adminName,
  setAdminName,
  primaryEmail,
  setPrimaryEmail,
  provider,
  setProvider,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="adminName">Admin Name</Label>
          <Input
            id="adminName"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primaryEmail">Primary Email</Label>
          <Input
            id="primaryEmail"
            type="email"
            value={primaryEmail}
            onChange={(e) => setPrimaryEmail(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="provider">Provider</Label>
        <Select value={provider} onValueChange={(value: "google" | "microsoft") => setProvider(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="microsoft">Microsoft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};