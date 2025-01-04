import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminFormDialog } from "@/components/AdminFormDialog";

interface CreateAdminButtonProps {
  onAdminCreated: () => void;
}

export const CreateAdminButton = ({ onAdminCreated }: CreateAdminButtonProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Admin
      </Button>
      <AdminFormDialog 
        open={open} 
        onOpenChange={setOpen}
        onAdminCreated={onAdminCreated}
      />
    </>
  );
};