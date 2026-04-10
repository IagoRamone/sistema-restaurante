"use client";

import { useState } from "react";
import { createUser, deleteUser, type UserProfile } from "@/app/actions/users";
import { useRouter } from "next/navigation";

export default function UsersPanel({
  users: initialUsers,
  currentUserId,
}: {
  users: UserProfile[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "garcom">("garcom");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await createUser(name, email, password, role);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }
    // Recarrega a lista
    router.refresh();
    setShowForm(false);
    setName("");
    setEmail("");
    setPassword("");
    setRole("garcom");
    setLoading(false);
  }

  async function handleDelete(userId: string) {
    if (!confirm("Remover este usuário?")) return;
    setDeletingId(userId);
    const err = await deleteUser(userId);
    if (err) {
      alert(err);
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
    setDeletingId(null);
  }

  const roleLabel = { admin: "Administrador", garcom: "Garçom" };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-1 inline-block transition-colors">
              ← Voltar ao mapa
            </a>
            <h1 className="text-2xl font-bold text-white">Usuários</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-semibold transition-colors"
          >
            {showForm ? "Cancelar" : "+ Novo usuário"}
          </button>
        </div>

        {/* Formulário de criação */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800 space-y-4"
          >
            <h2 className="text-lg font-semibold text-white">Novo usuário</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="João Silva"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="joao@restaurante.com"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="mínimo 6 caracteres"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Cargo</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "admin" | "garcom")}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="garcom">Garçom</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950/50 px-4 py-2.5 rounded-lg border border-red-900">
                {error}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-900 rounded-xl text-sm font-semibold transition-colors"
              >
                {loading ? "Criando..." : "Criar usuário"}
              </button>
            </div>
          </form>
        )}

        {/* Lista de usuários */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-12">Nenhum usuário encontrado.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cargo</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-red-900/60 text-red-300"
                            : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        {roleLabel[u.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== currentUserId && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={deletingId === u.id}
                          className="text-xs text-gray-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                        >
                          {deletingId === u.id ? "Removendo..." : "Remover"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
