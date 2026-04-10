"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface UserProfile {
  id: string;
  name: string;
  role: "admin" | "garcom";
  email: string;
  created_at: string;
}

export async function listUsers(): Promise<UserProfile[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Acesso negado");

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) throw new Error(error.message);

  const { data: profiles } = await supabase.from("profiles").select("*");
  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

  return data.users.map((u) => ({
    id: u.id,
    name: profileMap[u.id]?.name ?? u.email ?? "—",
    role: profileMap[u.id]?.role ?? "garcom",
    email: u.email ?? "—",
    created_at: u.created_at,
  }));
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: "admin" | "garcom"
): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "Não autenticado";

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return "Acesso negado";

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return error.message;

  const { error: profileError } = await admin
    .from("profiles")
    .insert({ id: data.user.id, name, role });

  if (profileError) return profileError.message;

  return null;
}

export async function deleteUser(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "Não autenticado";

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return "Acesso negado";
  if (userId === user.id) return "Não é possível remover sua própria conta";

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return error.message;
  return null;
}
