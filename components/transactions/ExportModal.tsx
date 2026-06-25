"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label, Select } from "@/components/ui/Input";
import { useAccounts } from "@/hooks/useAccounts";
import { buildQuery } from "@/lib/api-client";
import { toast } from "@/lib/toast-store";

export function ExportModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: accounts } = useAccounts();
  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function download() {
    const qs = buildQuery({ accountId, type, startDate, endDate });
    const url = `/api/export/transactions${qs}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Export started", "Your CSV is downloading.");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export Transactions"
      subtitle="Download a CSV of your transaction history"
    >
      <div className="space-y-4">
        <div>
          <Label>Account</Label>
          <Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="">All accounts</option>
            {(accounts ?? []).map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Type</Label>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="ALL">All</option>
            <option value="CREDIT">Credits</option>
            <option value="DEBIT">Debits</option>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>From</Label>
            <input
              type="date"
              className="ufg-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label>To</Label>
            <input
              type="date"
              className="ufg-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={download} className="w-full">
          <Download size={15} /> Download CSV
        </Button>
      </div>
    </Modal>
  );
}
