import { auth } from "@/auth";
import { CategoriesManager } from "@/components/CategoriesManager";

export default async function CategoriesPage() {
  const session = await auth();

  return <CategoriesManager token={session?.backendToken ?? ""} />;
}
