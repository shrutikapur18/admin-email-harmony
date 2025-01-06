import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

interface ExportToCsvButtonProps {
  admins: AdminAccount[];
  emails: EmailAccount[];
}

export const ExportToCsvButton = ({ admins, emails }: ExportToCsvButtonProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      console.log("Initiating CSV export with enhanced formatting...");
      
      if (admins.length === 0) {
        toast({
          title: "Export Failed",
          description: "No admin accounts available for export. Please add some data first.",
          variant: "destructive",
        });
        return;
      }

      const formattedData = admins.map(admin => {
        const adminEmails = emails.filter(email => email.admin_id === admin.id);
        console.log(`Formatting data for admin ${admin.name} (${adminEmails.length} secondary emails)`);
        
        return {
          "Admin ID": admin.id,
          "Admin Name": admin.name || "Unnamed",
          "Primary Email": admin.email,
          "Provider": admin.provider?.toUpperCase() || "N/A",
          "Account Status": admin.status?.toUpperCase() || "N/A",
          "Created Date": new Date(admin.created_at).toLocaleDateString(),
          "Billing Date": admin.billing_date ? new Date(admin.billing_date).toLocaleDateString() : "Not Set",
          "Payment Method": admin.payment_method ? 
            admin.payment_method.charAt(0).toUpperCase() + admin.payment_method.slice(1) : 
            "Not Set",
          "Monthly Billing": admin.billing_amount ? 
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(admin.billing_amount) : 
            "$0.00",
          "Secondary Account Limit": admin.num_secondary_accounts || 0,
          "Secondary Emails": adminEmails.map(e => e.email).join("; ") || "None",
          "Secondary Email Statuses": adminEmails.map(e => e.status.toUpperCase()).join("; ") || "N/A",
          "Notes": admin.notes || "No notes",
        };
      });

      console.log("Generating CSV file with formatted data...");
      const csv = Papa.unparse(formattedData, {
        quotes: true,
        delimiter: ",",
        header: true,
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `workspace_admins_export_${timestamp}.csv`;
      
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("CSV export completed successfully");
      toast({
        title: "Export Successful",
        description: `${admins.length} admin records have been exported to ${filename}`,
      });
    } catch (error) {
      console.error("CSV export failed:", error);
      toast({
        title: "Export Error",
        description: "Failed to generate CSV file. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
    >
      <Download className="h-4 w-4" />
      {isExporting ? "Exporting..." : "Export to CSV"}
    </Button>
  );
};