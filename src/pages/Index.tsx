import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { useAdminData } from "@/hooks/useAdminData";
import { CreateAdminButton } from "@/components/CreateAdminButton";
import { AdminEmailTable } from "@/components/AdminEmailTable";
import { SearchBox } from "@/components/SearchBox";
import { AdminCard } from "@/components/AdminCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminEmailFormDialog } from "@/components/AdminEmailFormDialog";
import { FilterSection } from "@/components/FilterSection";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [provider, setProvider] = useState("all");
  const { toast } = useToast();

  const { admins, emails, refetchAdmins, refetchEmails } = useAdminData(
    selectedAdmin?.id ?? null
  );

  // Enhanced search and filter function
  const filterItems = (items: any[], term: string) => {
    return items.filter((item) => {
      const matchesSearch = Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(term.toLowerCase());

      const matchesPaymentMethod =
        paymentMethod === "all" || item.payment_method === paymentMethod;
      const matchesProvider =
        provider === "all" || item.provider === provider;

      return matchesSearch && matchesPaymentMethod && matchesProvider;
    });
  };

  // Filter admins based on search term and filters
  const filteredAdmins = filterItems(admins, searchTerm);

  // Filter emails based on search term and filtered admins
  const filteredEmails = emails.filter(
    (email) =>
      filterItems([email], searchTerm).length > 0 ||
      filteredAdmins.some((admin) => admin.id === email.admin_id)
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
      <div className="container py-8 max-w-7xl mx-auto px-4">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Workspace Admin Manager
            </h1>
            <div className="w-full sm:w-auto">
              <SearchBox
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search admins and emails..."
                className="w-full sm:w-80"
              />
            </div>
          </div>

          <FilterSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            provider={provider}
            setProvider={setProvider}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="list" className="space-y-4">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="table">Table View</TabsTrigger>
                  </TabsList>
                  <CreateAdminButton onAdminCreated={refetchAdmins} />
                </div>

                <TabsContent value="list" className="space-y-4">
                  {filteredAdmins.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No admin accounts found
                    </div>
                  ) : (
                    filteredAdmins.map((admin) => (
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
                    ))
                  )}
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

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Selected Admin
                </h2>
                {selectedAdmin ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span>{" "}
                        {selectedAdmin.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span>{" "}
                        {selectedAdmin.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Provider:</span>{" "}
                        {selectedAdmin.provider}
                      </p>
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