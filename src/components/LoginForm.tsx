'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import BraseiroLogo from './BraseiroLogo'

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string } | null, formData: FormData) => {
      const result = await login(formData)
      return result ?? null
    },
    null
  )

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BraseiroLogo />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gray-700" />
          <span className="text-xs tracking-widest text-gray-500 uppercase">Acesso ao Sistema</span>
          <div className="h-px flex-1 bg-gray-700" />
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white font-semibold rounded-lg transition cursor-pointer"
          >
            {pending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
