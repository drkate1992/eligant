"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAddBeneficiary } from "@/hooks/useTransfer";
import { toast } from "@/lib/toast-store";
import { FetchError } from "@/lib/api-client";

export function AddBeneficiaryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const add = useAddBeneficiary();
  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");

  async function submit() {
    if (!name || !accountNumber)
      return toast.error("Missing details", "Name and account are required.");
    try {
      await add.mutateAsync({ name, accountNumber, bankName });
      toast.success("Beneficiary added", name);
      setName("");
      setAccountNumber("");
      setBankName("");
      onClose();
    } catch (e) {
      toast.error(
        "Could not add",
        e instanceof FetchError ? e.message : "Try again.",
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Beneficiary"
      subtitle="Save a recipient for faster transfers"
    >
      <div className="space-y-4">
        <div>
          <Label>Full Name</Label>
          <Input
            placeholder="James Carter"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label>Account Number</Label>
          <Input
            placeholder="0123456789"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>
        <div>
          <Label>Bank Name (optional)</Label>
          <Input
            placeholder="Unity Financial"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </div>
        <div className="flex gap-3 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={submit} loading={add.isPending} className="flex-1">
            Add Beneficiary
          </Button>
        </div>
      </div>
    </Modal>
  );
}
