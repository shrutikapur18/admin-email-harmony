export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  provider: string;
  notes?: string;
  billing_date?: string;
  payment_method?: "automatic" | "manual";
  billing_amount?: number;
  num_secondary_accounts?: number;
  enable_reminders?: boolean;
  reminder_frequency?: string;
  delivery_method?: string;
  password?: string;
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