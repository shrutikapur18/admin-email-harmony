import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import Papa from "papaparse";

interface ExportToCsvButtonProps {
  admins: AdminAccount[];
  emails: EmailAccount[];
}

export const ExportToCsvButton = ({ admins, emails }: ExportToCsvButtonProps) => {
  const handleExport = () => {
    console.log("Preparing CSV export...");
    
    // Prepare data for CSV export
    const csvData = admins.map(admin => {
      const adminEmails = emails.filter(email => email.admin_id === admin.id);
      
      return {
        "Admin Name": admin.name,
        "Primary Email": admin.email,
        "Provider": admin.provider,
        "Status": admin.status,
        "Billing Date": admin.billing_date || "",
        "Payment Method": admin.payment_method || "",
        "Billing Amount": admin.billing_amount || "",
        "Number of Secondary Accounts": admin.num_secondary_accounts || 0,
        "Secondary Emails": adminEmails.map(e => e.email).join(", "),
        "Secondary Email Providers": adminEmails.map(e => e.provider).join(", "),
        "Secondary Email Statuses": adminEmails.map(e => e.status).join(", "),
      };
    });

    console.log("CSV data prepared:", csvData);

    // Convert to CSV
    const csv = Papa.unparse(csvData);
    
    // Create blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `workspace_admins_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Button onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" />
      Export to CSV
    </Button>
  );
};