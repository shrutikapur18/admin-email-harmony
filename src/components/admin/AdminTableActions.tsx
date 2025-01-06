import React from "react";
import { CsvUploadButton } from "../CsvUploadButton";
import { ExportToCsvButton } from "../ExportToCsvButton";
import { AdminAccount, EmailAccount } from "@/types/admin";
import { SearchBox } from "../SearchBox";

interface AdminTableActionsProps {
  admins: AdminAccount[];
  emails: EmailAccount[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onUpdate: () => void;
}

export const AdminTableActions = ({
  admins,
  emails,
  searchTerm,
  onSearchChange,
  onUpdate,
}: AdminTableActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
      <SearchBox
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search admins and secondary emails..."
        className="w-full sm:w-96"
      />
      <div className="flex gap-3 w-full sm:w-auto">
        <CsvUploadButton onUploadComplete={onUpdate} />
        <ExportToCsvButton admins={admins} emails={emails} />
      </div>
    </div>
  );
};