import React from "react";
import { ActivityLog } from "@/types/admin";
import { Card } from "@/components/ui/card";

interface ActivityLogListProps {
  logs: ActivityLog[];
  className?: string;
}

const ActivityLogList: React.FC<ActivityLogListProps> = ({ logs, className }) => {
  const getActionColor = (action: ActivityLog["action"]) => {
    switch (action) {
      case "create":
        return "text-green-600";
      case "update":
        return "text-blue-600";
      case "delete":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {logs.map((log) => (
        <Card key={log.id} className="p-3">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${getActionColor(log.action)}`}>
              {log.action.toUpperCase()}
            </span>
            <span className="text-gray-600">{log.description}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(log.timestamp).toLocaleString()}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default ActivityLogList;