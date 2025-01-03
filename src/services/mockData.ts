import { AdminAccount, EmailAccount, ActivityLog } from "@/types/admin";

export const mockAdmins: AdminAccount[] = [
  {
    id: "1",
    name: "John Admin",
    email: "john.admin@workspace.com",
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-02-15",
    provider: "google",
    notes: "Primary admin account"
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "sarah.manager@workspace.com",
    status: "active",
    created_at: "2024-01-02",
    updated_at: "2024-02-14",
    provider: "microsoft",
    notes: "Secondary admin account"
  },
];

export const mockEmails: EmailAccount[] = [
  {
    id: "1",
    admin_id: "1",
    email: "user1@workspace.com",
    status: "active",
    created_at: "2024-01-03",
    updated_at: "2024-02-13",
    provider: "google",
    account_type: "secondary",
    notes: "Marketing team account"
  },
  {
    id: "2",
    admin_id: "1",
    email: "user2@workspace.com",
    status: "active",
    created_at: "2024-01-04",
    updated_at: "2024-02-12",
    provider: "google",
    account_type: "secondary",
    notes: "Sales team account"
  },
  {
    id: "3",
    admin_id: "2",
    email: "user3@workspace.com",
    status: "inactive",
    created_at: "2024-01-05",
    updated_at: "2024-01-05",
    provider: "microsoft",
    account_type: "secondary",
    notes: "Archived account"
  },
];

export const mockLogs: ActivityLog[] = [
  {
    id: "1",
    timestamp: "2024-02-15T10:00:00Z",
    action: "create",
    entityType: "admin",
    entityId: "1",
    description: "Created new admin account: John Admin",
  },
  {
    id: "2",
    timestamp: "2024-02-15T11:00:00Z",
    action: "create",
    entityType: "email",
    entityId: "1",
    description: "Added email account: user1@workspace.com",
  },
];