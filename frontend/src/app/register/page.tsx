"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { registerUser } from "@/services/session";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser(email, password);
      router.push("/login?registered=1");
    } catch (err) {
      const message =
        (axios.isAxiosError(err) && err.response?.data?.error) ||
        "No se pudo registrar el usuario";
      setError(message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-black/[.08] bg-white p-8 dark:border-white/[.145] dark:bg-zinc-950"
      >
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Crear cuenta
        </h1>

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-black dark:border-white/[.145] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-black dark:border-white/[.145] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          Confirmar contraseña
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-black dark:border-white/[.145] dark:text-zinc-50"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-foreground px-5 py-2 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <a
          href="/login"
          className="text-center text-sm text-zinc-600 underline dark:text-zinc-400"
        >
          Ya tengo cuenta
        </a>
      </form>
    </div>
  );
}
