import React from "react";
import { AdminAccount } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface AdminListProps {
  admins: AdminAccount[];
  onSelectAdmin: (admin: AdminAccount) => void;
}

const AdminList: React.FC<AdminListProps> = ({ admins, onSelectAdmin }) => {
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
                <span className="text-xs text-gray-500">
                  Last login: {admin.lastLogin || "Never"}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onSelectAdmin(admin)}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AdminList;