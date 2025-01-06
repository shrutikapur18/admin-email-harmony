import React, { useState } from "react";
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
import { Pencil, Save, X, Plus } from "lucide-react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CsvUploadButton } from "./CsvUploadButton";
import { ExportToCsvButton } from "./ExportToCsvButton";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminEmailTableProps {
  admins: AdminAccount[];
  emails: EmailAccount[];
  onUpdate: () => void;
}

export const AdminEmailTable = ({ admins, emails, onUpdate }: AdminEmailTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedFields, setEditedFields] = useState<Partial<AdminAccount>>({});
  const [addingSecondaryEmail, setAddingSecondaryEmail] = useState<string | null>(null);
  const [newSecondaryEmail, setNewSecondaryEmail] = useState("");
  const { toast } = useToast();

  const getEmailsForAdmin = (adminId: string) => {
    return emails.filter((email) => email.admin_id === adminId);
  };

  const handleEdit = (admin: AdminAccount) => {
    setEditingId(admin.id);
    setEditedFields({
      name: admin.name,
      email: admin.email,
      provider: admin.provider,
      payment_method: admin.payment_method,
      billing_amount: admin.billing_amount,
      billing_date: admin.billing_date,
      num_secondary_accounts: admin.num_secondary_accounts,
    });
  };

  const handleSave = async (admin: AdminAccount) => {
    try {
      console.log("Saving admin changes:", editedFields);
      
      const { error } = await supabase
        .from("admin_accounts")
        .update(editedFields)
        .eq("id", admin.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin details updated successfully",
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating admin:", error);
      toast({
        title: "Error",
        description: "Failed to update admin details",
        variant: "destructive",
      });
    }
    setEditingId(null);
    setEditedFields({});
  };

  const handleFieldChange = (field: keyof AdminAccount, value: any) => {
    setEditedFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSecondaryEmail = async (adminId: string) => {
    try {
      const { error } = await supabase.from("email_accounts").insert({
        admin_id: adminId,
        email: newSecondaryEmail,
        provider: "google",
        status: "active",
        account_type: "secondary",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Secondary email added successfully",
      });
      setAddingSecondaryEmail(null);
      setNewSecondaryEmail("");
      onUpdate();
    } catch (error) {
      console.error("Error adding secondary email:", error);
      toast({
        title: "Error",
        description: "Failed to add secondary email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CsvUploadButton onUploadComplete={onUpdate} />
        <ExportToCsvButton admins={admins} emails={emails} />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Admin Name</TableHead>
            <TableHead>Primary Email</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Billing Date</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Billing Amount</TableHead>
            <TableHead>Secondary Accounts</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>
                {editingId === admin.id ? (
                  <Input
                    value={editedFields.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  admin.name
                )}
              </TableCell>
              <TableCell>
                {editingId === admin.id ? (
                  <Input
                    value={editedFields.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  admin.email
                )}
              </TableCell>
              <TableCell>
                {editingId === admin.id ? (
                  <Select
                    value={editedFields.provider}
                    onValueChange={(value) => handleFieldChange("provider", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="microsoft">Microsoft</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline">{admin.provider}</Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={admin.status === "active" ? "default" : "secondary"}
                >
                  {admin.status}
                </Badge>
              </TableCell>
              <TableCell>
                {editingId === admin.id ? (
                  <Input
                    type="date"
                    value={editedFields.billing_date}
                    onChange={(e) => handleFieldChange("billing_date", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  admin.billing_date ? format(new Date(admin.billing_date), 'PP') : 'Not set'
                )}
              </TableCell>
              <TableCell>
                {editingId === admin.id ? (
                  <Select
                    value={editedFields.payment_method}
                    onValueChange={(value) => handleFieldChange("payment_method", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  admin.payment_method || 'Not set'
                )}
              </TableCell>
              <TableCell>
                {editingId === admin.id ? (
                  <Input
                    type="number"
                    value={editedFields.billing_amount}
                    onChange={(e) => handleFieldChange("billing_amount", parseFloat(e.target.value))}
                    className="w-full"
                  />
                ) : (
                  `$${admin.billing_amount || '0'}`
                )}
              </TableCell>
              <TableCell>
                {editingId === admin.id ? (
                  <Input
                    type="number"
                    value={editedFields.num_secondary_accounts}
                    onChange={(e) => handleFieldChange("num_secondary_accounts", parseInt(e.target.value))}
                    className="w-full"
                  />
                ) : (
                  admin.num_secondary_accounts || '0'
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {editingId === admin.id ? (
                    <>
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
                        onClick={() => {
                          setEditingId(null);
                          setEditedFields({});
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(admin)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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
                        {addingSecondaryEmail === admin.id ? (
                          <div className="flex items-center gap-2 mt-2">
                            <Input
                              value={newSecondaryEmail}
                              onChange={(e) => setNewSecondaryEmail(e.target.value)}
                              placeholder="Enter secondary email"
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAddSecondaryEmail(admin.id)}
                            >
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setAddingSecondaryEmail(null);
                                setNewSecondaryEmail("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => setAddingSecondaryEmail(admin.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Secondary Email
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};