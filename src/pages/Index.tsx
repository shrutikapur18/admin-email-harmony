import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAccount } from "@/types/admin";
import { useAdminData } from "@/hooks/useAdminData";
import { CreateAdminButton } from "@/components/CreateAdminButton";
import { CreateEmailButton } from "@/components/CreateEmailButton";
import { AdminEmailTable } from "@/components/AdminEmailTable";
import { SearchBox } from "@/components/SearchBox";
import { AdminCard } from "@/components/AdminCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);
  const { toast } = useToast();

  const { admins, emails, refetchAdmins, refetchEmails } = useAdminData(
    selectedAdmin?.id ?? null
  );

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmails = emails.filter((email) =>
    email.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteAdmin = async (admin: AdminAccount) => {
    try {
      const { error } = await supabase
        .from("admin_accounts")
        .delete()
        .eq("id", admin.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin account deleted successfully",
      });
      refetchAdmins();
      refetchEmails();
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast({
        title: "Error",
        description: "Failed to delete admin account",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmail = async (email: EmailAccount) => {
    try {
      const { error } = await supabase
        .from("email_accounts")
        .delete()
        .eq("id", email.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email account deleted successfully",
      });
      refetchEmails();
    } catch (error) {
      console.error("Error deleting email:", error);
      toast({
        title: "Error",
        description: "Failed to delete email account",
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
                    onAddEmail={(admin) => setSelectedAdmin(admin)}
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
                    <CreateEmailButton
                      selectedAdmin={selectedAdmin}
                      onEmailCreated={refetchEmails}
                    />
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
    </div>
  );
};

export default Index;