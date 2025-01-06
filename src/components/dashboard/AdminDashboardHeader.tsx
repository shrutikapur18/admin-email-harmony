import React from "react";
import { CreateAdminButton } from "@/components/CreateAdminButton";
import { SearchBox } from "@/components/SearchBox";

interface AdminDashboardHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const AdminDashboardHeader = ({
  searchTerm,
  setSearchTerm,
}: AdminDashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Workspace Admin Manager
      </h1>
      <div className="w-full sm:w-auto flex items-center gap-2">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search admins and emails..."
          className="w-full sm:w-80"
        />
        <CreateAdminButton onAdminCreated={() => {}} />
      </div>
    </div>
  );
};