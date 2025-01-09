import React from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminTableViewProps {
  admins: AdminAccount[];
  emails: EmailAccount[];
  onUpdate: () => void;
  onSelectAdmin: (admin: AdminAccount) => void;
}

export const AdminTableView = ({
  admins,
  emails,
  onUpdate,
  onSelectAdmin,
}: AdminTableViewProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [adminToDelete, setAdminToDelete] = React.useState<AdminAccount | null>(null);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!adminToDelete) return;

    try {
      console.log("Deleting admin:", adminToDelete.id);
      
      // First delete all associated secondary emails
      const { error: emailsError } = await supabase
        .from("email_accounts")
        .delete()
        .eq("admin_id", adminToDelete.id);

      if (emailsError) throw emailsError;

      // Then delete the admin account
      const { error: adminError } = await supabase
        .from("admin_accounts")
        .delete()
        .eq("id", adminToDelete.id);

      if (adminError) throw adminError;

      toast({
        title: "Success",
        description: "Admin account deleted successfully",
      });
      onUpdate();
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        title: "Error",
        description: "Failed to delete admin account",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setAdminToDelete(null);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[300px]">ADMIN INFO</TableHead>
            <TableHead>PROVIDER</TableHead>
            <TableHead>BILLING INFO</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{admin.name}</p>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {admin.provider}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="capitalize">{admin.payment_method || "Not set"}</p>
                  <p className="text-sm text-gray-500">
                    {admin.billing_date
                      ? format(new Date(admin.billing_date), "yyyy-MM-dd")
                      : "Not set"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={admin.status === "active" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {admin.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => onSelectAdmin(admin)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      setAdminToDelete(admin);
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setAdminToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Admin Account"
        description="Are you sure you want to delete this admin account? This will also delete all associated secondary email accounts. This action cannot be undone."
      />
    </div>
  );
};