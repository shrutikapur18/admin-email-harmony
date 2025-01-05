import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { checkEmailExists } from "@/utils/emailValidation";
import { BasicInfoSection } from "./admin-form/BasicInfoSection";
import { BillingSection } from "./admin-form/BillingSection";
import { ReminderSection } from "./admin-form/ReminderSection";
import { PasswordSection } from "./admin-form/PasswordSection";

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
        .maybeSingle();

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
          <BasicInfoSection
            adminName={adminName}
            setAdminName={setAdminName}
            primaryEmail={primaryEmail}
            setPrimaryEmail={setPrimaryEmail}
            provider={provider}
            setProvider={setProvider}
          />
          
          <BillingSection
            billingDate={billingDate}
            setBillingDate={setBillingDate}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            billingAmount={billingAmount}
            setBillingAmount={setBillingAmount}
            numSecondaryAccounts={numSecondaryAccounts}
            setNumSecondaryAccounts={setNumSecondaryAccounts}
          />
          
          <ReminderSection
            enableReminders={enableReminders}
            setEnableReminders={setEnableReminders}
            reminderFrequency={reminderFrequency}
            setReminderFrequency={setReminderFrequency}
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
          />
          
          <PasswordSection
            enablePassword={enablePassword}
            setEnablePassword={setEnablePassword}
            password={password}
            setPassword={setPassword}
          />

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