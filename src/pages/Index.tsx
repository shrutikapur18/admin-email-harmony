import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { useAdminData } from "@/hooks/useAdminData";
import { CreateAdminButton } from "@/components/CreateAdminButton";
import { CreateEmailButton } from "@/components/CreateEmailButton";
import { AdminEmailTable } from "@/components/AdminEmailTable";
import { SearchBox } from "@/components/SearchBox";
import { AdminCard } from "@/components/AdminCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminEmailFormDialog } from "@/components/AdminEmailFormDialog";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { toast } = useToast();

  const { admins, emails, refetchAdmins, refetchEmails } = useAdminData(
    selectedAdmin?.id ?? null
  );

  // Enhanced search function that searches across multiple fields
  const searchFilter = (item: any, term: string) => {
    const searchTermLower = term.toLowerCase();
    return Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTermLower);
  };

  // Filter admins based on search term
  const filteredAdmins = admins.filter((admin) => {
    const adminEmails = emails.filter((email) => email.admin_id === admin.id);
    return (
      searchFilter(admin, searchTerm) ||
      adminEmails.some((email) => searchFilter(email, searchTerm))
    );
  });

  // Filter emails based on search term and include emails from filtered admins
  const filteredEmails = emails.filter(
    (email) =>
      searchFilter(email, searchTerm) ||
      filteredAdmins.some((admin) => admin.id === email.admin_id)
  );

  console.log("Search term:", searchTerm);
  console.log("Filtered admins:", filteredAdmins);
  console.log("Filtered emails:", filteredEmails);

  const handleDeleteAdmin = async (admin: AdminAccount) => {
    try {
      console.log("Deleting admin:", admin.id);
      
      const { error } = await supabase
        .from("admin_accounts")
        .delete()
        .eq("id", admin.id);

      if (error) {
        console.error("Error deleting admin:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete admin account",
          variant: "destructive",
        });
        return;
      }

      console.log("Admin deleted successfully");
      toast({
        title: "Success",
        description: "Admin account deleted successfully",
      });
      refetchAdmins();
      refetchEmails();
    } catch (error) {
      console.error("Unexpected error in handleDeleteAdmin:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the admin",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmail = async (email: EmailAccount) => {
    try {
      console.log("Deleting email account:", email.id);
      
      const { error } = await supabase
        .from("email_accounts")
        .delete()
        .eq("id", email.id);

      if (error) {
        console.error("Error deleting email:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete email account",
          variant: "destructive",
        });
        return;
      }

      console.log("Email account deleted successfully");
      toast({
        title: "Success",
        description: "Email account deleted successfully",
      });
      refetchEmails();
    } catch (error) {
      console.error("Unexpected error in handleDeleteEmail:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Workspace Admin Manager
          </h1>
          <div className="flex items-center gap-4">
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search admins and emails..."
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <Tabs defaultValue="list" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>
                <CreateAdminButton onAdminCreated={refetchAdmins} />
              </div>

              <TabsContent value="list" className="space-y-4">
                {filteredAdmins.map((admin) => (
                  <AdminCard
                    key={admin.id}
                    admin={admin}
                    emails={filteredEmails.filter(
                      (email) => email.admin_id === admin.id
                    )}
                    onDelete={handleDeleteAdmin}
                    onAddEmail={() => {
                      setSelectedAdmin(admin);
                      setShowEmailForm(true);
                    }}
                    onDeleteEmail={handleDeleteEmail}
                  />
                ))}
              </TabsContent>

              <TabsContent value="table" className="space-y-4">
                <AdminEmailTable
                  admins={filteredAdmins}
                  emails={filteredEmails}
                  onUpdate={() => {
                    refetchAdmins();
                    refetchEmails();
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Selected Admin</h2>
              {selectedAdmin ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p>Name: {selectedAdmin.name}</p>
                    <p>Email: {selectedAdmin.email}</p>
                    <p>Provider: {selectedAdmin.provider}</p>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => setShowEmailForm(true)}
                      className="w-full"
                    >
                      Add Secondary Emails
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedAdmin(null)}
                      className="w-full"
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No admin selected</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AdminEmailFormDialog
        open={showEmailForm}
        onOpenChange={setShowEmailForm}
        admin={selectedAdmin}
        onEmailsAdded={() => {
          refetchEmails();
          setShowEmailForm(false);
        }}
      />
    </div>
  );
};

export default Index;