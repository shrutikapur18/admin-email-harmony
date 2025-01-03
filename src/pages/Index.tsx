import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminList from "@/components/AdminList";
import EmailList from "@/components/EmailList";
import ActivityLogList from "@/components/ActivityLogList";
import { mockAdmins, mockEmails, mockLogs } from "@/services/mockData";
import { AdminAccount } from "@/types/admin";
import { Search } from "lucide-react";

const Index = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAdmins = mockAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmails = mockEmails.filter(
    (email) =>
      (!selectedAdmin || email.adminId === selectedAdmin.id) &&
      email.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Workspace Admin Manager
          </h1>
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

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <Tabs defaultValue="admins" className="space-y-4">
              <TabsList>
                <TabsTrigger value="admins">Admin Accounts</TabsTrigger>
                <TabsTrigger value="emails">Email Accounts</TabsTrigger>
              </TabsList>

              <TabsContent value="admins" className="space-y-4">
                <AdminList admins={filteredAdmins} onSelectAdmin={setSelectedAdmin} />
              </TabsContent>

              <TabsContent value="emails" className="space-y-4">
                <EmailList emails={filteredEmails} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <ActivityLogList logs={mockLogs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;