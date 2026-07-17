"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Spinner } from "@/components/Spinner";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales inválidas");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-black/[.08] bg-white p-8 dark:border-white/[.145] dark:bg-zinc-950"
      >
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Iniciar sesión
        </h1>

        {justRegistered && !error && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Cuenta creada. Iniciá sesión para continuar.
          </p>
        )}

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

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {isSubmitting && <Spinner />}
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>

        <a
          href="/register"
          className="text-center text-sm text-zinc-600 underline dark:text-zinc-400"
        >
          Crear una cuenta
        </a>
      </form>
    </div>
  );
}
