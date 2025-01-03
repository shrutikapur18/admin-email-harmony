import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminList from "@/components/AdminList";
import EmailList from "@/components/EmailList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AdminAccount, EmailAccount } from "@/types/admin";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);
  const { toast } = useToast();

  // Fetch admin accounts
  const { data: admins = [], refetch: refetchAdmins } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching admins:", error);
        toast({
          title: "Error",
          description: "Failed to fetch admin accounts",
          variant: "destructive",
        });
        return [];
      }
      return data as AdminAccount[];
    },
  });

  // Fetch email accounts
  const { data: emails = [], refetch: refetchEmails } = useQuery({
    queryKey: ["emails", selectedAdmin?.id],
    queryFn: async () => {
      let query = supabase
        .from("email_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedAdmin) {
        query = query.eq("admin_id", selectedAdmin.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching emails:", error);
        toast({
          title: "Error",
          description: "Failed to fetch email accounts",
          variant: "destructive",
        });
        return [];
      }
      return data as EmailAccount[];
    },
  });

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmails = emails.filter((email) =>
    email.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAdmin = async () => {
    const { data, error } = await supabase.from("admin_accounts").insert([
      {
        name: "New Admin",
        email: "admin@example.com",
        provider: "google",
      },
    ]);

    if (error) {
      console.error("Error creating admin:", error);
      toast({
        title: "Error",
        description: "Failed to create admin account",
        variant: "destructive",
      });
      return;
    }

    refetchAdmins();
    toast({
      title: "Success",
      description: "Admin account created successfully",
    });
  };

  const handleCreateEmail = async () => {
    if (!selectedAdmin) {
      toast({
        title: "Error",
        description: "Please select an admin first",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase.from("email_accounts").insert([
      {
        admin_id: selectedAdmin.id,
        email: "secondary@example.com",
        provider: selectedAdmin.provider,
        account_type: "secondary",
      },
    ]);

    if (error) {
      console.error("Error creating email:", error);
      toast({
        title: "Error",
        description: "Failed to create email account",
        variant: "destructive",
      });
      return;
    }

    refetchEmails();
    toast({
      title: "Success",
      description: "Email account created successfully",
    });
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
            <Tabs defaultValue="admins" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="admins">Admin Accounts</TabsTrigger>
                  <TabsTrigger value="emails">Email Accounts</TabsTrigger>
                </TabsList>
                <Button
                  onClick={
                    selectedAdmin ? handleCreateEmail : handleCreateAdmin
                  }
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add {selectedAdmin ? "Email" : "Admin"}
                </Button>
              </div>

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