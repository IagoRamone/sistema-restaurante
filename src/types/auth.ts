export type UserRole = 'gerente' | 'recepcionista'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
}
