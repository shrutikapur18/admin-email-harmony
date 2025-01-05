import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReminderSectionProps {
  enableReminders: boolean;
  setEnableReminders: (value: boolean) => void;
  reminderFrequency: string;
  setReminderFrequency: (value: string) => void;
  deliveryMethod: string;
  setDeliveryMethod: (value: string) => void;
}

export const ReminderSection: React.FC<ReminderSectionProps> = ({
  enableReminders,
  setEnableReminders,
  reminderFrequency,
  setReminderFrequency,
  deliveryMethod,
  setDeliveryMethod,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="enableReminders"
          checked={enableReminders}
          onCheckedChange={(checked) => setEnableReminders(checked as boolean)}
        />
        <Label htmlFor="enableReminders">Enable Bill Payment Reminders</Label>
      </div>

      {enableReminders && (
        <div className="space-y-4 pl-6">
          <div className="space-y-2">
            <Label>Reminder Frequency</Label>
            <Select value={reminderFrequency} onValueChange={setReminderFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Delivery Method</Label>
            <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="app">App Notification</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};