import React, { useState } from "react";
import { AdminAccount } from "@/types/admin";
import { useAdminData } from "@/hooks/useAdminData";
import { AdminDashboardHeader } from "@/components/dashboard/AdminDashboardHeader";
import { AdminCardView } from "@/components/dashboard/AdminCardView";
import { FilterDrawer } from "@/components/dashboard/FilterDrawer";

type PaymentMethodType = "all" | "automatic" | "manual";
type ProviderType = "all" | "google" | "microsoft";

export default function Index() {
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("all");
  const [provider, setProvider] = useState<ProviderType>("all");
  
  const { admins, emails, refetchAdmins, refetchEmails } = useAdminData(selectedAdminId);

  const handleSelectAdmin = (admin: AdminAccount) => {
    setSelectedAdminId(admin.id);
  };

  const handlePaymentMethodChange = (value: PaymentMethodType) => {
    setPaymentMethod(value);
  };

  const handleProviderChange = (value: ProviderType) => {
    setProvider(value);
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
        setPaymentMethod={handlePaymentMethodChange}
        provider={provider}
        setProvider={handleProviderChange}
      />
    </div>
  );
}