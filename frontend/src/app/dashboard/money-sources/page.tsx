import { auth } from "@/auth";
import { MoneySourcesManager } from "@/components/MoneySourcesManager";

export default async function MoneySourcesPage() {
  const session = await auth();

  return <MoneySourcesManager token={session?.backendToken ?? ""} />;
}
