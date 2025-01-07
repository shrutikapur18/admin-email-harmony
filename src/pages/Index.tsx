import React, { useState } from "react";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { useAdminData } from "@/hooks/useAdminData";
import { AdminDashboardHeader } from "@/components/dashboard/AdminDashboardHeader";
import { AdminCardView } from "@/components/dashboard/AdminCardView";
import { AdminTableView } from "@/components/dashboard/AdminTableView";
import { FilterDrawer } from "@/components/dashboard/FilterDrawer";

export default function Index() {
  const [view, setView] = useState<"card" | "table">("card");
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<"all" | "automatic" | "manual">("all");
  const [providerFilter, setProviderFilter] = useState<"all" | "google" | "microsoft">("all");
  
  const { admins, emails, refetchAdmins, refetchEmails } = useAdminData(selectedAdminId);

  const handleUpdate = () => {
    refetchAdmins();
    refetchEmails();
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentMethod = paymentMethodFilter === "all" || 
      admin.payment_method === paymentMethodFilter;
    
    const matchesProvider = providerFilter === "all" || 
      admin.provider === providerFilter;

    return matchesSearch && matchesPaymentMethod && matchesProvider;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminDashboardHeader
        view={view}
        onViewChange={setView}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        paymentMethodFilter={paymentMethodFilter}
        onPaymentMethodFilterChange={setPaymentMethodFilter}
        providerFilter={providerFilter}
        onProviderFilterChange={setProviderFilter}
        onUpdate={handleUpdate}
      />

      {view === "card" ? (
        <AdminCardView
          admins={filteredAdmins}
          emails={emails}
          onUpdate={handleUpdate}
        />
      ) : (
        <AdminTableView
          admins={filteredAdmins}
          emails={emails}
          onUpdate={handleUpdate}
        />
      )}

      <FilterDrawer
        paymentMethodFilter={paymentMethodFilter}
        onPaymentMethodFilterChange={setPaymentMethodFilter}
        providerFilter={providerFilter}
        onProviderFilterChange={setProviderFilter}
      />
    </div>
  );
}