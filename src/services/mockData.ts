import { AdminAccount, EmailAccount, ActivityLog } from "@/types/admin";

export const mockAdmins: AdminAccount[] = [
  {
    id: "1",
    name: "John Admin",
    email: "john.admin@workspace.com",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-02-15",
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "sarah.manager@workspace.com",
    status: "active",
    createdAt: "2024-01-02",
    lastLogin: "2024-02-14",
  },
];

export const mockEmails: EmailAccount[] = [
  {
    id: "1",
    adminId: "1",
    email: "user1@workspace.com",
    status: "active",
    createdAt: "2024-01-03",
    lastLogin: "2024-02-13",
  },
  {
    id: "2",
    adminId: "1",
    email: "user2@workspace.com",
    status: "active",
    createdAt: "2024-01-04",
    lastLogin: "2024-02-12",
  },
  {
    id: "3",
    adminId: "2",
    email: "user3@workspace.com",
    status: "inactive",
    createdAt: "2024-01-05",
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