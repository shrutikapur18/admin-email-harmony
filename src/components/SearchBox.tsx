import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBox = ({ 
  value, 
  onChange, 
  placeholder = "Search admins and emails...",
  className = ""
}: SearchBoxProps) => {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 w-full h-10 bg-white"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-400" />
        </Button>
      )}
    </div>
  );
};