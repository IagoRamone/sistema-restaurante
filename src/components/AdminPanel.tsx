'use client'

import { useActionState, useState } from 'react'
import { createUser } from '@/app/actions/admin'
import type { Profile } from '@/types/auth'

export default function AdminPanel({ users }: { users: Profile[] }) {
  const [showForm, setShowForm] = useState(false)

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      const result = await createUser(formData)
      if (result.success) {
        setShowForm(false)
      }
      return result
    },
    null
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-gray-400">Gerenciamento de usuarios</p>
          </div>
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Voltar ao Mapa
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Add user button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Usuarios ({users.length})</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            {showForm ? 'Cancelar' : 'Novo Usuario'}
          </button>
        </div>

        {/* Create user form */}
        {showForm && (
          <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
            <h3 className="text-base font-semibold mb-4">Criar novo usuario</h3>
            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="full_name" className="block text-sm text-gray-400 mb-1">
                    Nome completo
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                    placeholder="Maria Silva"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                    placeholder="maria@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
                    Senha
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                    placeholder="Min. 6 caracteres"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm text-gray-400 mb-1">
                    Cargo
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                  >
                    <option value="recepcionista">Recepcionista</option>
                    <option value="gerente">Gerente</option>
                  </select>
                </div>
              </div>

              {state?.error && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg px-4 py-2 text-red-300 text-sm">
                  {state.error}
                </div>
              )}

              {state?.success && (
                <div className="bg-emerald-900/50 border border-emerald-700 rounded-lg px-4 py-2 text-emerald-300 text-sm">
                  Usuario criado com sucesso!
                </div>
              )}

              <button
                type="submit"
                disabled={pending}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                {pending ? 'Criando...' : 'Criar Usuario'}
              </button>
            </form>
          </div>
        )}

        {/* Users list */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-4 py-3 font-medium">Nome</th>
                <th className="text-left px-4 py-3 font-medium">E-mail</th>
                <th className="text-left px-4 py-3 font-medium">Cargo</th>
                <th className="text-left px-4 py-3 font-medium">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-white">{u.full_name}</td>
                  <td className="px-4 py-3 text-gray-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        u.role === 'gerente'
                          ? 'bg-red-900/50 text-red-300'
                          : 'bg-blue-900/50 text-blue-300'
                      }`}
                    >
                      {u.role === 'gerente' ? 'Gerente' : 'Recepcionista'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(u.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Nenhum usuario encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
