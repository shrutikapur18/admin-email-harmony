import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface PasswordSectionProps {
  enablePassword: boolean;
  setEnablePassword: (value: boolean) => void;
  password: string;
  setPassword: (value: string) => void;
}

export const PasswordSection: React.FC<PasswordSectionProps> = ({
  enablePassword,
  setEnablePassword,
  password,
  setPassword,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="enablePassword"
          checked={enablePassword}
          onCheckedChange={(checked) => setEnablePassword(checked as boolean)}
        />
        <Label htmlFor="enablePassword">Set Optional Password</Label>
      </div>

      {enablePassword && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
      )}
    </div>
  );
};