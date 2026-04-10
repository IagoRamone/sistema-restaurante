import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UsersPanel from "./UsersPanel";
import { listUsers } from "@/app/actions/users";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const users = await listUsers();

  return <UsersPanel users={users} currentUserId={user.id} />;
}
