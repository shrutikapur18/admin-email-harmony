import React, { useState } from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { useAdminData } from "@/hooks/useAdminData";
import { AdminDashboardHeader } from "@/components/dashboard/AdminDashboardHeader";
import { AdminCardView } from "@/components/dashboard/AdminCardView";
import { AdminTableView } from "@/components/dashboard/AdminTableView";
import { FilterDrawer } from "@/components/dashboard/FilterDrawer";

export default function Index() {
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"all" | "automatic" | "manual">("all");
  const [provider, setProvider] = useState<"all" | "google" | "microsoft">("all");
  
  const { admins, emails, refetchAdmins, refetchEmails } = useAdminData(selectedAdminId);

  const handleSelectAdmin = (admin: AdminAccount) => {
    setSelectedAdminId(admin.id);
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentMethod = paymentMethod === "all" || 
      admin.payment_method === paymentMethod;
    
    const matchesProvider = provider === "all" || 
      admin.provider === provider;

    return matchesSearch && matchesPaymentMethod && matchesProvider;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminDashboardHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {filteredAdmins.length > 0 ? (
        <AdminCardView
          admins={filteredAdmins}
          emails={emails}
          onSelectAdmin={handleSelectAdmin}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          No admin accounts found matching your criteria
        </div>
      )}

      <FilterDrawer
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        provider={provider}
        setProvider={setProvider}
      />
    </div>
  );
}