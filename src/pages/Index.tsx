import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminList from "@/components/AdminList";
import EmailList from "@/components/EmailList";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminAccount } from "@/types/admin";
import { useAdminData } from "@/hooks/useAdminData";
import { CreateAdminButton } from "@/components/CreateAdminButton";
import { CreateEmailButton } from "@/components/CreateEmailButton";
import { AdminEmailTable } from "@/components/AdminEmailTable";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);

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

  const handleRefresh = () => {
    refetchAdmins();
    refetchEmails();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Workspace Admin Manager
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <Tabs defaultValue="table" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="admins">Admin Accounts</TabsTrigger>
                  <TabsTrigger value="emails">Email Accounts</TabsTrigger>
                </TabsList>
                <div>
                  {selectedAdmin ? (
                    <CreateEmailButton
                      selectedAdmin={selectedAdmin}
                      onEmailCreated={refetchEmails}
                    />
                  ) : (
                    <CreateAdminButton onAdminCreated={refetchAdmins} />
                  )}
                </div>
              </div>

              <TabsContent value="table" className="space-y-4">
                <AdminEmailTable
                  admins={filteredAdmins}
                  emails={filteredEmails}
                  onUpdate={handleRefresh}
                />
              </TabsContent>

              <TabsContent value="admins" className="space-y-4">
                <AdminList
                  admins={filteredAdmins}
                  onSelectAdmin={setSelectedAdmin}
                  onDeleteAdmin={refetchAdmins}
                />
              </TabsContent>

              <TabsContent value="emails" className="space-y-4">
                <EmailList
                  emails={filteredEmails}
                  className="space-y-4"
                  onDeleteEmail={refetchEmails}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Selected Admin</h2>
              {selectedAdmin ? (
                <div className="space-y-2">
                  <p>Name: {selectedAdmin.name}</p>
                  <p>Email: {selectedAdmin.email}</p>
                  <p>Provider: {selectedAdmin.provider}</p>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAdmin(null)}
                    className="w-full mt-4"
                  >
                    Clear Selection
                  </Button>
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