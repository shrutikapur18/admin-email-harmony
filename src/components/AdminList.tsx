import React from "react";
import { AdminAccount } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AdminListProps {
  admins: AdminAccount[];
  onSelectAdmin: (admin: AdminAccount) => void;
  onDeleteAdmin: () => void;
}

const AdminList: React.FC<AdminListProps> = ({
  admins,
  onSelectAdmin,
  onDeleteAdmin,
}) => {
  const { toast } = useToast();

  const handleDelete = async (admin: AdminAccount) => {
    const { error } = await supabase
      .from("admin_accounts")
      .delete()
      .eq("id", admin.id);

    if (error) {
      console.error("Error deleting admin:", error);
      toast({
        title: "Error",
        description: "Failed to delete admin account",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Admin account deleted successfully",
    });
    onDeleteAdmin();
  };

  return (
    <div className="space-y-4">
      {admins.map((admin) => (
        <Card key={admin.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{admin.name}</h3>
              <p className="text-sm text-gray-600">{admin.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={admin.status === "active" ? "default" : "secondary"}>
                  {admin.status}
                </Badge>
                <Badge variant="outline">{admin.provider}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSelectAdmin(admin)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(admin)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AdminList;