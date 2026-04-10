'use client'

import { logout } from '@/app/actions/auth'

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="text-sm text-gray-500 hover:text-gray-300 transition cursor-pointer"
    >
      Sair
    </button>
  )
}
