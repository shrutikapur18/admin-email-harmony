import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

interface CsvUploadButtonProps {
  onUploadComplete: () => void;
}

export const CsvUploadButton: React.FC<CsvUploadButtonProps> = ({
  onUploadComplete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          console.log("Parsing CSV data:", results.data);

          const validData = results.data.filter((row: any) => 
            row.admin_email && row.secondary_email
          );

          for (const row of validData) {
            // First, check if admin exists or create new admin
            const { data: adminData, error: adminError } = await supabase
              .from("admin_accounts")
              .select()
              .eq("email", row.admin_email)
              .single();

            let adminId;
            if (!adminData) {
              const { data: newAdmin, error: createError } = await supabase
                .from("admin_accounts")
                .insert({
                  email: row.admin_email,
                  name: row.admin_name || "Imported Admin",
                  provider: row.provider || "google",
                  status: "active",
                })
                .select()
                .single();

              if (createError) throw createError;
              adminId = newAdmin.id;
            } else {
              adminId = adminData.id;
            }

            // Create secondary email
            const { error: emailError } = await supabase
              .from("email_accounts")
              .insert({
                admin_id: adminId,
                email: row.secondary_email,
                provider: row.provider || "google",
                status: "active",
                account_type: "secondary",
              });

            if (emailError) throw emailError;
          }

          toast({
            title: "Success",
            description: `Imported ${validData.length} records successfully`,
          });
          onUploadComplete();
        } catch (error) {
          console.error("Error processing CSV:", error);
          toast({
            title: "Error",
            description: "Failed to process CSV file",
            variant: "destructive",
          });
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Error",
          description: "Failed to parse CSV file",
          variant: "destructive",
        });
      },
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        className="hidden"
        onChange={handleFileSelect}
      />
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Upload CSV
      </Button>
    </>
  );
};