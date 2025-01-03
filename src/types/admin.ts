export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  provider: string;
  notes?: string;
}

export interface EmailAccount {
  id: string;
  admin_id: string;
  email: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  provider: string;
  account_type: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: "create" | "update" | "delete";
  entityType: "admin" | "email";
  entityId: string;
  description: string;
}