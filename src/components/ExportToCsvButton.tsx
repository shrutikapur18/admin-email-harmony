import React from "react";
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

  const handleExport = () => {
    try {
      console.log("Starting CSV export process...");
      
      if (admins.length === 0) {
        toast({
          title: "No Data",
          description: "There are no admin accounts to export.",
          variant: "destructive",
        });
        return;
      }

      const csvData = admins.map(admin => {
        const adminEmails = emails.filter(email => email.admin_id === admin.id);
        console.log(`Processing admin ${admin.id} with ${adminEmails.length} secondary emails`);
        
        return {
          "Admin Name": admin.name || "N/A",
          "Primary Email": admin.email || "N/A",
          "Provider": admin.provider || "N/A",
          "Status": admin.status || "N/A",
          "Billing Date": admin.billing_date ? new Date(admin.billing_date).toLocaleDateString() : "Not set",
          "Payment Method": admin.payment_method?.charAt(0).toUpperCase() + admin.payment_method?.slice(1) || "Not set",
          "Billing Amount": admin.billing_amount ? `$${admin.billing_amount}` : "$0",
          "Secondary Accounts": admin.num_secondary_accounts?.toString() || "0",
          "Secondary Emails": adminEmails.length > 0 ? adminEmails.map(e => e.email).join(", ") : "None",
          "Secondary Email Providers": adminEmails.length > 0 ? adminEmails.map(e => e.provider).join(", ") : "N/A",
          "Secondary Email Statuses": adminEmails.length > 0 ? adminEmails.map(e => e.status).join(", ") : "N/A",
        };
      });

      console.log("CSV data prepared:", csvData);

      const csv = Papa.unparse(csvData, {
        quotes: true,
        delimiter: ",",
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `workspace_admins_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: `Successfully exported ${admins.length} admin records to CSV`,
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting the CSV file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium"
    >
      <Download className="h-4 w-4" />
      Export to CSV
    </Button>
  );
};