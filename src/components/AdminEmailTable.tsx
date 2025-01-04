import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminEmailTableProps {
  admins: AdminAccount[];
  emails: EmailAccount[];
  onUpdate: () => void;
}

export const AdminEmailTable = ({ admins, emails, onUpdate }: AdminEmailTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedEmail, setEditedEmail] = useState("");
  const { toast } = useToast();

  const getEmailsForAdmin = (adminId: string) => {
    return emails.filter((email) => email.admin_id === adminId);
  };

  const handleEdit = (admin: AdminAccount) => {
    setEditingId(admin.id);
    setEditedEmail(admin.email);
  };

  const handleSave = async (admin: AdminAccount) => {
    try {
      const { error } = await supabase
        .from("admin_accounts")
        .update({ email: editedEmail })
        .eq("id", admin.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email updated successfully",
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      });
    }
    setEditingId(null);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Admin Name</TableHead>
          <TableHead>Primary Email</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell>{admin.name}</TableCell>
            <TableCell>
              {editingId === admin.id ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-64"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleSave(admin)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {admin.email}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(admin)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{admin.provider}</Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={admin.status === "active" ? "default" : "secondary"}
              >
                {admin.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="secondary-emails">
                  <AccordionTrigger>Secondary Emails</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {getEmailsForAdmin(admin.id).map((email) => (
                        <div
                          key={email.id}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div>
                            <p className="font-medium">{email.email}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{email.provider}</Badge>
                              <Badge
                                variant={
                                  email.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {email.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};