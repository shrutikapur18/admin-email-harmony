import React, { useState } from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Eye } from "lucide-react";
import { format } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AdminTableViewProps {
  admins: AdminAccount[];
  emails: EmailAccount[];
  onSelectAdmin: (admin: AdminAccount) => void;
}

export const AdminTableView = ({
  admins,
  emails,
  onSelectAdmin,
}: AdminTableViewProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (adminId: string) => {
    setExpandedRows(prev =>
      prev.includes(adminId)
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  };

  const getEmailsForAdmin = (adminId: string) => {
    return emails.filter(email => email.admin_id === adminId);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Admin Name</TableHead>
            <TableHead>Primary Email</TableHead>
            <TableHead className="hidden md:table-cell">Provider</TableHead>
            <TableHead className="hidden lg:table-cell">Billing Date</TableHead>
            <TableHead>Billing Amount</TableHead>
            <TableHead className="hidden xl:table-cell">Payment Method</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <React.Fragment key={admin.id}>
              <TableRow className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRow(admin.id)}
                    className="p-0 h-6 w-6"
                  >
                    {expandedRows.includes(admin.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{admin.provider}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {admin.billing_date
                    ? format(new Date(admin.billing_date), "PP")
                    : "Not set"}
                </TableCell>
                <TableCell>${admin.billing_amount || "0"}</TableCell>
                <TableCell className="hidden xl:table-cell capitalize">
                  {admin.payment_method || "Not set"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectAdmin(admin)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={8} className="p-0">
                  <Collapsible open={expandedRows.includes(admin.id)}>
                    <CollapsibleContent className="px-4 py-2 bg-muted/30">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Secondary Emails</h4>
                        {getEmailsForAdmin(admin.id).map((email) => (
                          <div
                            key={email.id}
                            className="flex items-center justify-between p-2 bg-background rounded-md"
                          >
                            <div>
                              <p className="text-sm font-medium">{email.email}</p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {email.provider}
                                </Badge>
                                <Badge
                                  variant={
                                    email.status === "active"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {email.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                        {getEmailsForAdmin(admin.id).length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No secondary emails
                          </p>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};