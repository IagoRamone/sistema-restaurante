import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import FloorMap from "@/components/FloorMap";
import { defaultLayout } from "@/data/floor-layout";
import type { UserRole } from "@/types/auth";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [{ data: profile }, { data: tableStates }] = await Promise.all([
    admin
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single(),
    admin
      .from("table_states")
      .select("*"),
  ]);

  const userRole: UserRole = profile?.role ?? "recepcionista";
  const userName: string = profile?.full_name || user.email || "";

  return (
    <main className="h-screen flex flex-col">
      <FloorMap
        layout={defaultLayout}
        userRole={userRole}
        userName={userName}
        initialTableStates={tableStates ?? []}
      />
    </main>
  );
}
