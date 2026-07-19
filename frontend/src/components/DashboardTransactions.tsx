"use client";

import { useState } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import type { Transaction } from "@/services/transactions";

type Props = {
  token: string;
};

export function DashboardTransactions({ token }: Props) {
  const [lastCreated, setLastCreated] = useState<Transaction | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      {lastCreated && (
        <p
          role="status"
          className="text-sm text-green-600 dark:text-green-400"
        >
          Transacción guardada: {lastCreated.description} (
          {lastCreated.amount} {lastCreated.currency})
        </p>
      )}
      <TransactionForm token={token} onCreated={setLastCreated} />
    </div>
  );
}
