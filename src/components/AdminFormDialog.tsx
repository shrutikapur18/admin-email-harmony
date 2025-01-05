import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SecondaryEmailsSection } from "./SecondaryEmailsSection";
import { checkEmailExists } from "@/utils/emailValidation";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface AdminFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdminCreated: () => void;
}

export const AdminFormDialog = ({ open, onOpenChange, onAdminCreated }: AdminFormDialogProps) => {
  const { toast } = useToast();
  const [adminName, setAdminName] = React.useState("");
  const [primaryEmail, setPrimaryEmail] = React.useState("");
  const [provider, setProvider] = React.useState<"google" | "microsoft">("google");
  const [billingDate, setBillingDate] = React.useState<Date>();
  const [paymentMethod, setPaymentMethod] = React.useState<"automatic" | "manual">("automatic");
  const [billingAmount, setBillingAmount] = React.useState("");
  const [numSecondaryAccounts, setNumSecondaryAccounts] = React.useState("");
  const [enableReminders, setEnableReminders] = React.useState(false);
  const [reminderFrequency, setReminderFrequency] = React.useState("weekly");
  const [deliveryMethod, setDeliveryMethod] = React.useState("email");
  const [enablePassword, setEnablePassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resetForm = () => {
    setAdminName("");
    setPrimaryEmail("");
    setProvider("google");
    setBillingDate(undefined);
    setPaymentMethod("automatic");
    setBillingAmount("");
    setNumSecondaryAccounts("");
    setEnableReminders(false);
    setReminderFrequency("weekly");
    setDeliveryMethod("email");
    setEnablePassword(false);
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Checking if email exists...");
      const emailExists = await checkEmailExists(primaryEmail);
      
      if (emailExists) {
        toast({
          title: "Error",
          description: "An admin with this email already exists",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log("Creating new admin account...");
      
      const { data: adminData, error: adminError } = await supabase
        .from("admin_accounts")
        .insert([{
          name: adminName,
          email: primaryEmail,
          provider,
          status: "active",
          billing_date: billingDate,
          payment_method: paymentMethod,
          billing_amount: parseFloat(billingAmount),
          num_secondary_accounts: parseInt(numSecondaryAccounts),
          enable_reminders: enableReminders,
          reminder_frequency: enableReminders ? reminderFrequency : null,
          delivery_method: enableReminders ? deliveryMethod : null,
          password: enablePassword ? password : null,
        }])
        .select()
        .single();

      if (adminError) {
        console.error("Error creating admin:", adminError);
        toast({
          title: "Error",
          description: "Failed to create admin account",
          variant: "destructive",
        });
        return;
      }

      console.log("Admin created successfully:", adminData);

      toast({
        title: "Success",
        description: "Your details have been successfully saved",
      });
      
      onAdminCreated();
      onOpenChange(false);
      resetForm();
      
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Create a new admin account with billing and payment details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Basic Information */}
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
            
            {/* Provider Selection */}
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

            {/* Billing Date */}
            <div className="space-y-2">
              <Label>Billing Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !billingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {billingDate ? format(billingDate, "PPP") : "Select billing date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={billingDate}
                    onSelect={setBillingDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value: "automatic" | "manual") => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Billing Amount */}
            <div className="space-y-2">
              <Label htmlFor="billingAmount">Billing Amount ($)</Label>
              <Input
                id="billingAmount"
                type="number"
                value={billingAmount}
                onChange={(e) => setBillingAmount(e.target.value)}
                placeholder="Enter billing amount"
                required
              />
            </div>

            {/* Number of Secondary Accounts */}
            <div className="space-y-2">
              <Label htmlFor="numSecondaryAccounts">Number of Secondary Email Accounts</Label>
              <Input
                id="numSecondaryAccounts"
                type="number"
                value={numSecondaryAccounts}
                onChange={(e) => setNumSecondaryAccounts(e.target.value)}
                placeholder="Enter number of accounts"
                required
              />
            </div>

            {/* Bill Payment Reminder */}
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

            {/* Optional Password */}
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
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};