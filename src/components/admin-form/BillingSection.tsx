import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BillingSectionProps {
  billingDate: Date | undefined;
  setBillingDate: (date: Date | undefined) => void;
  paymentMethod: "automatic" | "manual";
  setPaymentMethod: (value: "automatic" | "manual") => void;
  billingAmount: string;
  setBillingAmount: (value: string) => void;
  numSecondaryAccounts: string;
  setNumSecondaryAccounts: (value: string) => void;
}

export const BillingSection: React.FC<BillingSectionProps> = ({
  billingDate,
  setBillingDate,
  paymentMethod,
  setPaymentMethod,
  billingAmount,
  setBillingAmount,
  numSecondaryAccounts,
  setNumSecondaryAccounts,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Billing Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !billingDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {billingDate ? format(billingDate, "PPP") : "Select billing date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={billingDate}
              onSelect={setBillingDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <Select value={paymentMethod} onValueChange={(value: "automatic" | "manual") => setPaymentMethod(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="automatic">Automatic</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingAmount">Billing Amount ($)</Label>
        <Input
          id="billingAmount"
          type="number"
          value={billingAmount}
          onChange={(e) => setBillingAmount(e.target.value)}
          placeholder="Enter billing amount"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="numSecondaryAccounts">Number of Secondary Email Accounts</Label>
        <Input
          id="numSecondaryAccounts"
          type="number"
          value={numSecondaryAccounts}
          onChange={(e) => setNumSecondaryAccounts(e.target.value)}
          placeholder="Enter number of accounts"
          required
        />
      </div>
    </div>
  );
};