export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;
}

export interface EmailAccount {
  id: string;
  adminId: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: "create" | "update" | "delete";
  entityType: "admin" | "email";
  entityId: string;
  description: string;
}