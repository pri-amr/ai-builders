import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-4 dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Dashboard
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Sesión iniciada como {session?.user?.email}
      </p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="rounded-full border border-black/[.08] px-5 py-2 text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
