"use client";

import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { listMoneySources, type MoneySource } from "@/services/moneySources";
import { listCategories, type Category } from "@/services/categories";
import {
  createTransaction,
  type Transaction,
  type TransactionType,
  type Currency,
} from "@/services/transactions";
import { isoDateToDDMMYYYY } from "@/utils/date";
import { Spinner } from "@/components/Spinner";

type Props = {
  token: string;
  onCreated?: (transaction: Transaction) => void;
};

export function TransactionForm({ token, onCreated }: Props) {
  const [moneySources, setMoneySources] = useState<MoneySource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [moneySourceId, setMoneySourceId] = useState("");
  const [currency, setCurrency] = useState<Currency | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      setIsLoadingOptions(true);
      setOptionsError(null);

      try {
        const [sources, cats] = await Promise.all([
          listMoneySources(token),
          listCategories(token),
        ]);
        if (!cancelled) {
          setMoneySources(sources);
          setCategories(cats);
        }
      } catch {
        if (!cancelled) {
          setOptionsError(
            "No se pudieron cargar las fuentes de dinero y categorías"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingOptions(false);
        }
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!amount.trim()) {
      setError("El monto es obligatorio");
      return;
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) {
      setError("El monto debe ser un número válido");
      return;
    }
    if (numericAmount <= 0) {
      setError("El monto debe ser mayor a cero");
      return;
    }

    if (!moneySourceId) {
      setError("La fuente de dinero es obligatoria");
      return;
    }

    if (!currency) {
      setError("La moneda es obligatoria");
      return;
    }

    if (!categoryId) {
      setError("La categoría es obligatoria");
      return;
    }

    if (!date) {
      setError("La fecha es obligatoria");
      return;
    }

    if (!description.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await createTransaction(token, {
        type,
        amount: numericAmount,
        moneySourceId,
        currency,
        categoryId,
        date: isoDateToDDMMYYYY(date),
        description: description.trim(),
      });

      setType("expense");
      setAmount("");
      setMoneySourceId("");
      setCurrency("");
      setCategoryId("");
      setDate("");
      setDescription("");

      onCreated?.(created);
    } catch (err) {
      const message =
        (axios.isAxiosError(err) && err.response?.data?.error) ||
        "No se pudo guardar la transacción";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-black dark:border-white/[.145] dark:text-zinc-50";
  const labelClassName =
    "flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950"
    >
      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
        Nueva transacción
      </h2>

      {optionsError && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {optionsError}
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <fieldset className="flex gap-4 text-sm text-zinc-700 dark:text-zinc-300">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="type"
            value="expense"
            checked={type === "expense"}
            onChange={() => setType("expense")}
          />
          Egreso
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="type"
            value="income"
            checked={type === "income"}
            onChange={() => setType("income")}
          />
          Ingreso
        </label>
      </fieldset>

      <label className={labelClassName}>
        Monto
        <input
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className={inputClassName}
        />
      </label>

      <label className={labelClassName}>
        Fuente de dinero
        <select
          value={moneySourceId}
          onChange={(event) => setMoneySourceId(event.target.value)}
          disabled={isLoadingOptions}
          className={inputClassName}
        >
          <option value="">Seleccioná una fuente</option>
          {moneySources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClassName}>
        Moneda
        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value as Currency)}
          className={inputClassName}
        >
          <option value="">Seleccioná una moneda</option>
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
        </select>
      </label>

      <label className={labelClassName}>
        Categoría
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          disabled={isLoadingOptions}
          className={inputClassName}
        >
          <option value="">Seleccioná una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClassName}>
        Fecha
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className={inputClassName}
        />
      </label>

      <label className={labelClassName}>
        Descripción
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={inputClassName}
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting || isLoadingOptions}
        className="flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {isSubmitting && <Spinner />}
        {isSubmitting ? "Guardando..." : "Guardar transacción"}
      </button>
    </form>
  );
}
