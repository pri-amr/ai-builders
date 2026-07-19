"use client";

import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import {
  listMoneySources,
  createMoneySource,
  type MoneySource,
} from "@/services/moneySources";
import { Spinner } from "@/components/Spinner";

type Props = {
  token: string;
};

export function MoneySourcesManager({ token }: Props) {
  const [sources, setSources] = useState<MoneySource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSources() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const data = await listMoneySources(token);
        if (!cancelled) {
          setSources(data);
        }
      } catch {
        if (!cancelled) {
          setLoadError("No se pudieron cargar las fuentes de dinero");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSources();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("El nombre es obligatorio");
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await createMoneySource(token, name.trim());
      setSources((previous) =>
        [...previous, created].sort((a, b) => a.name.localeCompare(b.name))
      );
      setName("");
    } catch (err) {
      const message =
        (axios.isAxiosError(err) && err.response?.data?.error) ||
        "No se pudo crear la fuente de dinero";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Fuentes de dinero
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950"
        >
          {formError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {formError}
            </p>
          )}

          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Nombre
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-black dark:border-white/[.145] dark:text-zinc-50"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Agregando..." : "Agregar fuente"}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
          {isLoading && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Cargando...
            </p>
          )}

          {!isLoading && loadError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {loadError}
            </p>
          )}

          {!isLoading && !loadError && sources.length === 0 && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Todavía no tenés fuentes de dinero.
            </p>
          )}

          {!isLoading && !loadError && sources.length > 0 && (
            <ul className="flex flex-col gap-2">
              {sources.map((source) => (
                <li
                  key={source.id}
                  className="text-sm text-black dark:text-zinc-50"
                >
                  {source.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <a
          href="/dashboard"
          className="mt-6 block text-center text-sm text-zinc-600 underline dark:text-zinc-400"
        >
          Volver al dashboard
        </a>
      </div>
    </div>
  );
}
