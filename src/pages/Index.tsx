import React, { useState } from 'react';
import { AdminAccount } from "@/types/admin";
import { useAdminData } from "@/hooks/useAdminData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboardHeader } from "@/components/dashboard/AdminDashboardHeader";
import { AdminTableView } from "@/components/dashboard/AdminTableView";
import { AdminCardView } from "@/components/dashboard/AdminCardView";
import { FilterSection } from "@/components/FilterSection";
import { AdminEmailFormDialog } from "@/components/AdminEmailFormDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [provider, setProvider] = useState("all");

  const { admins, emails, refetchAdmins, refetchEmails } = useAdminData(
    selectedAdmin?.id ?? null
  );

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

      console.log('Filtering item:', {
        item,
        matchesSearch,
        matchesPaymentMethod,
        matchesProvider
      });

      return matchesSearch && matchesPaymentMethod && matchesProvider;
    });
  };

  // Enhanced filtering to include both admin and secondary emails
  const filteredAdmins = admins.filter(admin => {
    const adminMatches = filterItems([admin], searchTerm).length > 0;
    const secondaryEmailMatches = emails
      .filter(email => email.admin_id === admin.id)
      .some(email => email.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return adminMatches || secondaryEmailMatches;
  });

  const filteredEmails = emails.filter(
    (email) =>
      filterItems([email], searchTerm).length > 0 ||
      filteredAdmins.some((admin) => admin.id === email.admin_id)
  );

  console.log('Filtered results:', {
    totalAdmins: admins.length,
    filteredAdmins: filteredAdmins.length,
    totalEmails: emails.length,
    filteredEmails: filteredEmails.length
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-6 max-w-7xl mx-auto px-4">
        <AdminDashboardHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="space-y-6">
          <FilterSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            provider={provider}
            setProvider={setProvider}
          />

          <Tabs defaultValue="table" className="space-y-4">
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <AdminTableView
                admins={filteredAdmins}
                emails={filteredEmails}
                onSelectAdmin={setSelectedAdmin}
              />
            </TabsContent>

            <TabsContent value="cards">
              <AdminCardView
                admins={filteredAdmins}
                emails={filteredEmails}
                onSelectAdmin={setSelectedAdmin}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Sheet
        open={selectedAdmin !== null}
        onOpenChange={(open) => !open && setSelectedAdmin(null)}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Admin Details</SheetTitle>
          </SheetHeader>
          {selectedAdmin && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{selectedAdmin.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedAdmin.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Provider</p>
                <p className="font-medium capitalize">{selectedAdmin.provider}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium capitalize">
                  {selectedAdmin.payment_method || "Not set"}
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

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